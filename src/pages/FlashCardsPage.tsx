import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FlashCard } from '../components/features/FlashCards/FlashCard';
import { Button } from '../components/Button';
import { GlassCard } from '../components/GlassCard';
import { ArrowLeft, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SRSService } from '../services/srs/SRSService';
import { useAuth } from '../contexts/AuthContext';
import { useProgress } from '../hooks/useProgress';
import { getCategoriesByLevel, getCategoryById } from '../data/vocabulary';

interface WordCard {
    id: string;
    word: string;
    translation: string;
    example?: string;
}

// CEFR Levels
const levels = [
    { id: 'a1', name: 'A1 - Anfänger', nameRu: 'Начальный', icon: '🌱', color: 'from-green-400 to-green-600', description: 'Grundlegende Wörter' },
    { id: 'a2', name: 'A2 - Grundlegend', nameRu: 'Элементарный', icon: '🌿', color: 'from-blue-400 to-blue-600', description: 'Alltägliche Ausdrücke' },
    { id: 'b1', name: 'B1 - Mittelstufe', nameRu: 'Средний', icon: '🌳', color: 'from-purple-400 to-purple-600', description: 'Komplexere Themen' },
    { id: 'b2', name: 'B2 - Fortgeschritten', nameRu: 'Продвинутый', icon: '🎓', color: 'from-red-400 to-red-600', description: 'Abstrakte Konzepte' }
];

// German translations for category names
const germanNames: Record<string, string> = {
    'Numbers': 'Zahlen',
    'Family & People': 'Familie & Menschen',
    'Colors': 'Farben',
    'Body Parts': 'Körperteile',
    'Food & Drink': 'Essen & Trinken',
    'Fruits & Vegetables': 'Obst & Gemüse',
    'Home & Furniture': 'Haus & Möbel',
    'Time & Calendar': 'Zeit & Kalender',
    'Weather & Seasons': 'Wetter & Jahreszeiten',
    'Basic Verbs': 'Grundverben',
    'Basic Adjectives': 'Grundadjektive',
    'School Supplies': 'Schulsachen',
    'Animals': 'Tiere',
    'Clothing Basics': 'Grundkleidung',
    'Shopping & Money': 'Einkaufen & Geld',
    'Clothing & Accessories': 'Kleidung & Accessoires',
    'Health & Medicine': 'Gesundheit & Medizin',
    'Hobbies & Free Time': 'Hobbys & Freizeit',
    'Sports': 'Sport',
    'Transportation & Vehicles': 'Transport & Fahrzeuge',
    'City & Places': 'Stadt & Orte',
    'Nature & Plants': 'Natur & Pflanzen',
    'Emotions & Feelings': 'Emotionen & Gefühle',
    'Restaurant & Dining': 'Restaurant & Essen',
    'Technology Basics': 'Technologie-Grundlagen',
    'Professions': 'Berufe',
    'More Verbs': 'Weitere Verben',
    'Work & Career': 'Arbeit & Karriere',
    'Education & Learning': 'Bildung & Lernen',
    'Travel & Tourism': 'Reisen & Tourismus',
    'Relationships & Social Life': 'Beziehungen & Soziales Leben',
    'Media & Communication': 'Medien & Kommunikation',
    'Environment & Nature': 'Umwelt & Natur',
    'Culture & Entertainment': 'Kultur & Unterhaltung',
    'Housing & Living': 'Wohnen & Leben',
    'Advanced Verbs': 'Fortgeschrittene Verben',
    'Advanced Adjectives': 'Fortgeschrittene Adjektive',
    'Politics & Society': 'Politik & Gesellschaft',
    'Economy & Business': 'Wirtschaft & Geschäft',
    'Science & Technology': 'Wissenschaft & Technologie',
    'Law & Justice': 'Recht & Justiz',
    'Abstract Concepts': 'Abstrakte Konzepte',
    '1 Modul': '1 Modul'
};

export const FlashCardsPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { level, categoryId } = useParams<{ level?: string; categoryId?: string }>();
    const { addXP } = useProgress();

    const [cards, setCards] = useState<WordCard[]>([]);
    const [loading, setLoading] = useState(false);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [knownCards, setKnownCards] = useState<string[]>([]);
    const [unknownCards, setUnknownCards] = useState<string[]>([]);
    const [showCompletion, setShowCompletion] = useState(false);

    useEffect(() => {
        if (categoryId) {
            loadCards();
        }
    }, [categoryId, user?.id]);

    const loadCards = async () => {
        setLoading(true);
        try {
            const category = getCategoryById(categoryId || '');

            if (category) {
                const loadedCards: WordCard[] = category.words.map(word => ({
                    id: word.id,
                    word: word.german,
                    translation: word.russian,
                    example: word.example
                }));

                setCards(loadedCards);
            } else {
                setCards([]);
            }
        } catch (error) {
            console.error('Failed to load cards:', error);
            setCards([]);
        } finally {
            setLoading(false);
        }
    };

    const currentCard = cards[currentIndex];
    const progress = cards.length > 0 ? ((currentIndex + 1) / cards.length) * 100 : 0;

    const handleKnown = async () => {
        if (!currentCard) return;

        setKnownCards([...knownCards, currentCard.id]);

        try {
            await SRSService.reviewCard(currentCard.id, true, user?.id);
            if (addXP) await addXP(5);
        } catch (error) {
            console.error('Failed to update SRS:', error);
        }

        moveToNext();
    };

    const handleUnknown = async () => {
        if (!currentCard) return;

        setUnknownCards([...unknownCards, currentCard.id]);

        try {
            await SRSService.reviewCard(currentCard.id, false, user?.id);
            if (addXP) await addXP(1);
        } catch (error) {
            console.error('Failed to update SRS:', error);
        }

        moveToNext();
    };

    const moveToNext = () => {
        if (currentIndex < cards.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setShowCompletion(true);
        }
    };

    const handleRestart = () => {
        setCurrentIndex(0);
        setKnownCards([]);
        setUnknownCards([]);
        setShowCompletion(false);
    };

    // VIEW 1: Level Selection (no params)
    if (!level && !categoryId) {
        return (
            <div className="min-h-screen py-8 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center mb-8">
                        <Button onClick={() => navigate('/')} variant="secondary">
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Zurück
                        </Button>
                        <h1 className="text-3xl font-bold text-gray-800 ml-4">Lernkarten - Level wählen</h1>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {levels.map(lvl => {
                            const categories = getCategoriesByLevel(lvl.id.toUpperCase() as 'A1' | 'A2' | 'B1' | 'B2');
                            const totalWords = categories.reduce((sum, cat) => sum + cat.wordCount, 0);

                            return (
                                <GlassCard
                                    key={lvl.id}
                                    className="p-6 cursor-pointer hover:scale-105 transition-transform"
                                    onClick={() => navigate(`/flashcards/${lvl.id}`)}
                                >
                                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${lvl.color} flex items-center justify-center mb-4 text-4xl shadow-lg`}>
                                        {lvl.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{lvl.name}</h3>
                                    <p className="text-gray-600 mb-3">{lvl.description}</p>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500">{categories.length} Kategorien</span>
                                        <span className="font-bold text-blue-600">{totalWords} Wörter</span>
                                    </div>
                                </GlassCard>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    // VIEW 2: Category Selection (level but no categoryId)
    if (level && !categoryId) {
        const selectedLevel = levels.find(l => l.id === level);
        const categories = getCategoriesByLevel(level.toUpperCase() as 'A1' | 'A2' | 'B1' | 'B2');

        if (!selectedLevel || categories.length === 0) {
            return (
                <div className="min-h-screen py-8 px-4 flex items-center justify-center">
                    <GlassCard className="p-8 text-center">
                        <p className="text-gray-700">Level nicht gefunden</p>
                        <Button onClick={() => navigate('/flashcards')} className="mt-4" variant="primary">
                            Zurück zur Übersicht
                        </Button>
                    </GlassCard>
                </div>
            );
        }

        return (
            <div className="min-h-screen py-8 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center mb-8">
                        <Button onClick={() => navigate('/flashcards')} variant="secondary">
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Zurück
                        </Button>
                        <div className="ml-4">
                            <h1 className="text-3xl font-bold text-gray-800">{selectedLevel.name}</h1>
                            <p className="text-gray-600">{selectedLevel.description}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {categories.map(cat => (
                            <GlassCard
                                key={cat.id}
                                className="p-5 cursor-pointer hover:scale-105 transition-transform"
                                onClick={() => navigate(`/flashcards/${level}/${cat.id}`)}
                            >
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${selectedLevel.color} flex items-center justify-center mb-3 text-2xl shadow-lg`}>
                                    {cat.icon}
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 mb-1">{germanNames[cat.name] || cat.name}</h3>
                                <p className="text-sm text-gray-500 mb-2">{cat.nameRu}</p>
                                <p className="text-gray-600 font-semibold">{cat.wordCount} Wörter</p>
                            </GlassCard>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen py-8 px-4 flex items-center justify-center">
                <GlassCard className="p-8">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-700">Karten werden geladen...</p>
                    </div>
                </GlassCard>
            </div>
        );
    }

    // Completion screen
    if (showCompletion) {
        return (
            <div className="min-h-screen py-8 px-4 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full"
                >
                    <GlassCard className="p-8 text-center">
                        <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">
                            Ausgezeichnet! 🎉
                        </h2>

                        <div className="space-y-3 mb-6">
                            <div className="flex items-center justify-between p-3 bg-green-100 rounded-lg">
                                <span className="text-gray-700">Gewusst:</span>
                                <span className="font-bold text-green-600">{knownCards.length}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-orange-100 rounded-lg">
                                <span className="text-gray-700">Wiederholen:</span>
                                <span className="font-bold text-orange-600">{unknownCards.length}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-blue-100 rounded-lg">
                                <span className="text-gray-700">Gesamt:</span>
                                <span className="font-bold text-blue-600">{cards.length}</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Button onClick={handleRestart} variant="primary" className="w-full">
                                Nochmal üben
                            </Button>
                            <Button onClick={() => navigate(`/flashcards/${level}`)} variant="secondary" className="w-full">
                                Zur Kategorie-Auswahl
                            </Button>
                            <Button onClick={() => navigate('/flashcards')} variant="secondary" className="w-full">
                                Zur Level-Auswahl
                            </Button>
                        </div>
                    </GlassCard>
                </motion.div>
            </div>
        );
    }

    // VIEW 3: FlashCard learning (level and categoryId present)
    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <Button onClick={() => navigate(`/flashcards/${level}`)} variant="secondary">
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Zurück
                    </Button>

                    <GlassCard className="px-6 py-3" animate={false}>
                        <div className="text-center">
                            <div className="text-sm text-gray-600">Fortschritt</div>
                            <div className="text-2xl font-bold text-gray-800">
                                {currentIndex + 1} / {cards.length}
                            </div>
                        </div>
                    </GlassCard>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-blue-400 to-purple-600"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                </div>

                {/* FlashCard */}
                <AnimatePresence mode="wait">
                    {currentCard && (
                        <motion.div
                            key={currentCard.id}
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            transition={{ duration: 0.3 }}
                        >
                            <FlashCard
                                word={currentCard.word}
                                translation={currentCard.translation}
                                example={currentCard.example}
                                onKnown={handleKnown}
                                onUnknown={handleUnknown}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-8 grid grid-cols-2 gap-4"
                >
                    <GlassCard className="p-4 text-center" animate={false}>
                        <div className="text-sm text-gray-600">Gewusst</div>
                        <div className="text-3xl font-bold text-green-600">
                            {knownCards.length}
                        </div>
                    </GlassCard>

                    <GlassCard className="p-4 text-center" animate={false}>
                        <div className="text-sm text-gray-600">Wiederholen</div>
                        <div className="text-3xl font-bold text-orange-600">
                            {unknownCards.length}
                        </div>
                    </GlassCard>
                </motion.div>
            </div>
        </div>
    );
};

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { FlashCard } from '../components/features/FlashCards/FlashCard';
import { Button } from '../components/Button';
import { GlassCard } from '../components/GlassCard';
import { ArrowLeft, Trophy, Zap, RotateCcw } from 'lucide-react';
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

interface SRSCard {
    wordId: string;
    repetitions: number;
    nextReviewDate: Date;
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
    '1 Modul': '1 Modul',
    '2 Modul': '2 Modul'
};

export const FlashCardsPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { level, categoryId } = useParams<{ level?: string; categoryId?: string }>();
    const [searchParams] = useSearchParams();
    const isSmartMode = searchParams.get('mode') === 'smart15';
    const { addXP } = useProgress();

    const [cards, setCards] = useState<WordCard[]>([]);
    const [loading, setLoading] = useState(false);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [knownCards, setKnownCards] = useState<string[]>([]);
    const [unknownCards, setUnknownCards] = useState<string[]>([]);
    const [showCompletion, setShowCompletion] = useState(false);
    const [levelDueCount, setLevelDueCount] = useState(0);

    // Fetch due count for the current level
    useEffect(() => {
        const fetchDueCount = async () => {
            if (level && !categoryId) {
                const srsCards = await SRSService.getCards(user?.id) as SRSCard[];
                const srsMap = new Map(srsCards.map(c => [c.wordId, c]));
                const now = new Date();
                const levelCategories = getCategoriesByLevel(level.toUpperCase() as 'A1' | 'A2' | 'B1' | 'B2');
                const allLevelWords = levelCategories.flatMap(cat => cat.words);

                const count = allLevelWords.filter(word => {
                    const srsCard = srsMap.get(word.id);
                    // Show in "Wiederholen" if:
                    // 1. Scheduled for review now (nextReviewDate <= now)
                    // 2. OR it's been reset for repetition (repetitions === 0)
                    return srsCard && (srsCard.nextReviewDate <= now || srsCard.repetitions === 0);
                }).length;

                setLevelDueCount(count);
            }
        };
        fetchDueCount();
    }, [level, categoryId, user?.id]);

    const loadCards = useCallback(async () => {
        setLoading(true);
        try {
            const category = getCategoryById(categoryId || '');

            if (category) {
                // Fetch SRS data to filter words
                const srsCards = await SRSService.getCards(user?.id) as SRSCard[];
                const now = new Date();

                let wordsToLoad = category.words.filter(word => {
                    const srsCard = srsCards.find(c => c.wordId === word.id);
                    // Show if:
                    // 1. New card (no srsCard)
                    // 2. OR due for review
                    // 3. OR reset for repetition
                    return !srsCard || srsCard.nextReviewDate <= now || srsCard.repetitions === 0;
                });

                if (isSmartMode) {
                    wordsToLoad = [...wordsToLoad]
                        .sort(() => Math.random() - 0.5)
                        .slice(0, 15);
                }

                const loadedCards: WordCard[] = wordsToLoad.map(word => ({
                    id: word.id,
                    word: word.german,
                    translation: word.russian,
                    example: word.example
                }));

                setCards(loadedCards);
            } else if (categoryId === 'review' && level) {
                // Special aggregated review mode
                const srsCards = await SRSService.getCards(user?.id) as SRSCard[];
                const now = new Date();

                const levelCategories = getCategoriesByLevel(level.toUpperCase() as 'A1' | 'A2' | 'B1' | 'B2');
                const allLevelWords = levelCategories.flatMap(cat => cat.words);

                const dueWords = allLevelWords.filter(word => {
                    const srsCard = srsCards.find(c => c.wordId === word.id);
                    return srsCard && (srsCard.nextReviewDate <= now || srsCard.repetitions === 0);
                });

                const loadedCards: WordCard[] = dueWords.map(word => ({
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
    }, [categoryId, level, user?.id, isSmartMode]);

    useEffect(() => {
        if (categoryId) {
            loadCards();
        }
    }, [categoryId, loadCards]);

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
                        <Button onClick={() => navigate('/')} variant="secondary" className="!p-3">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <h1 className="text-2xl sm:text-3xl font-black text-gray-800 ml-4">Lernkarten</h1>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-2 gap-3 sm:gap-6">
                        {levels.map(lvl => {
                            const categories = getCategoriesByLevel(lvl.id.toUpperCase() as 'A1' | 'A2' | 'B1' | 'B2');
                            const totalWords = categories.reduce((sum, cat) => sum + cat.wordCount, 0);

                            return (
                                <GlassCard
                                    key={lvl.id}
                                    className="p-3 sm:p-6 cursor-pointer hover:scale-[1.02] transition-transform h-full flex flex-col"
                                    onClick={() => navigate(`/flashcards/${lvl.id}`)}
                                >
                                    <div className={`w-10 h-10 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br ${lvl.color} flex items-center justify-center mb-2 sm:mb-4 text-xl sm:text-4xl shadow-lg`}>
                                        {lvl.icon}
                                    </div>
                                    <h3 className="text-sm sm:text-2xl font-black text-gray-800 mb-1 leading-tight mt-auto">{lvl.name}</h3>
                                    <p className="hidden sm:block text-gray-600 mb-3 text-sm">{lvl.description}</p>
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-[10px] sm:text-sm text-gray-500">
                                        <span>{categories.length} Kat.</span>
                                        <span className="font-bold text-blue-600">{totalWords} Wört.</span>
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
                        <Button onClick={() => navigate('/flashcards')} variant="secondary" className="!p-3">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <div className="ml-4">
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">{selectedLevel.name}</h1>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        {/* Review Card */}
                        {levelDueCount > 0 && (
                            <GlassCard
                                className="p-3 sm:p-5 cursor-pointer hover:scale-[1.02] transition-transform h-full flex flex-col border-2 border-indigo-400/30 bg-indigo-50/10"
                                onClick={() => navigate(`/flashcards/${level}/review`)}
                            >
                                <div className={`w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-2 sm:mb-3 text-lg sm:text-2xl shadow-lg text-white`}>
                                    <RotateCcw className="w-5 h-5 sm:w-8 sm:h-8" />
                                </div>
                                <h3 className="text-xs sm:text-lg font-black text-indigo-900 mb-0.5 leading-tight mt-auto">Wiederholen</h3>
                                <p className="text-[10px] sm:text-sm text-indigo-700 mb-2 line-clamp-1">Повторить всё</p>
                                <div className="mt-auto pt-2 border-t border-indigo-100 flex items-center justify-between">
                                    <p className="text-[10px] sm:text-sm text-indigo-800 font-black">{levelDueCount} Wörter</p>
                                </div>
                            </GlassCard>
                        )}

                        {categories.map(cat => (
                            <GlassCard
                                key={cat.id}
                                className="p-3 sm:p-5 cursor-pointer hover:scale-[1.02] transition-transform h-full flex flex-col relative group"
                                onClick={() => navigate(`/flashcards/${level}/${cat.id}`)}
                            >
                                <div className={`w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${selectedLevel.color} flex items-center justify-center mb-2 sm:mb-3 text-lg sm:text-2xl shadow-lg`}>
                                    {cat.icon}
                                </div>
                                <h3 className="text-xs sm:text-lg font-black text-gray-800 mb-0.5 leading-tight">{germanNames[cat.name] || cat.name}</h3>
                                <p className="text-[10px] sm:text-sm text-gray-500 mb-2 line-clamp-1">{cat.nameRu}</p>

                                <div className="mt-auto pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
                                    <p className="text-[10px] sm:text-sm text-gray-600 font-black">{cat.wordCount} <span className="hidden sm:inline">Wörter</span><span className="sm:hidden">W.</span></p>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/flashcards/${level}/${cat.id}?mode=smart15`);
                                        }}
                                        className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-600 text-white rounded-lg shadow-sm transition-all transform active:scale-95"
                                        title="Быстрая тренировка: 15 случайных слов"
                                    >
                                        <Zap className="w-3 sm:w-3.5 h-3.5 fill-current" />
                                        <span className="text-[10px] sm:text-xs font-bold whitespace-nowrap">je 15</span>
                                    </button>
                                </div>
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
                        {knownCards.length === 0 && unknownCards.length === 0 && cards.length === 0 ? (
                            <>
                                <div className="text-6xl mb-4">🏆</div>
                                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                                    Meisterhaft!
                                </h2>
                                <p className="text-gray-600 mb-6 font-medium">
                                    Все доступные слова в этой категории выучены. <br />
                                    Приходи позже, когда придет время повторения!
                                </p>
                            </>
                        ) : (
                            <>
                                <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
                                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                                    Ausgezeichnet! 🎉
                                </h2>
                            </>
                        )}

                        {(knownCards.length > 0 || unknownCards.length > 0 || cards.length > 0) && (
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
                        )}

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
                    <Button onClick={() => navigate(`/flashcards/${level}`)} variant="secondary" className="!p-3">
                        <ArrowLeft className="w-5 h-5" />
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

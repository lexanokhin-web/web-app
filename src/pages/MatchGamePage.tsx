import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MatchGame } from '../components/features/MatchGame/MatchGame';
import { Button } from '../components/Button';
import { ArrowLeft, Plus, X, FolderPlus, Download } from 'lucide-react';
import { useProgress } from '../hooks/useProgress';
import { useAudio } from '../contexts/AudioContext';
import useSound from 'use-sound';
import { GlassCard } from '../components/GlassCard';
import { allVocabularyCategories } from '../data/vocabulary';
import type { VocabularyCategory } from '../data/vocabulary/types';

// Sample vocabulary for Match Game
const sampleVocabulary = [
    { german: 'der Apfel', russian: 'яблоко' },
    { german: 'das Haus', russian: 'дом' },
    { german: 'die Katze', russian: 'кошка' },
    { german: 'der Hund', russian: 'собака' },
    { german: 'das Buch', russian: 'книга' },
    { german: 'der Tisch', russian: 'стол' },
    { german: 'die Schule', russian: 'школа' },
    { german: 'der Lehrer', russian: 'учитель' },
    { german: 'das Wasser', russian: 'вода' },
    { german: 'die Familie', russian: 'семья' }
];

interface CustomWord {
    german: string;
    russian: string;
}

interface WordBlock {
    id: string;
    name: string;
    words: CustomWord[];
    isVocabularyCategory?: boolean;
    vocabularyCategory?: VocabularyCategory;
}

const STORAGE_KEY = 'match_game_word_blocks';

export const MatchGamePage: React.FC = () => {
    const navigate = useNavigate();
    const { addXP } = useProgress();
    const { isMuted, volume } = useAudio();

    const [playCorrect] = useSound('/sounds/correct.mp3', { volume: isMuted ? 0 : volume });
    const [playIncorrect] = useSound('/sounds/incorrect.mp3', { volume: isMuted ? 0 : volume });
    const [playLevelUp] = useSound('/sounds/levelup.mp3', { volume: isMuted ? 0 : volume });

    const completionSoundPlayed = useRef(false);

    const [pairs, setPairs] = useState<{ de: string; ru: string }[]>([]);
    const [gameStarted, setGameStarted] = useState(false);

    // Block management
    const [blocks, setBlocks] = useState<WordBlock[]>([]);
    const [currentBlockId, setCurrentBlockId] = useState<string | null>(null);
    const [newBlockName, setNewBlockName] = useState('');
    const [showNewBlockInput, setShowNewBlockInput] = useState(false);

    // Word input
    const [newGerman, setNewGerman] = useState('');
    const [newRussian, setNewRussian] = useState('');
    const [importError, setImportError] = useState<string | null>(null);

    // Load blocks from localStorage on mount, and merge with updated vocabulary
    useEffect(() => {
        // 1. Generate fresh system blocks (to get latest names/data)
        const levelEmojis: Record<string, string> = {
            'A1': '🟢',
            'A2': '🔵',
            'B1': '🟠',
            'B2': '🟣'
        };

        const categoryTranslations: Record<string, string> = {
            // A1
            'Numbers': 'Zahlen',
            'Family & People': 'Familie und Menschen',
            'Colors': 'Farben',
            'Body Parts': 'Körperteile',
            'Food & Drink': 'Essen und Trinken',
            'Fruits & Vegetables': 'Obst und Gemüse',
            'Home & Furniture': 'Wohnen und Möbel',
            'Time & Calendar': 'Zeit und Kalender',
            'Weather & Seasons': 'Wetter und Jahreszeiten',
            'Basic Verbs': 'Grundlegende Verben',
            'Basic Adjectives': 'Grundlegende Adjektive',
            'School Supplies': 'Schulsachen',
            'Animals': 'Tiere',
            'Clothing Basics': 'Kleidung',

            // A2
            'Shopping & Money': 'Einkaufen und Geld',
            'Clothing & Accessories': 'Kleidung und Accessoires',
            'Health & Medicine': 'Gesundheit und Medizin',
            'Hobbies & Free Time': 'Hobbys und Freizeit',
            'Sports': 'Sport',
            'Transportation & Vehicles': 'Verkehr und Fahrzeuge',
            'City & Places': 'Stadt und Orte',
            'Nature & Plants': 'Natur und Pflanzen',
            'Emotions & Feelings': 'Gefühle und Emotionen',
            'Restaurant & Dining': 'Restaurant und Essen',
            'Technology Basics': 'Technologie',
            'Professions': 'Berufe',
            'More Verbs': 'Weitere Verben',

            // B1
            'Work & Career': 'Arbeit und Karriere',
            'Education & Learning': 'Bildung und Lernen',
            'Travel & Tourism': 'Reisen und Tourismus',
            'Relationships & Social Life': 'Beziehungen',
            'Media & Communication': 'Medien und Kommunikation',
            'Environment & Nature': 'Umwelt und Natur',
            'Culture & Entertainment': 'Kultur und Unterhaltung',
            'Housing & Living': 'Wohnen und Leben',
            'Advanced Verbs': 'Fortgeschrittene Verben',
            'Advanced Adjectives': 'Fortgeschrittene Adjektive',

            // B2
            'Politics & Society': 'Politik und Gesellschaft',
            'Economy & Business': 'Wirtschaft',
            'Science & Technology': 'Wissenschaft und Technik',
            'Law & Justice': 'Recht und Gerechtigkeit',
            'Abstract Concepts': 'Abstrakte Begriffe',

            // B2-Beruf
            '1 Modul': 'B2 - Beruf Modul 1'
        };

        const systemBlocks: WordBlock[] = allVocabularyCategories.map(category => ({
            id: `vocab-${category.id}`,
            name: `${levelEmojis[category.level] || '⚪'} ${category.level} - ${categoryTranslations[category.name] || category.name}`,
            words: [], // populated dynamically
            isVocabularyCategory: true,
            vocabularyCategory: category
        }));

        // 2. Load and filter custom blocks from storage
        const saved = localStorage.getItem(STORAGE_KEY);
        let customBlocks: WordBlock[] = [];

        if (saved) {
            try {
                const loadedBlocks = JSON.parse(saved) as WordBlock[];
                // Keep only blocks that are NOT system categories
                customBlocks = loadedBlocks.filter(b => !b.isVocabularyCategory);
            } catch (e) {
                console.error('Failed to load word blocks:', e);
            }
        }

        // 3. Merge: System blocks first, then custom blocks
        const mergedBlocks = [...systemBlocks, ...customBlocks];
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setBlocks(mergedBlocks);

        // 4. Set initial selection if needed
        if (mergedBlocks.length > 0 && !currentBlockId) {
            setCurrentBlockId(mergedBlocks[0].id);
        }
    }, []);

    // Save blocks to localStorage whenever they change
    useEffect(() => {
        if (blocks.length > 0) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(blocks));
        }
    }, [blocks]);

    const getCurrentBlock = () => blocks.find(b => b.id === currentBlockId);

    const createNewBlock = () => {
        if (newBlockName.trim()) {
            const newBlock: WordBlock = {
                id: Date.now().toString(),
                name: newBlockName.trim(),
                words: []
            };
            setBlocks([...blocks, newBlock]);
            setCurrentBlockId(newBlock.id);
            setNewBlockName('');
            setShowNewBlockInput(false);
        }
    };

    const deleteBlock = (blockId: string) => {
        const block = blocks.find(b => b.id === blockId);
        if (block?.isVocabularyCategory) {
            alert('❌ Системные блоки с vocabulary нельзя удалить');
            return;
        }

        if (confirm('Удалить этот блок и все его слова?')) {
            const updatedBlocks = blocks.filter(b => b.id !== blockId);
            setBlocks(updatedBlocks);
            if (currentBlockId === blockId && updatedBlocks.length > 0) {
                setCurrentBlockId(updatedBlocks[0].id);
            } else if (updatedBlocks.length === 0) {
                setCurrentBlockId(null);
            }
        }
    };

    const addWordToCurrentBlock = () => {
        if (!currentBlockId || !newGerman.trim() || !newRussian.trim()) return;

        const updatedBlocks = blocks.map(block => {
            if (block.id === currentBlockId) {
                return {
                    ...block,
                    words: [...block.words, { german: newGerman.trim(), russian: newRussian.trim() }]
                };
            }
            return block;
        });

        setBlocks(updatedBlocks);
        setNewGerman('');
        setNewRussian('');
    };

    const removeWordFromBlock = (blockId: string, wordIndex: number) => {
        const updatedBlocks = blocks.map(block => {
            if (block.id === blockId) {
                return {
                    ...block,
                    words: block.words.filter((_, i) => i !== wordIndex)
                };
            }
            return block;
        });
        setBlocks(updatedBlocks);
    };

    const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !currentBlockId) return;

        setImportError(null);

        try {
            const text = await file.text();
            const extension = file.name.split('.').pop()?.toLowerCase();
            let importedWords: CustomWord[] = [];

            if (extension === 'json') {
                const parsed = JSON.parse(text);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                importedWords = parsed.map((item: any) => ({
                    german: item.german || item.de || '',
                    russian: item.russian || item.ru || ''
                })).filter((w: CustomWord) => w.german && w.russian);
            } else if (extension === 'csv') {
                const lines = text.split('\n').filter(line => line.trim());
                importedWords = lines.map(line => {
                    const [german, russian] = line.split(',').map(s => s.trim());
                    return { german, russian };
                }).filter(w => w.german && w.russian);
            } else if (extension === 'txt') {
                const lines = text.split('\n').filter(line => line.trim());
                importedWords = lines.map(line => {
                    let german = '', russian = '';
                    if (line.includes(' - ')) {
                        [german, russian] = line.split(' - ').map(s => s.trim());
                    } else if (line.includes(':')) {
                        [german, russian] = line.split(':').map(s => s.trim());
                    } else if (line.includes('\t')) {
                        [german, russian] = line.split('\t').map(s => s.trim());
                    } else if (line.includes(',')) {
                        [german, russian] = line.split(',').map(s => s.trim());
                    }
                    return { german, russian };
                }).filter(w => w.german && w.russian);
            } else {
                setImportError(`Неподдерживаемый формат. Используйте .txt, .csv или .json`);
                return;
            }

            if (importedWords.length === 0) {
                setImportError('Не удалось найти валидные пары слов');
                return;
            }

            // Add to current block
            const currentBlock = getCurrentBlock();
            if (!currentBlock) return;

            const updatedBlocks = blocks.map(block => {
                if (block.id === currentBlockId) {
                    const existingWords = block.words;
                    const newWords: CustomWord[] = [];

                    importedWords.forEach(newWord => {
                        const isDuplicate = existingWords.some(
                            w => w.german.toLowerCase() === newWord.german.toLowerCase()
                        );
                        if (!isDuplicate) {
                            newWords.push(newWord);
                        }
                    });

                    return { ...block, words: [...existingWords, ...newWords] };
                }
                return block;
            });

            setBlocks(updatedBlocks);
            alert(`✓ Импортировано ${importedWords.length} слов в блок "${currentBlock.name}"!`);
        } catch (error) {
            console.error('Import error:', error);
            setImportError('Ошибка при чтении файла');
        }

        event.target.value = '';
    };

    const exportBlock = (blockId: string) => {
        const block = blocks.find(b => b.id === blockId);
        if (!block) return;

        const dataStr = JSON.stringify(block.words, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${block.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const startGame = (blockId: string | null, useSample: boolean = false) => {
        if (blockId) {
            const block = blocks.find(b => b.id === blockId);

            // Check if it's a vocabulary category block
            if (block?.isVocabularyCategory && block.vocabularyCategory) {
                const vocabularyWords = block.vocabularyCategory.words;
                if (vocabularyWords.length >= 6) {
                    const shuffled = [...vocabularyWords]
                        .sort(() => Math.random() - 0.5)
                        .slice(0, 6)
                        .map(w => ({ de: w.german, ru: w.russian }));
                    setPairs(shuffled);
                    setGameStarted(true);
                    return;
                }
            }

            // Custom block logic
            if (block && block.words.length >= 6) {
                const shuffled = [...block.words].sort(() => Math.random() - 0.5).slice(0, 6);
                setPairs(shuffled.map(w => ({ de: w.german, ru: w.russian })));
                setGameStarted(true);
                return;
            }
        }

        if (useSample) {
            const shuffled = [...sampleVocabulary].sort(() => Math.random() - 0.5).slice(0, 6);
            setPairs(shuffled.map(w => ({ de: w.german, ru: w.russian })));
            setGameStarted(true);
        }
    };

    const handleComplete = async (stats: { matches: number; mistakes: number; timeSeconds: number }) => {
        const baseXP = 30;
        const timeBonusXP = Math.max(0, 20 - stats.timeSeconds / 10);
        const mistakePenalty = stats.mistakes * 2;
        const totalXP = Math.max(10, Math.floor(baseXP + timeBonusXP - mistakePenalty));

        if (!completionSoundPlayed.current) {
            playLevelUp();
            completionSoundPlayed.current = true;
        }

        if (addXP) {
            await addXP(totalXP);
        }

        // Game completion UI is handled by MatchGame component
    };

    const resetGame = () => {
        completionSoundPlayed.current = false;
        setGameStarted(false);
        setPairs([]);
    };

    if (!gameStarted) {
        const currentBlock = getCurrentBlock();

        return (
            <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-purple-50 to-pink-50">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center">
                            <Button onClick={() => navigate('/')} variant="secondary">
                                <ArrowLeft className="w-5 h-5 mr-2" />
                                Назад
                            </Button>
                            <h1 className="text-3xl font-bold text-gray-800 ml-4">
                                🧩 Найди пары
                            </h1>
                        </div>
                    </div>

                    {/* Instructions */}
                    <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                        <p className="text-gray-700">
                            <strong>Создайте блоки слов</strong> по темам (A1, Работа, Путешествия и т.д.) и учите каждый блок отдельно!
                        </p>
                    </div>

                    {/* Blocks Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        {blocks.map(block => (
                            <GlassCard
                                key={block.id}
                                className={`p-4 cursor-pointer transition-all ${currentBlockId === block.id
                                    ? 'bg-purple-100 border-purple-400 border-2'
                                    : 'hover:bg-white/80'
                                    }`}
                                onClick={() => setCurrentBlockId(block.id)}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-gray-800">{block.name}</h3>
                                    <div className="flex gap-1">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                exportBlock(block.id);
                                            }}
                                            className="text-gray-500 hover:text-blue-600"
                                            title="Экспорт"
                                        >
                                            <Download className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteBlock(block.id);
                                            }}
                                            className="text-gray-500 hover:text-red-600"
                                            title="Удалить"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600">
                                    {block.isVocabularyCategory && block.vocabularyCategory
                                        ? `${block.vocabularyCategory.wordCount} слов`
                                        : `${block.words.length} слов`
                                    }
                                </p>
                                {/* Always show play button for vocabulary blocks, or for custom blocks with enough words */}
                                {(block.isVocabularyCategory || block.words.length >= 6) && (
                                    <Button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            startGame(block.id);
                                        }}
                                        variant="success"
                                        className="w-full mt-3 !py-2 text-sm"
                                    >
                                        🎮 Играть
                                    </Button>
                                )}
                            </GlassCard>
                        ))}

                        {/* New Block Card */}
                        <GlassCard className="p-4 flex items-center justify-center border-2 border-dashed border-gray-300">
                            {!showNewBlockInput ? (
                                <button
                                    onClick={() => setShowNewBlockInput(true)}
                                    className="text-gray-500 hover:text-purple-600 flex flex-col items-center gap-2"
                                >
                                    <FolderPlus className="w-8 h-8" />
                                    <span className="text-sm font-medium">Новый блок</span>
                                </button>
                            ) : (
                                <div className="w-full">
                                    <input
                                        type="text"
                                        value={newBlockName}
                                        onChange={(e) => setNewBlockName(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') createNewBlock();
                                            if (e.key === 'Escape') {
                                                setShowNewBlockInput(false);
                                                setNewBlockName('');
                                            }
                                        }}
                                        placeholder="Название блока"
                                        className="w-full px-3 py-2 rounded-lg border border-gray-300 mb-2"
                                        autoFocus
                                    />
                                    <div className="flex gap-2">
                                        <Button onClick={createNewBlock} variant="primary" className="flex-1 !py-1 text-sm">
                                            Создать
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                setShowNewBlockInput(false);
                                                setNewBlockName('');
                                            }}
                                            variant="secondary"
                                            className="flex-1 !py-1 text-sm"
                                        >
                                            Отмена
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </GlassCard>
                    </div>

                    {/* Current Block Editor - Only for custom blocks */}
                    {currentBlock && !currentBlock.isVocabularyCategory && (
                        <GlassCard className="p-6 mb-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">
                                📝 {currentBlock.name}
                            </h2>

                            {/* Word Input */}
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Немецкое слово 🇩🇪
                                    </label>
                                    <input
                                        type="text"
                                        value={newGerman}
                                        onChange={(e) => setNewGerman(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                addWordToCurrentBlock();
                                            }
                                        }}
                                        placeholder="z.B. der Baum"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Перевод 🇷🇺
                                    </label>
                                    <input
                                        type="text"
                                        value={newRussian}
                                        onChange={(e) => setNewRussian(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                addWordToCurrentBlock();
                                            }
                                        }}
                                        placeholder="например, дерево"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-2 mb-4">
                                <Button onClick={addWordToCurrentBlock} variant="secondary" className="flex-1 !py-2">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Добавить пару
                                </Button>
                                <label className="flex-1">
                                    <input
                                        type="file"
                                        accept=".txt,.csv,.json"
                                        onChange={handleFileImport}
                                        className="hidden"
                                    />
                                    <div className="w-full px-6 py-2 rounded-xl font-semibold backdrop-blur-sm border border-white/30 shadow-lg transition-all duration-200 bg-gray-500/80 hover:bg-gray-600/80 text-white text-center cursor-pointer">
                                        📂 Импорт
                                    </div>
                                </label>
                            </div>

                            {importError && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                                    ❌ {importError}
                                </div>
                            )}

                            {/* Words List */}
                            {currentBlock.words.length > 0 && (
                                <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
                                    {currentBlock.words.map((word, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                                            <div className="flex gap-4">
                                                <span className="font-medium text-gray-800">🇩🇪 {word.german}</span>
                                                <span className="text-gray-500">→</span>
                                                <span className="font-medium text-gray-800">🇷🇺 {word.russian}</span>
                                            </div>
                                            <button
                                                onClick={() => removeWordFromBlock(currentBlock.id, index)}
                                                className="text-red-500 hover:text-red-700"
                                                title="Удалить"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Play Button */}
                            {currentBlock.words.length >= 6 ? (
                                <Button
                                    onClick={() => startGame(currentBlock.id)}
                                    variant="success"
                                    className="w-full !py-4 text-lg"
                                >
                                    🎮 Начать игру с блоком "{currentBlock.name}" ({currentBlock.words.length} слов)
                                </Button>
                            ) : (
                                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                                    <p className="text-yellow-800 font-medium">
                                        Добавьте еще {6 - currentBlock.words.length} {6 - currentBlock.words.length === 1 ? 'слово' : 'слова'} для начала игры
                                    </p>
                                    <p className="text-sm text-yellow-600 mt-1">
                                        Минимум 6 пар для игры
                                    </p>
                                </div>
                            )}
                        </GlassCard>
                    )}

                    {/* Info card for vocabulary blocks */}
                    {currentBlock && currentBlock.isVocabularyCategory && (
                        <GlassCard className="p-6 mb-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">
                                {currentBlock.vocabularyCategory?.icon} {currentBlock.name}
                            </h2>
                            <div className="space-y-3">
                                <p className="text-gray-700">
                                    <strong>Слов в категории:</strong> {currentBlock.vocabularyCategory?.wordCount}
                                </p>
                                <p className="text-gray-600 text-sm">
                                    ℹ️ Это системный блок из базы vocabulary. Каждая игра будет использовать случайные 6 слов из этой категории.
                                </p>
                                <Button
                                    onClick={() => startGame(currentBlock.id)}
                                    variant="success"
                                    className="w-full !py-4 text-lg"
                                >
                                    🎮 Начать игру с блоком "{currentBlock.vocabularyCategory?.nameRu}"
                                </Button>
                            </div>
                        </GlassCard>
                    )}

                    {/* Sample Game Button */}
                    <Button onClick={() => startGame(null, true)} variant="secondary" className="w-full !py-3">
                        🎲 Попробовать с готовыми словами
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-purple-50 to-pink-50">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center">
                        <Button onClick={resetGame} variant="secondary">
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Назад
                        </Button>
                        <h1 className="text-3xl font-bold text-gray-800 ml-4">
                            🧩 Найди пары
                        </h1>
                    </div>
                </div>

                {pairs.length > 0 && (
                    <MatchGame
                        pairs={pairs}
                        onComplete={handleComplete}
                        onExit={resetGame}
                        onCorrect={playCorrect}
                        onIncorrect={playIncorrect}
                    />
                )}
            </div>
        </div>
    );
};

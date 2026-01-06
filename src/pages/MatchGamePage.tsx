import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MatchGame } from '../components/features/MatchGame/MatchGame';
import { Button } from '../components/Button';
import { ArrowLeft } from 'lucide-react';
import { useProgress } from '../hooks/useProgress';
import { useAudio } from '../contexts/AudioContext';
import useSound from 'use-sound';
import { allVocabularyCategories } from '../data/vocabulary';

import { BlockSelector } from '../components/features/MatchGame/BlockSelector';
import type { WordBlock } from '../components/features/MatchGame/BlockSelector';
import { BlockEditor } from '../components/features/MatchGame/BlockEditor';

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

    // Track which level sections are expanded
    const [expandedLevels, setExpandedLevels] = useState<Record<string, boolean>>({
        'A1': false,
        'A2': false,
        'B1': false,
        'B2': false,
        'custom': false
    });

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
            '1 Modul': 'Beruf Modul 1',
            '2 Modul': 'Beruf Modul 2'
        };

        const systemBlocks: WordBlock[] = allVocabularyCategories.map(category => ({
            id: `vocab-${category.id}`,
            name: `${levelEmojis[category.level] || '⚪'} ${category.level} - ${categoryTranslations[category.name] || category.name}`,
            words: category.words.map(w => ({ german: w.german, russian: w.russian })),
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
        setBlocks(mergedBlocks);

        // 4. Set initial selection if needed
        if (mergedBlocks.length > 0 && !currentBlockId) {
            setCurrentBlockId(mergedBlocks[0].id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Save blocks to localStorage whenever they change
    useEffect(() => {
        if (blocks.length > 0) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(blocks));
        }
    }, [blocks]);

    const getCurrentBlock = () => blocks.find(b => b.id === currentBlockId);

    const toggleLevel = (level: string) => {
        setExpandedLevels(prev => ({
            ...prev,
            [level]: !prev[level]
        }));
    };

    const getBlocksByLevel = (level: string) => {
        if (level === 'custom') {
            return blocks.filter(b => !b.isVocabularyCategory);
        }
        return blocks.filter(b => b.isVocabularyCategory && b.vocabularyCategory?.level === level);
    };



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
            setCurrentBlockId(blockId);
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
            setCurrentBlockId(null);
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

    const handleRestartWithNewWords = () => {
        if (!currentBlockId) return;

        const block = blocks.find(b => b.id === currentBlockId);
        if (!block) return;

        completionSoundPlayed.current = false;

        // Check if it's a vocabulary category block
        if (block.isVocabularyCategory && block.vocabularyCategory) {
            const vocabularyWords = block.vocabularyCategory.words;
            if (vocabularyWords.length >= 6) {
                const shuffled = [...vocabularyWords]
                    .sort(() => Math.random() - 0.5)
                    .slice(0, 6)
                    .map(w => ({ de: w.german, ru: w.russian }));
                setPairs(shuffled);
                return;
            }
        }

        // Custom block logic
        if (block.words.length >= 6) {
            const shuffled = [...block.words]
                .sort(() => Math.random() - 0.5)
                .slice(0, 6);
            setPairs(shuffled.map(w => ({ de: w.german, ru: w.russian })));
        }
    };

    if (!gameStarted) {
        return (
            <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-purple-50 to-pink-50">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center">
                            <Button onClick={() => navigate('/')} variant="secondary" className="!p-3">
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                            <h1 className="text-3xl font-bold text-gray-800 ml-4">
                                🧩 Найди пары
                            </h1>
                        </div>
                    </div>

                    {/* Instructions */}
                    <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                        <p className="text-gray-700">
                            <strong>Выберите уровень</strong> и тему для игры. Нажмите на заголовок уровня чтобы развернуть или свернуть категории.
                        </p>
                    </div>

                    {/* Main Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Left Column: Block Selection */}
                        <div className="lg:col-span-12 xl:col-span-7">
                            {/* Level Sections */}
                            <BlockSelector
                                blocks={blocks}
                                currentBlockId={currentBlockId}
                                expandedLevels={expandedLevels}
                                onToggleLevel={toggleLevel}
                                onSelectBlock={setCurrentBlockId}
                                onDeleteBlock={deleteBlock}
                                onStartGame={(id) => startGame(id)}
                                getBlocksByLevel={getBlocksByLevel}
                            />
                        </div>

                        {/* Right Column: Editor */}
                        <div className="lg:col-span-12 xl:col-span-5">
                            <BlockEditor
                                currentBlock={getCurrentBlock()}
                                showNewBlockInput={showNewBlockInput}
                                newBlockName={newBlockName}
                                newGerman={newGerman}
                                newRussian={newRussian}
                                importError={importError}
                                onNewBlockNameChange={setNewBlockName}
                                onNewGermanChange={setNewGerman}
                                onNewRussianChange={setNewRussian}
                                onCreateBlock={createNewBlock}
                                onCancelNewBlock={() => {
                                    setShowNewBlockInput(false);
                                    setNewBlockName('');
                                }}
                                onShowNewBlockInput={() => setShowNewBlockInput(true)}
                                onAddWord={addWordToCurrentBlock}
                                onRemoveWord={removeWordFromBlock}
                                onFileImport={handleFileImport}
                                onExportBlock={exportBlock}
                            />

                            {/* Sample Game Button */}
                            <Button onClick={() => startGame(null, true)} variant="secondary" className="w-full mt-6 py-4">
                                🎲 Попробовать с готовыми словами
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-purple-50 to-pink-50">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center">
                        <Button onClick={resetGame} variant="secondary" className="!p-3">
                            <ArrowLeft className="w-5 h-5" />
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
                        onRestartWithNewWords={handleRestartWithNewWords}
                    />
                )}
            </div>
        </div>
    );
};

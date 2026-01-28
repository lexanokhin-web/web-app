import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Lock, CheckCircle, Star, Grid, Play } from 'lucide-react';
import { Button } from '../components/Button';
import { WordPuzzle } from '../components/features/WordPuzzle';
import { useProgress } from '../hooks/useProgress';
import { useAudio } from '../contexts/AudioContext';
import useSound from 'use-sound';

interface PuzzleLevel {
    id: number;
    solutionWord: string;
    clues: {
        hint: string;
        answer: string;
        letterPositions: number[];
    }[];
    solutionMapping: number[];
}

interface PuzzleFile {
    level: string;
    puzzles: PuzzleLevel[];
}

const STORAGE_KEY = 'word_puzzle_progress';

export const WordPuzzlePage: React.FC = () => {
    const navigate = useNavigate();
    const { addXP } = useProgress();
    const { isMuted, volume } = useAudio();

    const [playLevelUp] = useSound('/sounds/levelup.mp3', { volume: isMuted ? 0 : volume });

    const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
    const [currentPuzzle, setCurrentPuzzle] = useState<PuzzleLevel | null>(null);
    const [allPuzzles, setAllPuzzles] = useState<PuzzleLevel[]>([]);
    const [completedLevels, setCompletedLevels] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);

    // Load all puzzles on mount
    useEffect(() => {
        const loadPuzzles = async () => {
            try {
                const [res1, res2] = await Promise.all([
                    fetch('/data/puzzles/a1_puzzles.json'),
                    fetch('/data/puzzles/a1_puzzles_2.json')
                ]);

                const data1: PuzzleFile = await res1.json();

                let combinedPuzzles = [...data1.puzzles];

                // Try to load second file, but don't fail if it's missing (for now) or if one fails
                if (res2.ok) {
                    const data2: PuzzleFile = await res2.json();
                    combinedPuzzles = [...combinedPuzzles, ...data2.puzzles];
                }

                setAllPuzzles(combinedPuzzles);
            } catch (error) {
                console.error('Error loading puzzles:', error);
            } finally {
                setLoading(false);
            }
        };
        loadPuzzles();
    }, []);

    // Load progress from localStorage
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const progress = JSON.parse(saved);
                setCompletedLevels(progress.completedLevels || []);
            } catch (e) {
                console.error('Failed to load puzzle progress:', e);
            }
        }
    }, []);

    // Save progress to localStorage
    const saveProgress = (levels: number[]) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ completedLevels: levels }));
    };

    const startLevel = useCallback((levelId: number) => {
        const puzzle = allPuzzles.find(p => p.id === levelId);
        if (puzzle) {
            setCurrentPuzzle(puzzle);
            setSelectedLevel(levelId);
        }
    }, [allPuzzles]);

    const handleNextLevel = () => {
        if (selectedLevel !== null) {
            const nextLevelId = selectedLevel + 1;
            if (nextLevelId <= allPuzzles.length) {
                startLevel(nextLevelId);
            } else {
                // All levels completed
                handleExit();
            }
        }
    };

    // Auto-start is REMOVED to show Menu Page first

    // Derived state for next playable level
    const nextLevelId = React.useMemo(() => {
        const firstIncomplete = allPuzzles.find(p => !completedLevels.includes(p.id));
        return firstIncomplete ? firstIncomplete.id : (allPuzzles.length > 0 ? allPuzzles[0].id : 1);
    }, [allPuzzles, completedLevels]);

    const handleExit = () => {
        setSelectedLevel(null);
        setCurrentPuzzle(null);
    };

    const handleComplete = async (stats: { correctAnswers: number; wrongAttempts: number; timeSeconds: number }) => {
        if (selectedLevel !== null) {
            // Mark level as completed
            const newCompleted = [...completedLevels];
            if (!newCompleted.includes(selectedLevel)) {
                newCompleted.push(selectedLevel);
                setCompletedLevels(newCompleted);
                saveProgress(newCompleted);
            }

            // Calculate XP
            const baseXP = 50;
            const timeBonusXP = Math.max(0, 30 - stats.timeSeconds / 10);
            const mistakePenalty = stats.wrongAttempts * 3;
            const totalXP = Math.max(20, Math.floor(baseXP + timeBonusXP - mistakePenalty));

            playLevelUp();

            if (addXP) {
                await addXP(totalXP);
            }
        }
    };

    const isLevelUnlocked = (levelNumber: number) => {
        if (levelNumber === 1) return true;
        return completedLevels.includes(levelNumber - 1);
    };

    if (currentPuzzle && selectedLevel !== null) {
        return (
            <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-indigo-50 to-purple-50">
                <div className="max-w-2xl mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                            <Button onClick={handleExit} variant="secondary" className="!p-3">
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                            <h1 className="text-2xl font-bold text-gray-800 ml-4">
                                Level {selectedLevel}
                            </h1>
                        </div>
                        <div className="flex items-center gap-1 bg-yellow-100 px-3 py-1.5 rounded-full text-yellow-700 font-bold">
                            <Star className="w-4 h-4 fill-current" />
                            <span>{completedLevels.length}/{allPuzzles.length}</span>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentPuzzle.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <WordPuzzle
                                puzzle={currentPuzzle}
                                onComplete={handleComplete}
                                onExit={handleExit}
                                onNext={handleNextLevel}
                                isLastLevel={selectedLevel === allPuzzles.length}
                            />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-indigo-50 to-purple-50">
            <div className="max-w-3xl mx-auto">
                {/* Main Menu Header */}
                <div className="flex items-center justify-between mb-8">
                    <Button onClick={() => navigate('/')} variant="ghost" className="!p-2">
                        <ArrowLeft className="w-6 h-6 text-gray-600" />
                    </Button>
                    <h1 className="text-3xl font-bold text-gray-800">
                        Wörterrätsel
                    </h1>
                    <div className="flex items-center gap-2 text-gray-600">
                        <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-full shadow-sm">
                            <Star className="w-5 h-5 text-yellow-500 fill-current" />
                            <span className="font-bold">{completedLevels.length}/{allPuzzles.length}</span>
                        </div>
                    </div>
                </div>

                {/* Hero / Continue Section */}
                <div className="bg-white rounded-2xl p-8 shadow-xl mb-8 text-center border-b-4 border-indigo-100 transform transition-all hover:scale-[1.01]">
                    <div className="mb-4 inline-flex items-center justify-center w-20 h-20 bg-indigo-100 rounded-full text-indigo-600 mb-4">
                        <Grid className="w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        Bereit weiterzumachen?
                    </h2>
                    <p className="text-gray-500 mb-6">
                        Du bist bei Level {nextLevelId}. Mach weiter so!
                    </p>
                    <button
                        onClick={() => startLevel(nextLevelId)}
                        className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xl font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center mx-auto gap-3"
                    >
                        <Play className="w-6 h-6 fill-current" />
                        Level {nextLevelId} spielen
                    </button>
                </div>

                {/* Level Grid */}
                <div className="bg-white/50 backdrop-blur rounded-2xl p-6 border border-white/50">
                    <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
                        <Grid className="w-5 h-5" />
                        Alle Level
                    </h3>
                    <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-2">
                        {allPuzzles.map((puzzle) => {
                            const levelNumber = puzzle.id;
                            const isCompleted = completedLevels.includes(levelNumber);
                            const isUnlocked = isLevelUnlocked(levelNumber);

                            return (
                                <motion.button
                                    key={levelNumber}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => isUnlocked && startLevel(levelNumber)}
                                    disabled={!isUnlocked}
                                    className={`
                                        relative aspect-square flex items-center justify-center rounded-lg font-bold text-lg
                                        transition-all duration-200 shadow-sm border
                                        ${isCompleted
                                            ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                                            : isUnlocked
                                                ? 'bg-white text-indigo-600 border-indigo-100 hover:border-indigo-300 hover:shadow-md'
                                                : 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed'
                                        }
                                    `}
                                >
                                    {isCompleted ? (
                                        <CheckCircle className="w-5 h-5" />
                                    ) : !isUnlocked ? (
                                        <Lock className="w-4 h-4 opacity-50" />
                                    ) : (
                                        <span>{levelNumber}</span>
                                    )}
                                </motion.button>
                            );
                        })}
                    </div>
                </div>

                {/* Loading Indicator */}
                {loading && (
                    <div className="fixed inset-0 bg-white/80 z-50 flex items-center justify-center">
                        <div className="animate-spin w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full" />
                    </div>
                )}
            </div>
        </div>
    );
};


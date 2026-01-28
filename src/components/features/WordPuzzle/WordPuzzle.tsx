import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, ArrowRight, Trophy, Check, HelpCircle, Lightbulb, X } from 'lucide-react';

interface Clue {
    hint: string;
    answer: string;
    letterPositions: number[];
}

interface PuzzleLevel {
    id: number;
    solutionWord: string;
    clues: Clue[];
    solutionMapping: number[];
}

interface WordPuzzleProps {
    puzzle: PuzzleLevel;
    onComplete: (stats: { correctAnswers: number; wrongAttempts: number; timeSeconds: number }) => void;
    onExit: () => void;
    onNext?: () => void;
    isLastLevel?: boolean;
}

export const WordPuzzle: React.FC<WordPuzzleProps> = ({ puzzle, onComplete, onExit, onNext, isLastLevel }) => {
    // Each clue has an array of letters (one per box)
    const [clueInputs, setClueInputs] = useState<string[][]>(
        puzzle.clues.map(clue => clue.answer.split('').map(() => ''))
    );
    const [revealed, setRevealed] = useState<boolean[]>(puzzle.clues.map(() => false));
    const [wrongAttempts, setWrongAttempts] = useState(0);
    const [startTime] = useState(() => Date.now());
    const [finalTime, setFinalTime] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [shakeClue, setShakeClue] = useState<number | null>(null);
    const [wrongClue, setWrongClue] = useState<number | null>(null);

    // Refs for input focus management
    const inputRefs = useRef<(HTMLInputElement | null)[][]>(
        puzzle.clues.map(clue => clue.answer.split('').map(() => null))
    );

    // Build letter-to-number mapping from revealed answers
    const letterMap = React.useMemo(() => {
        const newMap = new Map<number, string>();
        puzzle.clues.forEach((clue, clueIndex) => {
            if (revealed[clueIndex]) {
                clue.answer.split('').forEach((letter, letterIndex) => {
                    const position = clue.letterPositions[letterIndex];
                    if (position) {
                        newMap.set(position, letter);
                    }
                });
            }
        });
        return newMap;
    }, [puzzle.clues, revealed]);



    // Check if a clue is fully filled and correct
    const checkClue = (clueIndex: number) => {
        const clue = puzzle.clues[clueIndex];
        const userAnswer = clueInputs[clueIndex].join('').toUpperCase();
        const correctAnswer = clue.answer.toUpperCase();

        if (userAnswer.length === correctAnswer.length) {
            if (userAnswer === correctAnswer) {
                const newRevealed = [...revealed];
                newRevealed[clueIndex] = true;
                setRevealed(newRevealed);
                setWrongClue(null);

                // Check completion
                if (newRevealed.every(r => r)) {
                    setIsComplete(true);
                    const timeSeconds = Math.floor((Date.now() - startTime) / 1000); // eslint-disable-line react-hooks/purity
                    setFinalTime(timeSeconds);
                    onComplete({
                        correctAnswers: puzzle.clues.length,
                        wrongAttempts,
                        timeSeconds
                    });
                }
            } else {
                setWrongAttempts(prev => prev + 1);
                setShakeClue(clueIndex);
                setWrongClue(clueIndex);
                setTimeout(() => {
                    setShakeClue(null);
                    setWrongClue(null);

                    // Clear inputs for this clue
                    setClueInputs(prev => {
                        const newInputs = [...prev];
                        newInputs[clueIndex] = newInputs[clueIndex].map(() => '');
                        return newInputs;
                    });

                    // Focus back on the first input
                    if (inputRefs.current[clueIndex][0]) {
                        inputRefs.current[clueIndex][0]?.focus();
                    }
                }, 500);
            }
        }
    };

    const revealClue = (clueIndex: number) => {
        if (revealed[clueIndex]) return;

        const clue = puzzle.clues[clueIndex];
        const answerLetters = clue.answer.split('');

        // Update inputs with correct answer
        setClueInputs(prev => {
            const newInputs = [...prev];
            newInputs[clueIndex] = answerLetters;
            return newInputs;
        });

        // Mark as revealed
        const newRevealed = [...revealed];
        newRevealed[clueIndex] = true;
        setRevealed(newRevealed);
        setWrongClue(null);

        // Check completion
        if (newRevealed.every(r => r)) {
            setIsComplete(true);
            const timeSeconds = Math.floor((Date.now() - startTime) / 1000); // eslint-disable-line react-hooks/purity
            setFinalTime(timeSeconds);
            onComplete({
                correctAnswers: puzzle.clues.length,
                wrongAttempts,
                timeSeconds
            });
        }
    };

    const handleLetterChange = (clueIndex: number, letterIndex: number, value: string) => {
        if (revealed[clueIndex]) return;

        // Clear error state when user starts typing
        if (wrongClue === clueIndex) {
            setWrongClue(null);
        }

        const letter = value.toUpperCase().slice(-1); // Take only last character
        const newInputs = [...clueInputs];
        newInputs[clueIndex] = [...newInputs[clueIndex]];
        newInputs[clueIndex][letterIndex] = letter;
        setClueInputs(newInputs);

        // Auto-advance to next empty box
        if (letter && letterIndex < puzzle.clues[clueIndex].answer.length - 1) {
            const nextInput = inputRefs.current[clueIndex][letterIndex + 1];
            if (nextInput) {
                nextInput.focus();
            }
        }

        // Check if clue is complete after a short delay
        setTimeout(() => {
            const allFilled = newInputs[clueIndex].every(l => l !== '');
            if (allFilled) {
                checkClue(clueIndex);
            }
        }, 100);
    };

    const handleKeyDown = (e: React.KeyboardEvent, clueIndex: number, letterIndex: number) => {
        if (e.key === 'Enter') {
            // Check answer on Enter
            checkClue(clueIndex);
        } else if (e.key === 'Backspace' && !clueInputs[clueIndex][letterIndex] && letterIndex > 0) {
            // Move to previous box on backspace if current is empty
            const prevInput = inputRefs.current[clueIndex][letterIndex - 1];
            if (prevInput) {
                prevInput.focus();
            }
        } else if (e.key === 'ArrowLeft' && letterIndex > 0) {
            const prevInput = inputRefs.current[clueIndex][letterIndex - 1];
            if (prevInput) prevInput.focus();
        } else if (e.key === 'ArrowRight' && letterIndex < puzzle.clues[clueIndex].answer.length - 1) {
            const nextInput = inputRefs.current[clueIndex][letterIndex + 1];
            if (nextInput) nextInput.focus();
        }
    };

    const getSolutionDisplay = () => {
        return puzzle.solutionWord.split('').map((letter, index) => {
            const position = puzzle.solutionMapping[index];
            const revealedLetter = letterMap.get(position);
            return {
                letter,
                position,
                revealed: !!revealedLetter,
                displayLetter: revealedLetter || '?'
            };
        });
    };

    if (isComplete) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center p-8 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl shadow-xl"
            >
                <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-green-800 mb-2">Gelöst!</h2>
                <p className="text-2xl font-bold text-emerald-600 mb-4">{puzzle.solutionWord}</p>
                <p className="text-gray-600 mb-6">
                    Fehler: {wrongAttempts} | Zeit: {finalTime}s
                </p>
                <div className="flex gap-4 justify-center">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onExit}
                        className="px-6 py-3 bg-white text-gray-700 rounded-xl font-bold shadow-md hover:bg-gray-50 border border-gray-200"
                    >
                        <Menu className="w-5 h-5 inline mr-2" />
                        Menü
                    </motion.button>

                    {!isLastLevel && onNext && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onNext}
                            className="px-6 py-3 bg-emerald-500 text-white rounded-xl font-bold shadow-md hover:bg-emerald-600"
                        >
                            <ArrowRight className="w-5 h-5 inline mr-2" />
                            Weiter
                        </motion.button>
                    )}
                </div>
            </motion.div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Solution Word Display */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 shadow-xl">
                <div className="flex flex-wrap justify-center gap-2">
                    {getSolutionDisplay().map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className={`w-12 h-14 flex flex-col items-center justify-center rounded-lg font-bold text-2xl ${item.revealed
                                ? 'bg-white text-indigo-600'
                                : 'bg-white/20 text-white/60'
                                }`}
                        >
                            <span>{item.revealed ? item.displayLetter : '?'}</span>
                            <span className="text-xs opacity-60">{item.position}</span>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Clues List */}
            <div className="space-y-4">
                <AnimatePresence>
                    {puzzle.clues.map((clue, clueIndex) => (
                        <motion.div
                            key={clueIndex}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                x: shakeClue === clueIndex ? [0, -10, 10, -10, 10, 0] : 0
                            }}
                            transition={{
                                delay: clueIndex * 0.1,
                                x: { duration: 0.5 }
                            }}
                            className={`p-4 rounded-xl shadow-md ${revealed[clueIndex]
                                ? 'bg-green-50 border-2 border-green-200'
                                : 'bg-white border border-gray-200'
                                }`}
                        >
                            <div className="flex items-start gap-4">
                                {/* Status Icon */}
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${revealed[clueIndex] ? 'bg-green-500' : 'bg-gray-200'
                                    }`}>
                                    {revealed[clueIndex] ? (
                                        <Check className="w-5 h-5 text-white" />
                                    ) : (
                                        <HelpCircle className="w-5 h-5 text-gray-500" />
                                    )}
                                </div>

                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-3">
                                        <p className="text-gray-700 font-medium">{clue.hint}</p>
                                        {!revealed[clueIndex] && (
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => revealClue(clueIndex)}
                                                className="p-1.5 text-yellow-500 hover:bg-yellow-50 rounded-full transition-colors"
                                                title="Lösung anzeigen"
                                            >
                                                <Lightbulb className="w-5 h-5" />
                                            </motion.button>
                                        )}
                                    </div>

                                    {/* Letter Input Boxes */}
                                    <div className="flex flex-wrap gap-1">
                                        {clue.answer.split('').map((letter, letterIndex) => (
                                            <div
                                                key={letterIndex}
                                                className="relative"
                                            >
                                                {revealed[clueIndex] ? (
                                                    <div className="w-10 h-12 flex flex-col items-center justify-center rounded-lg font-bold bg-green-100 text-green-700 border-2 border-green-300">
                                                        <span className="text-lg">{letter}</span>
                                                        <span className="text-xs text-green-500">
                                                            {clue.letterPositions[letterIndex]}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <div className="relative">
                                                        <input
                                                            ref={el => {
                                                                if (!inputRefs.current[clueIndex]) {
                                                                    inputRefs.current[clueIndex] = [];
                                                                }
                                                                inputRefs.current[clueIndex][letterIndex] = el;
                                                            }}
                                                            type="text"
                                                            value={clueInputs[clueIndex][letterIndex]}
                                                            onChange={(e) => handleLetterChange(clueIndex, letterIndex, e.target.value)}
                                                            onKeyDown={(e) => handleKeyDown(e, clueIndex, letterIndex)}
                                                            maxLength={1}
                                                            className={`w-10 h-12 text-center text-lg font-bold uppercase rounded-lg border-2 outline-none bg-white ${wrongClue === clueIndex
                                                                ? 'border-red-500 bg-red-50 text-red-600'
                                                                : 'border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
                                                                }`}
                                                        />
                                                        <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 text-xs text-gray-400">
                                                            {clue.letterPositions[letterIndex]}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Wrong Attempts Counter */}
            {wrongAttempts > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-red-500 font-medium"
                >
                    <X className="w-5 h-5 inline mr-1" />
                    Fehler: {wrongAttempts}
                </motion.div>
            )}
        </div>
    );
};

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../components/GlassCard';
import { BookOpen, FileText, Users, ArrowLeftRight, Plus, FileCheck, Clock, Palette, Link, GitMerge, Puzzle, Hammer, LogIn, User, Trophy, ChevronDown, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from '../components/AuthModal';
import { Button } from '../components/Button';
import { UserLevelBadge } from '../components/UserLevelBadge';
import { AudioToggle } from '../components/AudioToggle';

const exerciseBlocks = [
    {
        blockName: '🎮 Spiele',
        blockId: 'games',
        exercises: [
            {
                id: 'match-game',
                name: 'Finde Paare',
                icon: Puzzle,
                color: 'from-green-400 to-emerald-600',
                path: '/match-game'
            },
            {
                id: 'sentence-builder',
                name: 'Sätze bilden',
                icon: Hammer,
                color: 'from-orange-400 to-red-600',
                path: '/sentence-builder'
            },
            {
                id: 'quiz',
                name: 'Quiz',
                icon: FileCheck,
                color: 'from-emerald-400 to-cyan-600',
                path: '/quiz'
            },
        ]
    },
    {
        blockName: '📚 Wortschatz',
        blockId: 'vocabulary',
        exercises: [
            {
                id: 'flashcards',
                name: 'FlashCards',
                icon: BookOpen,
                color: 'from-violet-400 to-fuchsia-600',
                path: '/flashcards'
            },
            {
                id: 'antonyms',
                name: 'Antonyme',
                icon: ArrowLeftRight,
                color: 'from-purple-400 to-purple-600',
                path: '/antonyms'
            },
            {
                id: 'synonyms',
                name: 'Synonyme',
                icon: Plus,
                color: 'from-pink-400 to-pink-600',
                path: '/synonyms'
            },
        ]
    },
    {
        blockName: '✍️ Grammatik',
        blockId: 'grammar',
        exercises: [
            {
                id: 'verbs',
                name: 'Verben',
                icon: BookOpen,
                color: 'from-blue-400 to-blue-600',
                path: '/verbs'
            },
            {
                id: 'articles',
                name: 'Artikel',
                icon: FileText,
                color: 'from-orange-400 to-orange-600',
                path: '/articles'
            },
            {
                id: 'pronouns',
                name: 'Pronomen',
                icon: Users,
                color: 'from-green-400 to-green-600',
                path: '/pronouns'
            },
            {
                id: 'praeteritum',
                name: 'Präteritum',
                icon: Clock,
                color: 'from-amber-400 to-amber-600',
                path: '/exercise/praeteritum'
            },
            {
                id: 'adjektive',
                name: 'Adjektivdeklination',
                icon: Palette,
                color: 'from-cyan-400 to-cyan-600',
                path: '/adjektivdeklination'
            },
            {
                id: 'relativsaetze',
                name: 'Relativsätze',
                icon: Link,
                color: 'from-lime-400 to-lime-600',
                path: '/exercise/relativsaetze'
            },
            {
                id: 'verbindungen',
                name: 'Verbindungen',
                icon: GitMerge,
                color: 'from-rose-400 to-rose-600',
                path: '/exercise/verbindungen'
            },
        ]
    }
];

export const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [showAuthModal, setShowAuthModal] = useState(false);
    // First category open by default
    const [openCategories, setOpenCategories] = useState<string[]>(['games']);

    const toggleCategory = (blockId: string) => {
        setOpenCategories(prev =>
            prev.includes(blockId)
                ? prev.filter(id => id !== blockId)
                : [...prev, blockId]
        );
    };

    return (
        <div className="min-h-screen py-6 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Compact Header */}
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    {/* Top Row: User Actions */}
                    <div className="flex justify-between items-center mb-4">
                        <div
                            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => navigate('/')}
                        >
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center shadow-lg">
                                <BookOpen className="w-5 h-5 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-800">
                                Deutsch
                            </h1>
                        </div>

                        {user ? (
                            <div className="flex items-center gap-2">
                                <AudioToggle />
                                <UserLevelBadge />
                                <Button
                                    onClick={() => navigate('/leaderboard')}
                                    variant="secondary"
                                    className="!p-2"
                                >
                                    <Trophy className="w-4 h-4 text-yellow-500" />
                                </Button>
                                <div
                                    onClick={() => navigate('/profile')}
                                    className="p-2 bg-white/30 backdrop-blur-md rounded-full cursor-pointer hover:bg-white/50"
                                >
                                    <User className="w-4 h-4 text-gray-700" />
                                </div>
                            </div>
                        ) : (
                            <Button onClick={() => setShowAuthModal(true)} variant="primary" className="text-sm">
                                <LogIn className="w-4 h-4 mr-1" />
                                Войти
                            </Button>
                        )}
                    </div>
                </motion.div>

                {/* Accordion Categories */}
                <div className="space-y-3">
                    {exerciseBlocks.map((block, blockIndex) => {
                        const isOpen = openCategories.includes(block.blockId);

                        return (
                            <motion.div
                                key={block.blockId}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: blockIndex * 0.05 }}
                            >
                                {/* Category Header - Clickable */}
                                <button
                                    onClick={() => toggleCategory(block.blockId)}
                                    className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${isOpen
                                        ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-md'
                                        : 'bg-white/40 backdrop-blur-md hover:bg-white/60'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">{block.blockName.split(' ')[0]}</span>
                                        <span className="text-lg font-bold text-gray-800">
                                            {block.blockName.split(' ').slice(1).join(' ')}
                                        </span>
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 text-gray-600">
                                            {block.exercises.length}
                                        </span>
                                    </div>
                                    {isOpen ? (
                                        <ChevronDown className="w-5 h-5 text-gray-600" />
                                    ) : (
                                        <ChevronRight className="w-5 h-5 text-gray-600" />
                                    )}
                                </button>

                                {/* Exercises Grid - Collapsible */}
                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="grid grid-cols-3 sm:grid-cols-3 gap-2 sm:gap-4 pt-3 pb-2">
                                                {block.exercises.map((exercise) => {
                                                    const Icon = exercise.icon;
                                                    return (
                                                        <GlassCard
                                                            key={exercise.id}
                                                            onClick={() => navigate(exercise.path)}
                                                            className="p-2 sm:p-4 min-h-[90px] sm:min-h-[140px] flex flex-col items-center justify-center text-center"
                                                        >
                                                            <div className={`w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${exercise.color} flex items-center justify-center shadow-md mb-1.5 sm:mb-2 mx-auto`}>
                                                                <Icon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                                                            </div>
                                                            <h3 className="text-[10px] sm:text-sm font-bold text-gray-800 leading-tight">
                                                                {exercise.name}
                                                            </h3>
                                                        </GlassCard>
                                                    );
                                                })}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Auth Modal */}
                <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
            </div>
        </div>
    );
};

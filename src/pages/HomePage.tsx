import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../components/GlassCard';
import { BookOpen, FileText, Users, ArrowLeftRight, Plus, FileCheck, FileCheck2, Clock, Palette, Link, GitMerge, Puzzle, Hammer, LogIn, User, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from '../components/AuthModal';
import { Button } from '../components/Button';
import { UserLevelBadge } from '../components/UserLevelBadge';

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
        blockName: '📚 Wortschatz & Vokabeln',
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
        blockName: '✍️ Grammatikübungen',
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
                path: '/exercise/adjektive'
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
    },
    {
        blockName: '🎯 Tests & Szenarien',
        blockId: 'tests',
        exercises: [
            {
                id: 'test1',
                name: 'Testszenario',
                icon: FileCheck,
                color: 'from-teal-400 to-teal-600',
                path: '/test-scenario-1'
            },
            {
                id: 'test2',
                name: 'Testszenario 2',
                icon: FileCheck2,
                color: 'from-indigo-400 to-indigo-600',
                path: '/test-scenario-2'
            },
        ]
    },
];

export const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [showAuthModal, setShowAuthModal] = useState(false);

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Auth & Level Button */}
                    <div className="flex justify-end mb-6">
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <UserLevelBadge />

                                <Button
                                    onClick={() => navigate('/leaderboard')}
                                    variant="secondary"
                                    className="!p-2"
                                    title="Таблица лидеров"
                                >
                                    <Trophy className="w-5 h-5 text-yellow-500" />
                                </Button>

                                <div
                                    onClick={() => navigate('/profile')}
                                    className="flex items-center space-x-2 px-4 py-2 bg-white/30 backdrop-blur-md rounded-full cursor-pointer hover:bg-white/50 transition-colors"
                                >
                                    <User className="w-5 h-5 text-gray-700" />
                                    <span className="text-gray-700 font-medium">
                                        {user.user_metadata?.username || user.email?.split('@')[0]}
                                    </span>
                                </div>

                            </div>
                        ) : (
                            <Button onClick={() => setShowAuthModal(true)} variant="primary">
                                <LogIn className="w-5 h-5 inline mr-2" />
                                Войти
                            </Button>
                        )}
                    </div>

                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center shadow-2xl">
                            <BookOpen className="w-10 h-10 text-white" />
                        </div>
                    </div>

                    <h1 className="text-5xl font-bold text-gray-800 mb-4">
                        Deutsch lernen
                    </h1>

                    <GlassCard className="inline-block px-8 py-4" animate={false}>
                        <p className="text-xl text-gray-700 font-medium">
                            Wähle ein Thema zum Lernen
                        </p>
                    </GlassCard>
                </motion.div>

                {/* Exercise Blocks */}
                <div className="space-y-12">
                    {exerciseBlocks.map((block, blockIndex) => (
                        <motion.div
                            key={block.blockId}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: blockIndex * 0.2 }}
                        >
                            {/* Block Header */}
                            <div className="mb-6">
                                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                                    {block.blockName}
                                </h2>
                                <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                            </div>

                            {/* Exercises Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {block.exercises.map((exercise, exerciseIndex) => {
                                    const Icon = exercise.icon;
                                    return (
                                        <motion.div
                                            key={exercise.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.4, delay: exerciseIndex * 0.1 }}
                                        >
                                            <GlassCard
                                                onClick={() => navigate(exercise.path)}
                                                className="p-6 h-full"
                                            >
                                                <div className="flex flex-col items-center text-center space-y-4">
                                                    {/* Icon with gradient background */}
                                                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${exercise.color} flex items-center justify-center shadow-lg`}>
                                                        <Icon className="w-8 h-8 text-white" />
                                                    </div>

                                                    {/* Exercise name */}
                                                    <h3 className="text-xl font-bold text-gray-800">
                                                        {exercise.name}
                                                    </h3>
                                                </div>
                                            </GlassCard>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Auth Modal */}
                <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
            </div>
        </div>
    );
};

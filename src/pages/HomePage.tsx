import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../components/GlassCard';
import { BookOpen, FileText, Users, ArrowLeftRight, Plus, FileCheck, FileCheck2, Clock, Palette, Link, GitMerge } from 'lucide-react';
import { motion } from 'framer-motion';

const categories = [
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
];

export const HomePage: React.FC = () => {
    const navigate = useNavigate();

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

                {/* Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category, index) => {
                        const Icon = category.icon;
                        return (
                            <motion.div
                                key={category.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                            >
                                <GlassCard
                                    onClick={() => navigate(category.path)}
                                    className="p-6 h-full"
                                >
                                    <div className="flex flex-col items-center text-center space-y-4">
                                        {/* Icon with gradient background */}
                                        <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg`}>
                                            <Icon className="w-8 h-8 text-white" />
                                        </div>

                                        {/* Category name */}
                                        <h3 className="text-xl font-bold text-gray-800">
                                            {category.name}
                                        </h3>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

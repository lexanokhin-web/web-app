import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../../GlassCard';
import { QUIZ_CONFIG, type QuizLevel, type QuizTopic } from '../../../data/quizzes/quiz-config';
import { BookOpen, Star, Trophy, GraduationCap, ChevronRight } from 'lucide-react';

interface QuizSelectionProps {
    onSelectTopic: (level: QuizLevel, topic: QuizTopic) => void;
}

export const QuizSelection: React.FC<QuizSelectionProps> = ({ onSelectTopic }) => {
    const [selectedLevelId, setSelectedLevelId] = useState<QuizLevel>('A1');

    const selectedLevelConfig = QUIZ_CONFIG.find(c => c.id === selectedLevelId);

    const getLevelIcon = (level: QuizLevel) => {
        switch (level) {
            case 'A1': return <BookOpen className="w-5 h-5" />;
            case 'A2': return <Star className="w-5 h-5" />;
            case 'B1': return <Trophy className="w-5 h-5" />;
            case 'B2': return <GraduationCap className="w-5 h-5" />;
        }
    };

    const levelIcon = getLevelIcon(selectedLevelId);

    const getLevelColor = (level: QuizLevel) => {
        switch (level) {
            case 'A1': return 'bg-green-100 text-green-700 hover:bg-green-200';
            case 'A2': return 'bg-blue-100 text-blue-700 hover:bg-blue-200';
            case 'B1': return 'bg-purple-100 text-purple-700 hover:bg-purple-200';
            case 'B2': return 'bg-orange-100 text-orange-700 hover:bg-orange-200';
        }
    };

    return (
        <div className="space-y-8">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Wähle dein Level</h1>
                <p className="text-gray-600">Finde Übungen, die zu deinem Sprachniveau passen</p>
            </div>

            {/* Level Tabs */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
                {QUIZ_CONFIG.map((level) => (
                    <button
                        key={level.id}
                        onClick={() => setSelectedLevelId(level.id)}
                        className={`
                            px-6 py-3 rounded-xl flex items-center space-x-2 transition-all duration-300 transform hover:scale-105
                            ${selectedLevelId === level.id
                                ? 'bg-indigo-600 text-white shadow-lg'
                                : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm'
                            }
                        `}
                    >
                        {getLevelIcon(level.id)}
                        <span className="font-black">{level.id}</span>
                        <span className="hidden sm:inline text-sm opacity-90">- {level.title.split('-')[1].trim()}</span>
                    </button>
                ))}
            </div>

            {/* Topics Grid */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={selectedLevelId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="grid grid-cols-3 lg:grid-cols-3 gap-2 sm:gap-6">
                        {selectedLevelConfig?.topics.map((topic) => (
                            <GlassCard
                                key={topic.id}
                                className="p-2 sm:p-6 cursor-pointer group hover:border-indigo-300 transition-all duration-300 hover:shadow-md h-full flex flex-col items-center justify-center sm:justify-start text-center"
                                onClick={() => onSelectTopic(selectedLevelId, topic)}
                            >
                                <div className="hidden sm:flex justify-between items-start mb-2 sm:mb-4 w-full">
                                    <div className={`p-1.5 sm:p-3 rounded-lg ${getLevelColor(selectedLevelId)}`}>
                                        {levelIcon}
                                    </div>
                                    <div className="hidden sm:block text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-1 rounded">
                                        Grammatik
                                    </div>
                                </div>

                                <h3 className="text-[10px] sm:text-lg font-black text-gray-800 sm:mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2 min-h-[1.5rem] sm:min-h-0 uppercase tracking-tight">
                                    {topic.title}
                                </h3>

                                <p className="hidden sm:block text-sm text-gray-600 mb-4 line-clamp-2">
                                    {topic.description}
                                </p>

                                <div className="mt-auto hidden sm:flex items-center text-indigo-600 text-[8px] sm:text-sm font-bold group-hover:translate-x-1 transition-transform">
                                    <span className="hidden sm:inline">Starten</span>
                                </div>
                            </GlassCard>
                        ))}
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

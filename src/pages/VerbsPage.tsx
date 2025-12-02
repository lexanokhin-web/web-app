import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../components/GlassCard';
import { Button } from '../components/Button';
import { availableBlocks } from '../lib/dataProvider';
import type { BlockInfo } from '../types';
import { ArrowLeft, Play, FileCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export const VerbsPage: React.FC = () => {
    const navigate = useNavigate();
    const [blocks] = useState<BlockInfo[]>(availableBlocks);

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <Button
                        onClick={() => navigate('/')}
                        variant="secondary"
                        className="mb-6"
                    >
                        <ArrowLeft className="w-5 h-5 inline mr-2" />
                        Назад
                    </Button>

                    <h1 className="text-4xl font-bold text-gray-800 mb-4">
                        Verb (Глаголы)
                    </h1>

                    <GlassCard className="px-6 py-4" animate={false}>
                        <p className="text-lg text-gray-700">
                            Выберите диапазон глаголов для изучения
                        </p>
                    </GlassCard>
                </motion.div>

                {/* Blocks List */}
                <div className="space-y-4">
                    {blocks.map((block, index) => (
                        <motion.div
                            key={block.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                            <GlassCard className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                                            <span className="text-white font-bold text-xl">V</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-800">
                                            {block.displayName}
                                        </h3>
                                    </div>

                                    <div className="flex space-x-3">
                                        <Button
                                            onClick={() => navigate(`/exercise/${block.id}`)}
                                            variant="primary"
                                        >
                                            <Play className="w-5 h-5 inline mr-2" />
                                            Упражнение
                                        </Button>

                                        <Button
                                            onClick={() => navigate(`/test/${block.id}`)}
                                            variant="success"
                                        >
                                            <FileCheck className="w-5 h-5 inline mr-2" />
                                            Тест
                                        </Button>
                                    </div>
                                </div>
                            </GlassCard>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

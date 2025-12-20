import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../components/GlassCard';
import { Button } from '../components/Button';
import { availableBlocks } from '../lib/blocks';
import type { BlockInfo } from '../types';
import { ArrowLeft, Play } from 'lucide-react';
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
                        className="mb-6 !p-3"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>

                    <h1 className="text-4xl font-black text-gray-800 mb-4">
                        Verben
                    </h1>

                    <GlassCard className="px-6 py-4" animate={false}>
                        <p className="text-lg font-medium text-gray-700">
                            Wähle einen Verben-Bereich zum Lernen
                        </p>
                    </GlassCard>
                </motion.div>

                {/* Blocks Grid */}
                <div className="grid grid-cols-2 md:grid-cols-2 gap-3 sm:gap-6">
                    {blocks.map((block, index) => (
                        <motion.div
                            key={block.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                            <GlassCard className="p-3 sm:p-6 h-full flex flex-col">
                                <div className="flex flex-col items-center text-center mb-4">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mb-2 shadow-md">
                                        <span className="text-white font-black text-lg sm:text-xl">V</span>
                                    </div>
                                    <h3 className="text-sm sm:text-xl font-black text-gray-800 leading-tight">
                                        {block.displayName}
                                    </h3>
                                </div>

                                <div className="mt-auto">
                                    <Button
                                        onClick={() => navigate(`/exercise/${block.id}`)}
                                        variant="primary"
                                        className="w-full justify-center !p-2 sm:!p-3 text-xs sm:text-base font-black"
                                    >
                                        <Play className="w-3 h-3 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
                                        Übung
                                    </Button>
                                </div>
                            </GlassCard>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useBookIndex } from '../../hooks/useBookData';
import { Book, ChevronRight, GraduationCap, ArrowLeft } from 'lucide-react';
import { GlassCard } from '../../components/GlassCard';

export const BookSelectionPage: React.FC = () => {
    const { data: chapters, isLoading } = useBookIndex();
    const navigate = useNavigate();

    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-12">

                {/* Header */}
                <div className="text-center space-y-4 relative">
                    <button
                        onClick={() => navigate('/')}
                        className="absolute left-0 top-0 flex items-center text-gray-600 hover:text-indigo-600 transition-colors p-2 rounded-lg hover:bg-white/50"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        <span className="hidden sm:inline">Zurück</span>
                    </button>

                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center space-x-2 bg-white px-6 py-2 rounded-full shadow-sm text-indigo-600 font-semibold mb-4"
                    >
                        <Book className="w-5 h-5" />
                        <span>B1 Intensiv-Trainer</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 pb-2"
                    >
                        Dein Weg zu B1
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-gray-600 max-w-2xl mx-auto"
                    >
                        Meistere die deutsche Grammatik Schritt für Schritt mit unserem interaktiven Buch.
                    </motion.p>
                </div>

                {/* Chapters Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {chapters?.map((chapter, index) => (
                        <motion.div
                            key={chapter.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index }}
                        >
                            <GlassCard
                                className="h-full p-6 cursor-pointer group hover:border-indigo-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                                onClick={() => navigate(`/b1-book/${chapter.file}`)}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="bg-indigo-100 p-3 rounded-lg text-indigo-700 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                                        <GraduationCap className="w-6 h-6" />
                                    </div>
                                    <span className="text-xs font-bold bg-gray-100 text-gray-500 px-2 py-1 rounded-md">
                                        Kapitel {index + 1}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-indigo-600 transition-colors">
                                    {chapter.title}
                                </h3>

                                <p className="text-gray-600 text-sm mb-6 line-clamp-2">
                                    {chapter.description}
                                </p>

                                <div className="flex items-center text-indigo-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                                    <span>Lernen starten</span>
                                    <ChevronRight className="w-4 h-4 ml-1" />
                                </div>
                            </GlassCard>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

import React from 'react';
import { motion } from 'framer-motion';
import { Book, ChevronRight, GraduationCap, ArrowLeft, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useA2BookData } from '../../hooks/useA2BookData';

const A2BookSelectionPage: React.FC = () => {
    const navigate = useNavigate();
    const { chapters, isLoading } = useA2BookData();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin text-blue-600">
                    <Book className="w-8 h-8" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/')}
                        className="p-2 hover:bg-white rounded-xl transition-colors text-slate-500 hover:text-slate-800"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                            <Book className="w-8 h-8 text-blue-600" />
                            Grammatik A2
                        </h1>
                        <p className="text-slate-500 text-lg mt-1">Intensiv-Trainer für Fortgeschrittene</p>
                    </div>
                </div>

                {/* Chapter Grid */}
                <div className="grid gap-4 md:grid-cols-2">
                    {chapters?.map((chapter, index) => (
                        <motion.div
                            key={chapter.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Link
                                to={`/a2-book/${chapter.file}`}
                                className="group bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-start gap-4 h-full relative overflow-hidden"
                            >
                                <div className="absolute right-0 top-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 opacity-50 group-hover:scale-110 transition-transform" />

                                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    {index + 1}
                                </div>

                                <div className="flex-1 z-10">
                                    <h3 className="font-semibold text-lg text-slate-800 group-hover:text-blue-600 transition-colors">
                                        {chapter.title}
                                    </h3>
                                    <p className="text-slate-500 text-sm mt-1 leading-relaxed">
                                        {chapter.description}
                                    </p>
                                </div>

                                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all self-center" />
                            </Link>
                        </motion.div>
                    ))}

                    {/* Final Quiz Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: (chapters?.length || 0) * 0.05 }}
                    >
                        <Link
                            to="/a2-book/quiz"
                            className="group bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-start gap-4 h-full relative overflow-hidden"
                        >
                            {/* Decorative background circles */}
                            <div className="absolute right-0 top-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-8 -mt-8" />
                            <div className="absolute left-0 bottom-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-8 -mb-8" />

                            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0 backdrop-blur-sm group-hover:scale-110 transition-transform shadow-inner border border-white/10">
                                <GraduationCap className="w-7 h-7" />
                            </div>

                            <div className="flex-1 z-10">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-bold text-xl text-white">
                                        Abschlusstest
                                    </h3>
                                    <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-200 text-xs font-bold border border-amber-400/30">
                                        PRÜFUNG
                                    </span>
                                </div>
                                <p className="text-indigo-100 text-sm leading-relaxed">
                                    Testen Sie Ihr Wissen aus allen 8 Lektionen. 10 zufällige Fragen.
                                </p>
                            </div>

                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center self-center group-hover:bg-white group-hover:text-indigo-600 text-white transition-all backdrop-blur-sm">
                                <Star className="w-5 h-5 fill-current" />
                            </div>
                        </Link>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default A2BookSelectionPage;

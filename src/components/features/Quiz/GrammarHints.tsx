import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../../GlassCard';

export const GrammarHints: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'prepositions' | 'declination' | null>(null);

    const toggleTab = (tab: 'prepositions' | 'declination') => {
        setActiveTab(activeTab === tab ? null : tab);
    };

    return (
        <div className="mb-8 w-full">
            {/* Buttons Grid */}
            <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4">
                <button
                    onClick={() => toggleTab('prepositions')}
                    className={`
                        py-2 text-[10px] sm:text-xs font-black rounded-xl
                        shadow-md transition-all transform active:scale-95
                        uppercase tracking-tighter border-none text-white
                        ${activeTab === 'prepositions'
                            ? 'bg-gradient-to-r from-indigo-700 to-purple-700 ring-2 ring-indigo-300 ring-offset-2 scale-[1.02]'
                            : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
                        }
                    `}
                >
                    Präpositionen
                </button>
                <button
                    onClick={() => toggleTab('declination')}
                    className={`
                        py-2 text-[10px] sm:text-xs font-black rounded-xl
                        shadow-md transition-all transform active:scale-95
                        uppercase tracking-tighter border-none text-white
                        ${activeTab === 'declination'
                            ? 'bg-gradient-to-r from-purple-700 to-indigo-700 ring-2 ring-purple-300 ring-offset-2 scale-[1.02]'
                            : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
                        }
                    `}
                >
                    Deklination
                </button>
            </div>

            {/* Expanded Content (Full Width) */}
            <AnimatePresence mode="wait">
                {activeTab === 'prepositions' && (
                    <motion.div
                        key="prepositions"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <GlassCard className="p-4 sm:p-6 border-indigo-100/50 bg-white/40 mb-4 shadow-xl">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Akkusativ */}
                                <div className="space-y-3">
                                    <div className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-bold w-fit tracking-wider uppercase">
                                        Akkusativ
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {['durch', 'für', 'gegen', 'ohne', 'um', 'bis', 'entlang'].map(p => (
                                            <span key={p} className="px-2 py-1 bg-white/60 border border-purple-100 rounded-md text-sm font-medium text-purple-900">
                                                {p}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Dativ */}
                                <div className="space-y-3">
                                    <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold w-fit tracking-wider uppercase">
                                        Dativ
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {['ab', 'aus', 'außer', 'bei', 'mit', 'nach', 'seit', 'von', 'zu', 'entgegen', 'gegenüber'].map(p => (
                                            <span key={p} className="px-2 py-1 bg-white/60 border border-blue-100 rounded-md text-sm font-medium text-blue-900">
                                                {p}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Genetiv */}
                                <div className="space-y-3">
                                    <div className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-bold w-fit tracking-wider uppercase">
                                        Genetiv
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {['wegen', 'während', 'trotz', 'statt', 'außerhalb', 'innerhalb'].map(p => (
                                            <span key={p} className="px-2 py-1 bg-white/60 border border-amber-100 rounded-md text-sm font-medium text-amber-900">
                                                {p}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </GlassCard>
                    </motion.div>
                )}

                {activeTab === 'declination' && (
                    <motion.div
                        key="declination"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <GlassCard className="p-4 border-purple-100/50 bg-white/40 overflow-x-auto mb-4 shadow-xl">
                            <table className="w-full text-sm border-collapse min-w-[300px]">
                                <thead>
                                    <tr className="border-b border-purple-100/50">
                                        <th className="p-2 text-left text-xs font-bold text-indigo-700 uppercase">Kasus</th>
                                        <th className="p-2 text-center text-xs font-bold text-indigo-700 uppercase">Masc.</th>
                                        <th className="p-2 text-center text-xs font-bold text-indigo-700 uppercase">Fem.</th>
                                        <th className="p-2 text-center text-xs font-bold text-indigo-700 uppercase">Neut.</th>
                                        <th className="p-2 text-center text-xs font-bold text-indigo-700 uppercase">Plur.</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-purple-50/30">
                                        <td className="p-2 font-bold text-indigo-900">Nom.</td>
                                        <td className="p-2 text-center text-indigo-800 font-medium">der</td>
                                        <td className="p-2 text-center text-indigo-800 font-medium">die</td>
                                        <td className="p-2 text-center text-indigo-800 font-medium">das</td>
                                        <td className="p-2 text-center text-indigo-800 font-medium">die</td>
                                    </tr>
                                    <tr className="border-b border-purple-50/30">
                                        <td className="p-2 font-bold text-indigo-900">Akk.</td>
                                        <td className="p-2 text-center text-purple-700 font-black">den</td>
                                        <td className="p-2 text-center text-indigo-800 font-medium">die</td>
                                        <td className="p-2 text-center text-indigo-800 font-medium">das</td>
                                        <td className="p-2 text-center text-indigo-800 font-medium">die</td>
                                    </tr>
                                    <tr className="border-b border-purple-50/30">
                                        <td className="p-2 font-bold text-indigo-900">Dat.</td>
                                        <td className="p-2 text-center text-blue-700 font-black">dem</td>
                                        <td className="p-2 text-center text-blue-700 font-black">der</td>
                                        <td className="p-2 text-center text-blue-700 font-black">dem</td>
                                        <td className="p-2 text-center text-blue-700 font-black">den (+n)</td>
                                    </tr>
                                    <tr>
                                        <td className="p-2 font-bold text-indigo-900">Gen.</td>
                                        <td className="p-2 text-center text-amber-700 font-black">des (+s)</td>
                                        <td className="p-2 text-center text-amber-700 font-black">der</td>
                                        <td className="p-2 text-center text-amber-700 font-black">des (+s)</td>
                                        <td className="p-2 text-center text-amber-700 font-black">der</td>
                                    </tr>
                                </tbody>
                            </table>
                        </GlassCard>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

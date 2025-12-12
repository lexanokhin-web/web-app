import React, { useState } from 'react';
import { Button } from '../../Button';
import { GlassCard } from '../../GlassCard';
import { BookOpen, Lightbulb, ChevronUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Case preposition reference for hints
const casePrepositions = {
    Dativ: ['ab', 'aus', 'bei', 'mit', 'nach', 'seit', 'von', 'zu', 'außer', 'entgegen', 'gegenüber'],
    Akkusativ: ['durch', 'für', 'gegen', 'ohne', 'um', 'bis', 'entlang'],
    Genitiv: ['während', 'wegen', 'trotz', 'statt', 'aufgrund', 'innerhalb', 'außerhalb', 'anstatt'],
    'Wechselpräpositionen (Wo?→Dat / Wohin?→Akk)': ['in', 'an', 'auf', 'unter', 'über', 'vor', 'hinter', 'neben', 'zwischen']
};

// Adjective ending tables - German
const table1Strong = {
    header: 'Tabelle 1 – Starke Endungen (ohne Artikel / Artikel ohne Endung)',
    endings: [
        ['', 'Mask.', 'Fem.', 'Neut.', 'Plural'],
        ['Nom.', '-er', '-e', '-es', '-e'],
        ['Akk.', '-en', '-e', '-es', '-e'],
        ['Dat.', '-em', '-er', '-em', '-en'],
        ['Gen.', '-en*', '-er', '-en*', '-er']
    ],
    note: '* Im Genitiv Mask./Neut. ohne Artikel: Adjektive bekommen -en (Ausnahme)'
};

const table2Weak = {
    header: 'Tabelle 2 – Schwache Endungen (Artikel mit Endung)',
    endings: [
        ['', 'Mask.', 'Fem.', 'Neut.', 'Plural'],
        ['Nom.', '-e', '-e', '-e', '-en'],
        ['Akk.', '-en', '-e', '-e', '-en'],
        ['Dat.', '-en', '-en', '-en', '-en'],
        ['Gen.', '-en', '-en', '-en', '-en']
    ],
    note: 'Wenn der Artikel den Kasus/Genus schon zeigt'
};

const getCaseColor = (c: string) => {
    switch (c) {
        case 'Nom': return 'bg-blue-100 text-blue-700';
        case 'Akk': return 'bg-purple-100 text-purple-700';
        case 'Dat': return 'bg-orange-100 text-orange-700';
        case 'Gen': return 'bg-pink-100 text-pink-700';
        default: return 'bg-gray-100 text-gray-700';
    }
};

export const GrammarReference: React.FC = () => {
    const [showTables, setShowTables] = useState(false);
    const [showPrepositions, setShowPrepositions] = useState(false);

    return (
        <div className="mb-6">
            {/* Grammar Reference Toggles */}
            <div className="flex gap-2 mb-6">
                <Button
                    onClick={() => setShowTables(!showTables)}
                    variant="secondary"
                    className="flex-1 justify-center"
                >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Endungstabellen
                    {showTables ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
                </Button>
                <Button
                    onClick={() => setShowPrepositions(!showPrepositions)}
                    variant="secondary"
                    className="flex-1 justify-center"
                >
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Präpositionen
                    {showPrepositions ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
                </Button>
            </div>

            {/* Grammar Tables */}
            <AnimatePresence>
                {showTables && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-6 overflow-hidden"
                    >
                        <GlassCard className="p-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                {/* Table 1 */}
                                <div>
                                    <h4 className="font-bold text-sm mb-2 text-orange-700">{table1Strong.header}</h4>
                                    <table className="w-full text-xs">
                                        <tbody>
                                            {table1Strong.endings.map((row, i) => (
                                                <tr key={i} className={i === 0 ? 'font-bold bg-orange-100' : ''}>
                                                    {row.map((cell, j) => (
                                                        <td key={j} className={`px-2 py-1 border ${j === 0 ? 'font-semibold bg-orange-50' : ''}`}>
                                                            {cell}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <p className="text-xs text-gray-500 mt-1">{table1Strong.note}</p>
                                </div>
                                {/* Table 2 */}
                                <div>
                                    <h4 className="font-bold text-sm mb-2 text-blue-700">{table2Weak.header}</h4>
                                    <table className="w-full text-xs">
                                        <tbody>
                                            {table2Weak.endings.map((row, i) => (
                                                <tr key={i} className={i === 0 ? 'font-bold bg-blue-100' : ''}>
                                                    {row.map((cell, j) => (
                                                        <td key={j} className={`px-2 py-1 border ${j === 0 ? 'font-semibold bg-blue-50' : ''}`}>
                                                            {cell}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <p className="text-xs text-gray-500 mt-1">{table2Weak.note}</p>
                                </div>
                            </div>
                        </GlassCard>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Preposition Reference */}
            <AnimatePresence>
                {showPrepositions && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-6 overflow-hidden"
                    >
                        <GlassCard className="p-4">
                            <h4 className="font-bold text-sm mb-3">Kasus-Bestimmung durch Präpositionen</h4>
                            <div className="space-y-2 text-sm">
                                {Object.entries(casePrepositions).map(([caseName, preps]) => (
                                    <div key={caseName} className="flex flex-wrap items-center gap-2">
                                        <span className={`px-2 py-1 rounded font-semibold ${getCaseColor(caseName.slice(0, 3))}`}>
                                            {caseName}:
                                        </span>
                                        <span className="text-gray-600">{preps.join(', ')}</span>
                                    </div>
                                ))}
                            </div>
                        </GlassCard>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

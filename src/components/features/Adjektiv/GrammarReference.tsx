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
    const [showSpecial, setShowSpecial] = useState(false);

    return (
        <div className="mb-4">
            {/* Grammar Reference Toggles */}
            <div className="flex gap-1.5 mb-3">
                <Button
                    onClick={() => setShowTables(!showTables)}
                    variant="secondary"
                    className="flex-1 justify-center py-0.5 px-1.5 text-[10px] font-medium h-auto min-h-0 rounded-md tracking-tight leading-4 shadow-sm"
                >
                    <BookOpen className="w-3 h-3 mr-1" />
                    Endungstabellen
                    {showTables ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />}
                </Button>
                <Button
                    onClick={() => setShowPrepositions(!showPrepositions)}
                    variant="secondary"
                    className="flex-1 justify-center py-0.5 px-1.5 text-[10px] font-medium h-auto min-h-0 rounded-md tracking-tight leading-4 shadow-sm"
                >
                    <Lightbulb className="w-3 h-3 mr-1" />
                    Präpositionen
                    {showPrepositions ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />}
                </Button>
            </div>

            {/* Grammar Tables */}
            <AnimatePresence>
                {showTables && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-3 overflow-hidden"
                    >
                        <GlassCard className="p-2">
                            <div className="grid md:grid-cols-2 gap-2">
                                {/* Table 1 */}
                                <div>
                                    <h4 className="font-bold text-[10px] mb-0.5 text-orange-700">{table1Strong.header}</h4>
                                    <table className="w-full text-[10px]">
                                        <tbody>
                                            {table1Strong.endings.map((row, i) => (
                                                <tr key={i} className={i === 0 ? 'font-bold bg-orange-100' : ''}>
                                                    {row.map((cell, j) => (
                                                        <td key={j} className={`px-1 py-0 border ${j === 0 ? 'font-semibold bg-orange-50' : ''}`}>
                                                            {cell}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <p className="text-[9px] text-gray-500 mt-0.5 leading-tight">{table1Strong.note}</p>
                                </div>
                                {/* Table 2 */}
                                <div>
                                    <h4 className="font-bold text-[10px] mb-0.5 text-blue-700">{table2Weak.header}</h4>
                                    <table className="w-full text-[10px]">
                                        <tbody>
                                            {table2Weak.endings.map((row, i) => (
                                                <tr key={i} className={i === 0 ? 'font-bold bg-blue-100' : ''}>
                                                    {row.map((cell, j) => (
                                                        <td key={j} className={`px-1 py-0 border ${j === 0 ? 'font-semibold bg-blue-50' : ''}`}>
                                                            {cell}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <p className="text-[9px] text-gray-500 mt-0.5 leading-tight">{table2Weak.note}</p>
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
                        className="mb-3 overflow-hidden"
                    >
                        <GlassCard className="p-2">
                            <h4 className="font-bold text-[10px] mb-1">Kasus-Bestimmung durch Präpositionen</h4>
                            <div className="space-y-1 text-[10px]">
                                {Object.entries(casePrepositions).map(([caseName, preps]) => (
                                    <div key={caseName} className="flex flex-wrap items-center gap-1">
                                        <span className={`px-1 py-0 rounded font-semibold ${getCaseColor(caseName.slice(0, 3))}`}>
                                            {caseName}:
                                        </span>
                                        <span className="text-gray-600 leading-tight">{preps.join(', ')}</span>
                                    </div>
                                ))}
                            </div>
                        </GlassCard>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Special Rules */}
            <div className="mb-2">
                <Button
                    onClick={() => setShowSpecial(!showSpecial)}
                    variant="secondary"
                    className="w-full justify-center py-0.5 px-1.5 text-[10px] font-medium h-auto min-h-0 rounded-md tracking-tight leading-4 shadow-sm"
                >
                    <Lightbulb className="w-3 h-3 mr-1" />
                    Besonderheiten (Mehrere / Mengewörter)
                    {showSpecial ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />}
                </Button>
            </div>
            <AnimatePresence>
                {showSpecial && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <GlassCard className="p-3 mt-1">
                            <div className="space-y-3 text-xs text-gray-700">
                                <div>
                                    <h4 className="font-bold text-teal-700 mb-0.5">Mehrere Adjektive (Parallel)</h4>
                                    <p className="mb-0.5">Adjektive in einer Aufzählung haben immer <b>die gleiche Endung</b>.</p>
                                    <ul className="list-disc list-inside pl-2 space-y-0.5 text-gray-600">
                                        <li>Nach Artikel: <i>die gut<b>en</b>, alt<b>en</b> Zeiten</i> (beide schwach)</li>
                                        <li>Ohne Artikel: <i>kalt<b>es</b>, klar<b>es</b> Wasser</i> (beide stark)</li>
                                    </ul>
                                </div>
                                <div className="border-t pt-2">
                                    <h4 className="font-bold text-teal-700 mb-1">Artikelwort oder Adjektiv?</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div className="bg-blue-50 p-2 rounded">
                                            <span className="font-semibold block mb-0.5">Wie bestimmte Artikel (Tabelle 2)</span>
                                            <p className="text-[10px] mb-1 leading-tight">Das folgende Adjektiv bekommt die schwache Endung (-e/-en).</p>
                                            <p className="font-mono text-[10px] text-blue-700">alle, beide, sämtliche, diese, jene, welche</p>
                                            <p className="text-[10px] italic mt-0.5">"Alle gut<b>en</b> Leute"</p>
                                        </div>
                                        <div className="bg-orange-50 p-2 rounded">
                                            <span className="font-semibold block mb-0.5">Wie Adjektive (Tabelle 1)</span>
                                            <p className="text-[10px] mb-1 leading-tight">Das folgende Adjektiv bekommt die starke Endung (parallel).</p>
                                            <p className="font-mono text-[10px] text-orange-700">viele, wenige, andere, mehrere, einige, folgende</p>
                                            <p className="text-[10px] italic mt-0.5">"Viele gut<b>e</b> Leute"</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </GlassCard>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

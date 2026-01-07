import React from 'react';
import { GlassCard } from '../../GlassCard';
import { ChevronDown, ChevronRight, Trash2 } from 'lucide-react';
import type { VocabularyCategory } from '../../../data/vocabulary/types';

export interface WordBlock {
    id: string;
    name: string;
    words: { german: string; russian: string }[];
    isVocabularyCategory?: boolean;
    vocabularyCategory?: VocabularyCategory;
}

interface LevelInfo {
    emoji: string;
    color: string;
    bgColor: string;
    borderColor: string;
    name: string;
}

interface BlockSelectorProps {
    blocks: WordBlock[];
    currentBlockId: string | null;
    expandedLevels: Record<string, boolean>;
    onToggleLevel: (level: string) => void;
    onDeleteBlock: (blockId: string) => void;
    onStartGame: (blockId: string) => void;
    getBlocksByLevel: (level: string) => WordBlock[];
}

const levelInfo: Record<string, LevelInfo> = {
    'A1': { emoji: '🟢', color: 'text-green-700', bgColor: 'bg-green-50', borderColor: 'border-green-300', name: 'Начальный' },
    'A2': { emoji: '🔵', color: 'text-blue-700', bgColor: 'bg-blue-50', borderColor: 'border-blue-300', name: 'Элементарный' },
    'B1': { emoji: '🟠', color: 'text-orange-700', bgColor: 'bg-orange-50', borderColor: 'border-orange-300', name: 'Средний' },
    'B2': { emoji: '🟣', color: 'text-purple-700', bgColor: 'bg-purple-50', borderColor: 'border-purple-300', name: 'Продвинутый' },
    'custom': { emoji: '📝', color: 'text-gray-700', bgColor: 'bg-gray-50', borderColor: 'border-gray-300', name: 'Мои блоки' }
};

export const BlockSelector: React.FC<BlockSelectorProps> = ({
    currentBlockId,
    expandedLevels,
    onToggleLevel,
    onDeleteBlock,
    onStartGame,
    getBlocksByLevel
}) => {
    const levels = ['A1', 'A2', 'B1', 'B2', 'custom'] as const;

    return (
        <div className="space-y-4">
            {levels.map(level => {
                const levelBlocks = getBlocksByLevel(level);
                if (level !== 'custom' && levelBlocks.length === 0) return null;

                const info = levelInfo[level];
                const isExpanded = expandedLevels[level];

                return (
                    <div key={level} className={`rounded-xl border-2 ${info.borderColor} overflow-hidden`}>
                        {/* Level Header */}
                        <button
                            onClick={() => onToggleLevel(level)}
                            className={`w-full px-4 py-3 ${info.bgColor} flex items-center justify-between transition-all hover:opacity-90`}
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">{info.emoji}</span>
                                <div className="text-left">
                                    <h2 className={`text-xl font-bold ${info.color}`}>
                                        {level === 'custom' ? 'Мои блоки' : `Уровень ${level}`}
                                    </h2>
                                    <p className="text-sm text-gray-600">
                                        {info.name} • {levelBlocks.length} {levelBlocks.length === 1 ? 'блок' : 'блоков'}
                                    </p>
                                </div>
                            </div>
                            {isExpanded ? (
                                <ChevronDown className={`w-6 h-6 ${info.color}`} />
                            ) : (
                                <ChevronRight className={`w-6 h-6 ${info.color}`} />
                            )}
                        </button>

                        {/* Blocks Grid */}
                        {isExpanded && levelBlocks.length > 0 && (
                            <div className="p-3 sm:p-4 bg-white/50 grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
                                {levelBlocks.map(block => (
                                    <GlassCard
                                        key={block.id}
                                        className={`p-3 sm:p-4 cursor-pointer transition-all hover:scale-[1.02] active:scale-95 flex flex-col h-full relative group ${currentBlockId === block.id
                                            ? 'ring-2 ring-purple-500 bg-purple-50'
                                            : 'hover:bg-gray-50'
                                            }`}
                                        onClick={() => onStartGame(block.id)}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xl sm:text-2xl">
                                                {block.vocabularyCategory?.icon || '📝'}
                                            </span>
                                            {!block.isVocabularyCategory && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onDeleteBlock(block.id);
                                                    }}
                                                    className="p-1.5 text-red-500 hover:bg-red-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                                    title="Удалить блок"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                        <h3 className="font-black text-gray-800 text-xs sm:text-base leading-tight mb-1">
                                            {block.name}
                                        </h3>
                                        <p className="text-[10px] sm:text-sm text-gray-500 mt-auto">
                                            {block.words.length} <span className="hidden sm:inline">слов</span><span className="sm:hidden">сл.</span>
                                        </p>
                                    </GlassCard>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

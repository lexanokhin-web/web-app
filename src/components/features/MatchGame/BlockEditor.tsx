import React, { useRef, useState } from 'react';
import { Button } from '../../Button';
import { GlassCard } from '../../GlassCard';
import { Plus, FolderPlus, Download, X, Upload } from 'lucide-react';
import type { WordBlock } from './BlockSelector';

interface BlockEditorProps {
    currentBlock: WordBlock | undefined;
    showNewBlockInput: boolean;
    newBlockName: string;
    newGerman: string;
    newRussian: string;
    importError: string | null;
    onNewBlockNameChange: (name: string) => void;
    onNewGermanChange: (word: string) => void;
    onNewRussianChange: (word: string) => void;
    onCreateBlock: () => void;
    onCancelNewBlock: () => void;
    onShowNewBlockInput: () => void;
    onAddWord: () => void;
    onRemoveWord: (blockId: string, wordIndex: number) => void;
    onFileImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onExportBlock: (blockId: string) => void;
}

export const BlockEditor: React.FC<BlockEditorProps> = ({
    currentBlock,
    showNewBlockInput,
    newBlockName,
    newGerman,
    newRussian,
    importError,
    onNewBlockNameChange,
    onNewGermanChange,
    onNewRussianChange,
    onCreateBlock,
    onCancelNewBlock,
    onShowNewBlockInput,
    onAddWord,
    onRemoveWord,
    onFileImport,
    onExportBlock
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [showImportHelp, setShowImportHelp] = useState(false);

    return (
        <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                    {currentBlock ? `📝 ${currentBlock.name}` : 'Создать новый блок'}
                </h2>
                <Button onClick={onShowNewBlockInput} variant="secondary" className="text-sm">
                    <FolderPlus className="w-4 h-4 mr-1" />
                    Новый блок
                </Button>
            </div>

            {/* New Block Input */}
            {showNewBlockInput && (
                <div className="mb-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex flex-wrap items-center gap-2">
                        <input
                            type="text"
                            value={newBlockName}
                            onChange={(e) => onNewBlockNameChange(e.target.value)}
                            placeholder="Название нового блока..."
                            className="flex-1 min-w-[200px] px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                            onKeyDown={(e) => e.key === 'Enter' && onCreateBlock()}
                        />
                        <div className="flex gap-2">
                            <Button onClick={onCreateBlock} variant="primary" className="text-sm">
                                <Plus className="w-4 h-4" />
                            </Button>
                            <Button onClick={onCancelNewBlock} variant="secondary" className="text-sm">
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Current Block Editor */}
            {currentBlock && !currentBlock.isVocabularyCategory && (
                <>
                    {/* Word Input */}
                    <div className="mb-4 flex flex-col sm:flex-row gap-2">
                        <input
                            type="text"
                            value={newGerman}
                            onChange={(e) => onNewGermanChange(e.target.value)}
                            placeholder="Немецкое слово..."
                            className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                        <input
                            type="text"
                            value={newRussian}
                            onChange={(e) => onNewRussianChange(e.target.value)}
                            placeholder="Русский перевод..."
                            className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                            onKeyDown={(e) => e.key === 'Enter' && onAddWord()}
                        />
                        <Button onClick={onAddWord} variant="primary">
                            <Plus className="w-5 h-5" />
                        </Button>
                    </div>

                    {/* Import/Export */}
                    <div className="mb-4 flex flex-wrap gap-2">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".csv,.txt"
                            onChange={onFileImport}
                            className="hidden"
                        />
                        <Button
                            onClick={() => fileInputRef.current?.click()}
                            variant="secondary"
                            className="text-sm"
                        >
                            <Upload className="w-4 h-4 mr-1" />
                            Импорт CSV
                        </Button>
                        <Button
                            onClick={() => onExportBlock(currentBlock.id)}
                            variant="secondary"
                            className="text-sm"
                        >
                            <Download className="w-4 h-4 mr-1" />
                            Экспорт
                        </Button>
                        <button
                            onClick={() => setShowImportHelp(!showImportHelp)}
                            className="text-xs text-blue-600 hover:underline"
                        >
                            Формат CSV?
                        </button>
                    </div>

                    {/* Import Help */}
                    {showImportHelp && (
                        <div className="mb-4 p-3 bg-blue-50 rounded-lg text-sm">
                            <p className="font-semibold mb-1">Формат CSV:</p>
                            <code className="block bg-white p-2 rounded text-xs">
                                der Apfel;яблоко<br />
                                das Haus;дом<br />
                                die Katze;кошка
                            </code>
                        </div>
                    )}

                    {/* Import Error */}
                    {importError && (
                        <div className="mb-4 p-3 bg-red-50 rounded-lg text-red-700 text-sm">
                            {importError}
                        </div>
                    )}

                    {/* Word List */}
                    {currentBlock.words.length > 0 && (
                        <div className="mt-4">
                            <h3 className="font-semibold text-gray-700 mb-2">
                                Слова ({currentBlock.words.length}):
                            </h3>
                            <div className="max-h-48 overflow-y-auto space-y-1">
                                {currentBlock.words.map((word, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100"
                                    >
                                        <span className="text-sm">
                                            <span className="font-medium">{word.german}</span>
                                            <span className="mx-2 text-gray-400">→</span>
                                            <span>{word.russian}</span>
                                        </span>
                                        <button
                                            onClick={() => onRemoveWord(currentBlock.id, idx)}
                                            className="text-red-500 hover:text-red-700 p-1"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Vocabulary Category Info */}
            {currentBlock?.isVocabularyCategory && (
                <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-green-700 text-sm">
                        ✅ Это системный блок из словаря. Содержит {currentBlock.words.length} слов.
                    </p>
                </div>
            )}

            {/* Empty State */}
            {!currentBlock && !showNewBlockInput && (
                <p className="text-gray-500 text-center py-8">
                    Выберите блок слева или создайте новый
                </p>
            )}
        </GlassCard>
    );
};

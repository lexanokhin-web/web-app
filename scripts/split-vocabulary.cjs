// Script to extract vocabulary categories from vocabularyData.ts into separate files
// Run with: node scripts/split-vocabulary.js

const fs = require('fs');
const path = require('path');

const sourceFile = path.join(__dirname, '../src/data/vocabularyData.ts');
const targetDir = path.join(__dirname, '../src/data/vocabulary');

console.log('📚 Splitting vocabulary data into modular files...\n');

// Read the source file
const content = fs.readFileSync(sourceFile, 'utf8');

// Extract A1 categories data
const extractArray = (varName) => {
    const regex = new RegExp(`const ${varName}:\\s*VocabularyWord\\[\\]\\s*=\\s*\\[([\\s\\S]*?)\\];`, 'g');
    const match = regex.exec(content);
    if (match) {
        return match[0];
    }
    return null;
};

// A1 categories to extract
const a1Categories = [
    { varName: 'a1Family', fileName: 'family', name: 'Family & People', nameRu: 'Семья и люди', icon: '👨‍👩‍👧‍👦' },
    { varName: 'a1Colors', fileName: 'colors', name: 'Colors', nameRu: 'Цвета', icon: '🎨' },
    { varName: 'a1Body', fileName: 'body', name: 'Body Parts', nameRu: 'Части тела', icon: '🧍' },
    { varName: 'a1Food', fileName: 'food', name: 'Food & Drink', nameRu: 'Еда и напитки', icon: '🍽️' },
    { varName: 'a1Fruits', fileName: 'fruits', name: 'Fruits & Vegetables', nameRu: 'Фрукты и овощи', icon: '🍎' },
    { varName: 'a1Home', fileName: 'home', name: 'Home & Furniture', nameRu: 'Дом и мебель', icon: '🏠' },
    { varName: 'a1Time', fileName: 'time', name: 'Time & Calendar', nameRu: 'Время и календарь', icon: '🕐' },
    { varName: 'a1Weather', fileName: 'weather', name: 'Weather & Seasons', nameRu: 'Погода и времена года', icon: '☀️' },
    { varName: 'a1Verbs', fileName: 'verbs', name: 'Basic Verbs', nameRu: 'Базовые глаголы', icon: '⚡' },
    { varName: 'a1Adjectives', fileName: 'adjectives', name: 'Basic Adjectives', nameRu: 'Базовые прилагательные', icon: '✨' },
    { varName: 'a1School', fileName: 'school', name: 'School Supplies', nameRu: 'Школьные принадлежности', icon: '📚' },
    { varName: 'a1Animals', fileName: 'animals', name: 'Animals', nameRu: 'Животные', icon: '🐾' },
    { varName: 'a1Clothing', fileName: 'clothing', name: 'Clothing Basics', nameRu: 'Базовая одежда', icon: '👕' },
];

// Create A1 category files
a1Categories.forEach(cat => {
    const arrayData = extractArray(cat.varName);
    if (!arrayData) {
        console.warn(`⚠️  Could not find ${cat.varName}`);
        return;
    }

    const fileContent = `// A1 ${cat.name}
import type { VocabularyWord, VocabularyCategory } from '../types';

export ${arrayData}

export const ${cat.varName}Category: VocabularyCategory = {
    id: 'a1_${cat.fileName}',
    level: 'A1',
    name: '${cat.name}',
    nameRu: '${cat.nameRu}',
    icon: '${cat.icon}',
    wordCount: ${cat.varName}.length,
    words: ${cat.varName}
};
`;

    const filePath = path.join(targetDir, 'a1', `${cat.fileName}.ts`);
    fs.writeFileSync(filePath, fileContent, 'utf8');
    console.log(`✅ Created a1/${cat.fileName}.ts`);
});

console.log('\n✨ Done!');

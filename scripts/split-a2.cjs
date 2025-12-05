// Script to extract A2 vocabulary categories
const fs = require('fs');
const path = require('path');

const sourceFile = path.join(__dirname, '../src/data/vocabularyData.ts');
const targetDir = path.join(__dirname, '../src/data/vocabulary');

console.log('📚 Splitting A2 vocabulary data...\n');

const content = fs.readFileSync(sourceFile, 'utf8');

const extractArray = (varName) => {
    const regex = new RegExp(`const ${varName}:\\s*VocabularyWord\\[\\]\\s*=\\s*\\[([\\s\\S]*?)\\];`, 'g');
    const match = regex.exec(content);
    if (match) {
        return match[0];
    }
    return null;
};

// A2 categories
const a2Categories = [
    { varName: 'a2Shopping', fileName: 'shopping', name: 'Shopping & Money', nameRu: 'Покупки и деньги', icon: '🛒' },
    { varName: 'a2Clothing', fileName: 'clothing', name: 'Clothing & Accessories', nameRu: 'Одежда и аксессуары', icon: '👔' },
    { varName: 'a2Health', fileName: 'health', name: 'Health & Medicine', nameRu: 'Здоровье и медицина', icon: '🏥' },
    { varName: 'a2Hobbies', fileName: 'hobbies', name: 'Hobbies & Free Time', nameRu: 'Хобби и досуг', icon: '🎨' },
    { varName: 'a2Sports', fileName: 'sports', name: 'Sports', nameRu: 'Спорт', icon: '⚽' },
    { varName: 'a2Transport', fileName: 'transport', name: 'Transportation & Vehicles', nameRu: 'Транспорт', icon: '🚗' },
    { varName: 'a2City', fileName: 'city', name: 'City & Places', nameRu: 'Город и места', icon: '🏙️' },
    { varName: 'a2Nature', fileName: 'nature', name: 'Nature & Plants', nameRu: 'Природа и растения', icon: '🌳' },
    { varName: 'a2Emotions', fileName: 'emotions', name: 'Emotions & Feelings', nameRu: 'Эмоции и чувства', icon: '❤️' },
    { varName: 'a2Restaurant', fileName: 'restaurant', name: 'Restaurant & Dining', nameRu: 'Ресторан и питание', icon: '🍴' },
    { varName: 'a2Technology', fileName: 'technology', name: 'Technology Basics', nameRu: 'Базовые технологии', icon: '💻' },
    { varName: 'a2Professions', fileName: 'professions', name: 'Professions', nameRu: 'Профессии', icon: '💼' },
    { varName: 'a2Verbs', fileName: 'verbs', name: 'More Verbs', nameRu: 'Дополнительные глаголы', icon: '⚡' },
];

a2Categories.forEach(cat => {
    const arrayData = extractArray(cat.varName);
    if (!arrayData) {
        console.warn(`⚠️  Could not find ${cat.varName}`);
        return;
    }

    const fileContent = `// A2 ${cat.name}
import type { VocabularyWord, VocabularyCategory } from '../types';

export ${arrayData}

export const ${cat.varName}Category: VocabularyCategory = {
    id: 'a2_${cat.fileName}',
    level: 'A2',
    name: '${cat.name}',
    nameRu: '${cat.nameRu}',
    icon: '${cat.icon}',
    wordCount: ${cat.varName}.length,
    words: ${cat.varName}
};
`;

    const filePath = path.join(targetDir, 'a2', `${cat.fileName}.ts`);
    fs.writeFileSync(filePath, fileContent, 'utf8');
    console.log(`✅ Created a2/${cat.fileName}.ts`);
});

console.log('\n✨ A2 Done!');

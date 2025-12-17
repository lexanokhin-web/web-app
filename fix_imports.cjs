const fs = require('fs');
const path = require('path');

const dir = path.join(process.cwd(), 'src/data/sentences');

function walk(directory) {
    if (!fs.existsSync(directory)) return;
    const files = fs.readdirSync(directory);
    for (const file of files) {
        const filepath = path.join(directory, file);
        if (fs.statSync(filepath).isDirectory()) {
            walk(filepath);
        } else if (filepath.endsWith('.ts')) {
            let content = fs.readFileSync(filepath, 'utf-8');
            // Regex to catch single space or no space
            const regex = /import\s+\{\s*SentenceExercise\s*\}\s+from\s+'\.\.\/types';/g;
            if (regex.test(content)) {
                content = content.replace(regex, "import type { SentenceExercise } from '../types';");
                fs.writeFileSync(filepath, content);
                console.log(`Fixed ${filepath}`);
            }
        }
    }
}

walk(dir);

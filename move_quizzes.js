const fs = require('fs');
const path = require('path');

const srcBase = path.join(process.cwd(), 'src/data/quizzes');
const destBase = path.join(process.cwd(), 'public/data/quizzes');
const dirs = ['a1', 'a2', 'b1', 'b2'];

console.log('Starting COPY operation...');

if (!fs.existsSync(destBase)) {
    console.log(`Creating directory: ${destBase}`);
    fs.mkdirSync(destBase, { recursive: true });
}

dirs.forEach(dir => {
    const src = path.join(srcBase, dir);
    const dest = path.join(destBase, dir);

    if (fs.existsSync(src)) {
        try {
            console.log(`Copying ${dir} to ${dest}...`);
            // Recursive copy
            fs.cpSync(src, dest, { recursive: true });
            console.log(`Successfully copied ${dir}`);
        } catch (e) {
            console.error(`Copy failed for ${dir}: ${e.message}`);
        }
    } else {
        console.log(`Source ${dir} not found.`);
    }
});

console.log('Copy operation complete.');

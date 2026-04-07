const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

function walkDir(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            results = results.concat(walkDir(fullPath));
        } else if (file.endsWith('.jsx')) {
            results.push(fullPath);
        }
    });
    return results;
}

const files = walkDir(path.join(__dirname, 'src'));

async function check() {
    for (const file of files) {
        const contents = fs.readFileSync(file, 'utf8');
        try {
            await esbuild.transform(contents, { loader: 'jsx' });
        } catch (e) {
            console.error('\nERROR IN:', file);
            console.error(e.message);
        }
    }
}
check();

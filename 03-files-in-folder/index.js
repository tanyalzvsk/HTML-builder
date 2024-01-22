const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'secret-folder');

async function getDirContent(dir) {
    const content = await fs.promises.readdir(dir, { withFileTypes: true });
    for (const file of content) {
        if (file.isFile()) {
            const currentFile = path.join(dir, file.name);
            const info = await fs.promises.stat(currentFile);
            const size = ((info.size) / 1240);
            const ext = path.extname(currentFile).slice(1);
            const fileName = path.basename(currentFile, path.extname(currentFile));
            console.log(`${fileName} - ${ext} - ${size.toFixed(2)}kb`);
        }
    }
}
getDirContent(dir);
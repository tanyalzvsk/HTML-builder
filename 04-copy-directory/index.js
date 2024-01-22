const fs = require('fs');
const path = require('path');
const parentDir = path.join(__dirname, 'files');
const childDir = path.join(__dirname, 'files-copy');
async function copyDir(dir) {
    await fs.promises.rm(dir, { recursive: true, force: true });
    await fs.promises.mkdir(dir, { recursive: true });
    const files = await fs.promises.readdir(parentDir, { withFileTypes: true });
    for (const file of files) {
        if (file.isFile()) {
            const filePath = path.join(parentDir, file.name);
            const newPath = path.join(childDir, file.name);
            await fs.promises.copyFile(filePath, newPath);
        }
    }
}
copyDir(childDir);
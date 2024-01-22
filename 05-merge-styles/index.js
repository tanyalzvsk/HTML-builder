const fs = require('fs');
const path = require('path')
const stylesArr = [];
const stylesDir = path.join(__dirname, 'styles');
const bundleDir = path.join(__dirname, 'project-dist', 'bundle.css');
console.log(bundleDir);
async function createBundle(dir) {
    const files = await fs.promises.readdir(dir, { withFileTypes: true });
    for (const file of files) {
        if (file.isFile() && path.extname(file.name) === '.css') {
            const pathToFile = path.join(dir, file.name);
            const content = await fs.promises.readFile(pathToFile, 'utf-8');
            stylesArr.push(content);
        }
    }
    const bundleFileContent = stylesArr.join("\n");
    await fs.promises.writeFile(bundleDir, bundleFileContent);
}

createBundle(stylesDir);
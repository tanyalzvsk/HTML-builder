const fs = require('fs');
const path = require('path');

const stylesArr = [];
const stylesDir = path.join(__dirname, 'styles');
const bundleDir = path.join(__dirname, 'project-dist', 'style.css');

const distDir = path.join(__dirname, 'project-dist');
const assetsDir = path.join(__dirname, 'assets');

const componentsDir = path.join(__dirname, 'components');
const template = path.join(__dirname, 'template.html');
const mainHtml = path.join(__dirname, 'project-dist', 'index.html');

async function copyDir(src, dest) {
    const assetsDest = path.join(dest, 'assets');
    await fs.promises.mkdir(assetsDest, { recursive: true });
    const files = await fs.promises.readdir(src, { withFileTypes: true });
    for (const file of files) {
        const filePath = path.join(src, file.name);
        const newPath = path.join(assetsDest, file.name);
        if (file.isDirectory()) {
            await copyDir(filePath, newPath);
        } else {
            await fs.promises.copyFile(filePath, newPath);
        }
    }
}

async function makeStyles(dir) {
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


async function makeHtml(template, src, dest) {
    const templateContent = await fs.promises.readFile(template, 'utf-8');
    const componentFiles = await fs.promises.readdir(componentsDir);
    const componentParams = [];
    for (let i = 0; i < componentFiles.length; i++) {
        const file = componentFiles[i];
        const componentName = path.parse(file).name;
        const componentFile = path.join(componentsDir, file);
        const componentContent = await fs.promises.readFile(componentFile, 'utf-8');
        componentParams.push({ name: componentName, content: componentContent });
    }

    let result = componentParams.reduce(
        (acc, { name, content }) => acc.replaceAll(`{{${name}}}`, content),
        templateContent
    );

    const files = await fs.promises.readdir(src, { withFileTypes: true });
    const params = {};
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const paramName = file.name;
        const paramValue = (await fs.promises.readFile(path.join(src, file.name))).toString();
        if (paramValue.includes('{{')) {
            params[paramName] = paramValue;
        }
    }

    for (const [key, value] of Object.entries(params)) {
        result = result.replaceAll(`{{${key}}}`, value);
    }

    await fs.promises.writeFile(dest, result, 'utf-8');
}

async function buildHtml() {
    await fs.promises.mkdir(distDir, { recursive: true });
    await fs.promises.rm(distDir, { recursive: true, force: true });
    await fs.promises.mkdir(distDir, { recursive: true });
    await copyDir(assetsDir, distDir);
    await makeStyles(stylesDir);
    await makeHtml(template, componentsDir, mainHtml);


}

buildHtml();
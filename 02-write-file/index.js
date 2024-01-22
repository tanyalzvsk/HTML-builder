const { stdout, stdin } = process;
const fs = require('fs');
const path = require('path');

const newTextFile = path.join(__dirname, 'text.txt');
const stream = fs.createWriteStream(newTextFile);
console.log('Hi! Write your text below. Use "exit" to finish');

stdin.on('data', (chunk) => {
    let data = chunk.toString().trim();
    if (data === 'exit') {
        stream.end();
        console.log("Program has been finished");
        process.exit();
    }
    else {
        stream.write(chunk);
    }

});
process.on('SIGINT', () => {
    console.log('Program has been finished');
    stream.end();
    process.exit();
  });

stdin.on('exit', () => {
        console.log("Program has been finished");
        process.exit(1);
});

stream.on('error', (err) => {
    console.error('Sorry, there is an error', err);
});
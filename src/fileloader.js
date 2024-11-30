const fs = require('fs');
const path = require('path');
const Lexer = require('./lexer');
const Parser = require('./parser');
const Interpreter = require('./interpreter');

class NSFWLoader {
    constructor() {
        this.interpreter = new Interpreter();
    }

    loadFile(filename) {
        try {
            if (!filename.endsWith('.nsfw')) {
                filename += '.nsfw';
            }

            const filePath = path.join(process.cwd(), 'use', filename);
            
            if (!fs.existsSync(filePath)) {
                throw new Error(`File not found: ${filename}`);
            }

            const code = fs.readFileSync(filePath, 'utf8');

            const lexer = new Lexer(code);
            const parser = new Parser(lexer);
            const ast = parser.parse();
            
            return this.interpreter.execute(ast);

        } catch (error) {
            console.error(`Error loading file ${filename}:`, error.message);
            throw error;
        }
    }

    loadAllFiles() {
        try {
            const useDir = path.join(process.cwd(), 'use');
            
            if (!fs.existsSync(useDir)) {
                fs.mkdirSync(useDir);
            }

            const files = fs.readdirSync(useDir)
                .filter(file => file.endsWith('.nsfw'));

            files.forEach(file => {
                console.log(`\nExecuting ${file}:`);
                this.loadFile(file);
                console.log('------------------------');
            });

        } catch (error) {
            console.error('Error loading files:', error.message);
            throw error;
        }
    }
}

module.exports = NSFWLoader;
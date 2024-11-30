const TokenTypes = require('./tokenTypes');

class Lexer {
    constructor(input) {
        this.input = input;
        this.position = 0;
        this.currentChar = this.input[this.position];
    }

    advance() {
        this.position++;
        this.currentChar = this.position < this.input.length ? 
            this.input[this.position] : null;
    }

    skipWhitespace() {
        while (this.currentChar && this.currentChar.match(/\s/)) {
            this.advance();
        }
    }

    nextToken() {
        while (this.currentChar) {
            if (this.currentChar.match(/\s/)) {
                this.skipWhitespace();
                continue;
            }
    
            if (this.currentChar.match(/[a-zA-Z]/)) {
                return this.identifier();
            }
    
            if (this.currentChar.match(/[0-9]/)) {
                return this.number();
            }
    
            if (this.currentChar === '"' || this.currentChar === "'") {
                return this.string();
            }

            if (this.currentChar === '<' || this.currentChar === '>' || this.currentChar === '=' || 
                this.currentChar === '+' || this.currentChar === '-' || this.currentChar === '*' || 
                this.currentChar === '/') {
                let operator = this.currentChar;
                this.advance();
                
                if (this.currentChar === '=') {
                    operator += '=';
                    this.advance();
                }
                
                return { type: TokenTypes.OPERATOR, value: operator };
            }

            switch (this.currentChar) {
                case '(':
                    this.advance();
                    return { type: TokenTypes.LPAREN, value: '(' };
                case ')':
                    this.advance();
                    return { type: TokenTypes.RPAREN, value: ')' };
                case '{':
                    this.advance();
                    return { type: TokenTypes.LBRACE, value: '{' };
                case '}':
                    this.advance();
                    return { type: TokenTypes.RBRACE, value: '}' };
                case ',':
                    this.advance();
                    return { type: TokenTypes.COMMA, value: ',' };
                case '.':
                    this.advance();
                    return { type: TokenTypes.DOT, value: '.' };
            }
    
            throw new Error(`Invalid character: ${this.currentChar}`);
        }
    
        return null;
    }

    identifier() {
        let result = '';
        while (this.currentChar && this.currentChar.match(/[a-zA-Z]/)) {
            result += this.currentChar;
            this.advance();
        }

        switch (result) {
            case 'shit':
                return { type: TokenTypes.PRINT, value: result };
            case 'fuck':
                return { type: TokenTypes.VAR, value: result };
            case 'damn':
                return { type: TokenTypes.MATH, value: result };
            case 'bitch':
                return { type: TokenTypes.LOOP, value: result };
            case 'ass':
                return { type: TokenTypes.IF, value: result };
            case 'dick':
                return { type: TokenTypes.FUNCTION, value: result };
            case 'cunt':
                return { type: TokenTypes.ARRAY, value: result };
            case 'balls':
                return { type: TokenTypes.LENGTH, value: result };
            case 'pussy':
                return { type: TokenTypes.STRING, value: result };
            case 'hell':
                return { type: TokenTypes.ERROR, value: result };
            case 'catch':
                return { type: TokenTypes.CATCH, value: result };
            case 'nuts':
                return { type: TokenTypes.INPUT, value: result };
            default:
                return { type: TokenTypes.IDENTIFIER, value: result };
        }
    }

    number() {
        let result = '';
        while (this.currentChar && this.currentChar.match(/[0-9]/)) {
            result += this.currentChar;
            this.advance();
        }
        return { type: TokenTypes.NUMBER, value: parseInt(result) };
    }

    string() {
        const quote = this.currentChar;
        this.advance(); 
        
        let result = '';
        while (this.currentChar && this.currentChar !== quote) {
            result += this.currentChar;
            this.advance();
        }
        
        this.advance(); 
        return { type: TokenTypes.STRING, value: result };
    }
}

module.exports = Lexer;
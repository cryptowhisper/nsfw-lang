const TokenTypes = require('./tokenTypes');

class Parser {
   constructor(lexer) {
       this.lexer = lexer;
       this.currentToken = this.lexer.nextToken();
   }

   consume(tokenType) {
       const token = this.currentToken;
       if (this.currentToken && this.currentToken.type === tokenType) {
           this.currentToken = this.lexer.nextToken();
           return token;
       } else {
           throw new Error(`Expected ${tokenType}, got ${this.currentToken?.type}`);
       }
   }

   parse() {
       const statements = [];
       
       while (this.currentToken) {
           const stmt = this.parseStatement();
           if (stmt) statements.push(stmt);
       }
       
       return statements;
   }

   parseStatement() {
       switch (this.currentToken.type) {
           case TokenTypes.PRINT:
               return this.parsePrint();
           case TokenTypes.VAR:
               return this.parseVariable();
           case TokenTypes.IDENTIFIER:
               return this.parseIdentifierStatement();
           case TokenTypes.LOOP:
               return this.parseLoop();
           case TokenTypes.FUNCTION:
               return this.parseFunction();
           case TokenTypes.ERROR:
               return this.parseError();
           case TokenTypes.MATH:
               return this.parseMathOperation();
           default:
               this.currentToken = this.lexer.nextToken();
               return null;
       }
   }

    parseInput() {
        this.consume(TokenTypes.INPUT);
        this.consume(TokenTypes.LPAREN);
        const prompt = this.parseExpression();
        this.consume(TokenTypes.RPAREN);
        return { type: 'input', prompt };
    }

   parseIdentifierStatement() {
       const identifier = this.currentToken.value;
       this.consume(TokenTypes.IDENTIFIER);

       if (this.currentToken.type === TokenTypes.LPAREN) {
           return this.parseFunctionCall(identifier);
       }
       else if (this.currentToken.type === TokenTypes.OPERATOR) {
           return this.parseAssignment(identifier);
       }
       
       throw new Error(`Unexpected token after identifier: ${this.currentToken.type}`);
   }

   parseFunctionCall(name) {
       this.consume(TokenTypes.LPAREN);
       const args = [];
       
       if (this.currentToken.type !== TokenTypes.RPAREN) {
           args.push(this.parseExpression());
           while (this.currentToken.type === TokenTypes.COMMA) {
               this.consume(TokenTypes.COMMA);
               args.push(this.parseExpression());
           }
       }
       
       this.consume(TokenTypes.RPAREN);
       return { type: 'functionCall', name, arguments: args };
   }

   parsePrint() {
       this.consume(TokenTypes.PRINT);
       this.consume(TokenTypes.LPAREN);
       const expr = this.parseExpression();
       this.consume(TokenTypes.RPAREN);
       return { type: 'print', value: expr };
   }

   parseExpression() {
       let left = this.parseTerm();

       while (
           this.currentToken && 
           this.currentToken.type === TokenTypes.OPERATOR && 
           ['+', '-', '*', '/', '<', '>', '<=', '>=', '=='].includes(this.currentToken.value)
       ) {
           const operator = this.currentToken.value;
           this.consume(TokenTypes.OPERATOR);
           const right = this.parseTerm();
           left = { type: 'binary', operator, left, right };
       }

       return left;
   }

   parseCondition() {
       let left = this.parseTerm();

       if (this.currentToken && this.currentToken.type === TokenTypes.OPERATOR) {
           const operator = this.currentToken.value;
           this.consume(TokenTypes.OPERATOR);
           const right = this.parseTerm();
           return { type: 'comparison', operator, left, right };
       }

       return left; 
   }

   parseTerm() {
    if (this.currentToken.type === TokenTypes.STRING) {
        const value = this.currentToken.value;
        this.consume(TokenTypes.STRING);
        return { type: 'string', value };
    }

    if (this.currentToken.type === TokenTypes.NUMBER) {
        const value = this.currentToken.value;
        this.consume(TokenTypes.NUMBER);
        return { type: 'number', value };
    }

    if (this.currentToken.type === TokenTypes.IDENTIFIER) {
        const name = this.currentToken.value;
        this.consume(TokenTypes.IDENTIFIER);
        
        if (this.currentToken && this.currentToken.type === TokenTypes.LPAREN) {
            return this.parseFunctionCall(name);
        }
        
        return { type: 'identifier', value: name };
    }

    if (this.currentToken.type === TokenTypes.MATH) {
        return this.parseMathOperation();
    }

    if (this.currentToken.type === TokenTypes.INPUT) {
        return this.parseInput();
    }

    throw new Error(`Unexpected term: ${this.currentToken.type}`);
}


   parseVariable() {
       this.consume(TokenTypes.VAR);
       const name = this.consume(TokenTypes.IDENTIFIER).value;
       this.consume(TokenTypes.OPERATOR); 
       const value = this.parseExpression();
       return { type: 'variable', name, value };
   }

   parseAssignment(name) {
       this.consume(TokenTypes.OPERATOR); 
       const value = this.parseExpression();
       return { type: 'assignment', name, value };
   }

   parseMathOperation() {
       this.consume(TokenTypes.MATH); 
       this.consume(TokenTypes.LPAREN);
       
       const left = this.parseTerm();

       if (!this.currentToken || this.currentToken.type !== TokenTypes.OPERATOR) {
           throw new Error('Expected operator in damn operation');
       }
       const operator = this.currentToken.value;
       this.consume(TokenTypes.OPERATOR);
       

       const right = this.parseTerm();
       
       this.consume(TokenTypes.RPAREN);
       
       return {
           type: 'mathOperation',
           operator: operator,
           left: left,
           right: right
       };
   }

   parseLoop() {
       this.consume(TokenTypes.LOOP);
       this.consume(TokenTypes.LPAREN);
       const condition = this.parseCondition();
       this.consume(TokenTypes.RPAREN);
       
       this.consume(TokenTypes.LBRACE);
       const body = [];
       while (this.currentToken && this.currentToken.type !== TokenTypes.RBRACE) {
           const stmt = this.parseStatement();
           if (stmt) body.push(stmt);
       }
       this.consume(TokenTypes.RBRACE);

       return { type: 'loop', condition, body };
   }

   parseFunction() {
       this.consume(TokenTypes.FUNCTION);
       const name = this.consume(TokenTypes.IDENTIFIER).value;
       this.consume(TokenTypes.LPAREN);
       
       const params = [];
       while (this.currentToken && this.currentToken.type !== TokenTypes.RPAREN) {
           params.push(this.consume(TokenTypes.IDENTIFIER).value);
           if (this.currentToken.type === TokenTypes.COMMA) {
               this.consume(TokenTypes.COMMA);
           }
       }
       this.consume(TokenTypes.RPAREN);
       
       this.consume(TokenTypes.LBRACE);
       const body = [];
       while (this.currentToken && this.currentToken.type !== TokenTypes.RBRACE) {
           const stmt = this.parseStatement();
           if (stmt) body.push(stmt);
       }
       this.consume(TokenTypes.RBRACE);

       return { type: 'function', name, params, body };
   }

   parseError() {
       this.consume(TokenTypes.ERROR);
       this.consume(TokenTypes.LBRACE);
       const tryBlock = [];
       while (this.currentToken && this.currentToken.type !== TokenTypes.RBRACE) {
           const stmt = this.parseStatement();
           if (stmt) tryBlock.push(stmt);
       }
       this.consume(TokenTypes.RBRACE);

       this.consume(TokenTypes.CATCH);
       this.consume(TokenTypes.LPAREN);
       const errorVar = this.consume(TokenTypes.IDENTIFIER).value;
       this.consume(TokenTypes.RPAREN);
       
       this.consume(TokenTypes.LBRACE);
       const catchBlock = [];
       while (this.currentToken && this.currentToken.type !== TokenTypes.RBRACE) {
           const stmt = this.parseStatement();
           if (stmt) catchBlock.push(stmt);
       }
       this.consume(TokenTypes.RBRACE);

       return { type: 'try-catch', tryBlock, errorVar, catchBlock };
   }
}

module.exports = Parser;
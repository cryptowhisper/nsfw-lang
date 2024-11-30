const readlineSync = require('readline-sync');

class Interpreter {
    constructor() {
        this.variables = {};
        this.functions = {};
    }

    execute(nodes) {
        if (!Array.isArray(nodes)) {
            nodes = [nodes];
        }

        let result = null;
        for (const node of nodes) {
            result = this.evaluateNode(node);
        }
        return result;
    }

    evaluateInput(node) {
        const prompt = this.evaluateNode(node.prompt);
        const input = readlineSync.question(prompt);
        return parseInt(input, 10);
    }

 evaluateNode(node) {
        switch (node.type) {
            case 'print':
                return this.evaluatePrint(node);
            case 'variable':
                return this.evaluateVariable(node);
            case 'assignment':
                return this.evaluateAssignment(node);
            case 'binary':
                return this.evaluateBinary(node);
            case 'comparison':
                return this.evaluateComparison(node);
            case 'loop':
                return this.evaluateLoop(node);
            case 'function':
                return this.evaluateFunction(node);
            case 'functionCall':
                return this.evaluateFunctionCall(node);
            case 'mathOperation':
                return this.evaluateMathOperation(node);
            case 'input':
                return this.evaluateInput(node);
            case 'string':
                return node.value;
            case 'number':
                return node.value;
            case 'identifier':
                return this.variables[node.value];
            default:
                throw new Error(`Unknown node type: ${node.type}`);
        }
    }


    evaluatePrint(node) {
        const value = this.evaluateNode(node.value);
        console.log(value);
        return value;
    }

    evaluateVariable(node) {
        const value = this.evaluateNode(node.value);
        this.variables[node.name] = value;
        return value;
    }

    evaluateAssignment(node) {
        const value = this.evaluateNode(node.value);
        this.variables[node.name] = value;
        return value;
    }

    evaluateBinary(node) {
        const left = this.evaluateNode(node.left);
        const right = this.evaluateNode(node.right);

        switch (node.operator) {
            case '+': return left + right;
            case '-': return left - right;
            case '*': return left * right;
            case '/': return left / right;
            default: throw new Error(`Unknown operator: ${node.operator}`);
        }
    }

    evaluateComparison(node) {
        const left = this.evaluateNode(node.left);
        const right = this.evaluateNode(node.right);

        switch (node.operator) {
            case '<': return left < right;
            case '>': return left > right;
            case '<=': return left <= right;
            case '>=': return left >= right;
            case '==': return left === right;
            default: throw new Error(`Unknown comparison operator: ${node.operator}`);
        }
    }

    evaluateLoop(node) {
        let result = null;
        while (this.evaluateNode(node.condition)) {
            for (const statement of node.body) {
                result = this.evaluateNode(statement);
            }
        }
        return result;
    }

    evaluateFunction(node) {
        this.functions[node.name] = {
            params: node.params,
            body: node.body
        };
        return null;
    }

    evaluateFunctionCall(node) {
        const func = this.functions[node.name];
        if (!func) {
            throw new Error(`Function not found: ${node.name}`);
        }

        const savedVariables = { ...this.variables };

        for (let i = 0; i < func.params.length; i++) {
            const paramName = func.params[i];
            const argValue = this.evaluateNode(node.arguments[i]);
            this.variables[paramName] = argValue;
        }

        let result = null;
        for (const statement of func.body) {
            result = this.evaluateNode(statement);
        }

        this.variables = savedVariables;

        return result;
    }

    evaluateMathOperation(node) {
        const left = this.evaluateNode(node.left);
        const right = this.evaluateNode(node.right);

        switch (node.operator) {
            case '+': return left + right;
            case '-': return left - right;
            case '*': return left * right;
            case '/': return left / right;
            default: throw new Error(`Unknown math operator: ${node.operator}`);
        }
    }
}

module.exports = Interpreter;
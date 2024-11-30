class Runtime {
    static standardLibrary = {
        'shit': function(text) {
            console.log(text);
        },
        'fuck': function(name, value) {
            return value;
        },
        'damn': function(a, operator, b) {
            switch(operator) {
                case '+': return a + b;
                case '-': return a - b;
                case '*': return a * b;
                case '/': return a / b;
                default: return null;
            }
        },
        'bitch': function(condition, body) {
            while(condition()) {
                body();
            }
        },
        'ass': function(condition, body) {
            if(condition()) {
                body();
            }
        }
    }
}

module.exports = Runtime;
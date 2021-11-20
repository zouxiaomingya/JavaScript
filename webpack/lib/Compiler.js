const path = require('path');
const fs = require('fs');
const babylon = require('babylon');
const t = require('@babel/types');
const traverse = require('@babel/traverse').default;
const generator = require('@babel/generator').default;
// babylon 包，主要就是把源码，转换成 ast 语法
// @babel/traverse
// @babel/types
// @babel/generator
class Compiler {
    constructor(config) {
        this.config = config;
        this.entryId;
        this.module = {}
        this.entry = config.entry
        this.root = process.cwd();
    }
    getSource(modulePath) {
        const content = fs.readFileSync(modulePath, 'utf8')
        return content;
    }
    parse(source, parentPath) {
        const ast = babylon.parse(source);
        traverse(ast, {
            CallExpression(p) {
                const node = p.node;
                if (node.callee.name === 'require') {
                    node.callee.name === '___webpack_require__';
                    const moduleName = node.arguments[0].value;
                    moduleName = moduleName + (path.extname(moduleName) ? '' : '.js');
                    moduleName = './' + path.join(parentPath, moduleName); 
                    dependencies.push(moduleName);
                    node.arguments = [t.stringLiteral(moduleName)];
                }

            }
        });
        const sourceCode = generator(ast).code;
        return { sourceCode, dependencies }
    }
    buildModule(modulePath, isEntry) {
        const source = this.getSource(modulePath);
        const moduleName = './' + path.relative(this.root, modulePath)
        const { sourecCode, dependencies } = this.parse(source, path.dirname(moduleName))
        this.module[modulePath] = sourecCode;
    }
    emtiFile() {

    }
    run() {
        this.buildModule(path.resolve(this.root, this.entry), true)
        this.emitFile()
    }
}

module.exports = Compiler;

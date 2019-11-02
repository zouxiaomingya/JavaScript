const path = require('path');
const fs = require('fs');
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
    parse() {

    }
    buildModule(modulePath) {
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
let path = require('path')

let config = require(path.resolve(__dirname));

let Compiler = require('../lib/Compiler.js')

let compiler = new Compiler(config)

compiler.run()
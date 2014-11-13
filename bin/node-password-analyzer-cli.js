#!/usr/bin/env node

var program = require('commander');
var fs = require('fs');
var pkg = require('../package.json');


program
  .version(pkg.version)
  .usage('[options] <file>')
  .option('-i, --input <file>', 'passwords input file', verifyFile.bind(null, true))
  .option('-o, --output <file>', 'analysis output file', verifyFile.bind(null, false))
  .option('-c, --config <file>', 'configuration file', verifyFile.bind(null, true))
  .option('-n, --num <num>', 'number of passwords to analyse', parseInt, -1);

program.parse(process.argv)

console.log(program)

function verifyFile(hasToExist, file) {
  if (hasToExist !== fs.existsSync(file)) {
    fileNotFoundInfo(file);
    process.exit(1);
  }
  return file
}

function fileNotFoundInfo(file) {
  console.log('');
  console.log('  error: file \'%s\' does not exist', file);
  console.log('');
}

var inherits = require('util').inherits;

function Analyzer (code, desc) {
	this.code = code || '[code]';
	this.description = desc || '[description]';
}

Analyzer.prototype.analyze = function (password) {}

inherits(RegexAnalyzer, Analyzer);

function RegexAnalyzer (code, desc, regexp) {
	Analyzer.call(this, code, desc);
	this.regexp = regexp;
}

RegexAnalyzer.prototype.analyze = function (password) {
	return this.regexp.test(password);
}

inherits(DigitsOnlyAnalyzer, RegexAnalyzer);

function DigitsOnlyAnalyzer () {
	RegexAnalyzer.call(this, 'digits-only', 'Digits only', /^\d+$/);
}

inherits(LettersOnlyAnalyzer, RegexAnalyzer);

function LettersOnlyAnalyzer () {
	RegexAnalyzer.call(this, 'letters-only', 'Letters only', /^[a-zA-Z]+$/);
}

inherits(CapitalLettersOnlyAnalyzer, RegexAnalyzer);

function CapitalLettersOnlyAnalyzer () {
	RegexAnalyzer.call(this, 'capital-letters-only', 'Capital letters only', /^[A-Z]+$/);
}

inherits(LowerLettersOnlyAnalyzer, RegexAnalyzer);

function LowerLettersOnlyAnalyzer () {
	RegexAnalyzer.call(this, 'lower-letters-only', 'Lowercase letters only', /^[a-z]+$/);
}

module.exports = {
	DigitsOnlyAnalyzer: DigitsOnlyAnalyzer,
	LettersOnlyAnalyzer: LettersOnlyAnalyzer,
	CapitalLettersOnlyAnalyzer: CapitalLettersOnlyAnalyzer,
	LowerLettersOnlyAnalyzer: LowerLettersOnlyAnalyzer
}

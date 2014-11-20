var inherits = require('util').inherits;

function Analyzer (code, desc) {
	this.code = code || '[code]';
	this.description = desc || '[description]';
}

Analyzer.prototype.analyze = function (password) {};

inherits(RegexAnalyzer, Analyzer);

function RegexAnalyzer (code, desc, regexp) {
	Analyzer.call(this, code, desc);
	this.regexp = regexp;
}

RegexAnalyzer.prototype.analyze = function (password, results) {
	results[this.code] = (results[this.code] || (results[this.code] = 0)) + this.regexp.test(password) ? 1 : 0;
};

inherits(DigitsOnlyAnalyzer, RegexAnalyzer);

function DigitsOnlyAnalyzer () {
	RegexAnalyzer.call(this, 'numeric', 'Numeric', /^\d+$/);
}

inherits(LettersOnlyAnalyzer, RegexAnalyzer);

function LettersOnlyAnalyzer () {
	RegexAnalyzer.call(this, 'letters-only', 'Letters only', /^[a-zA-Z]+$/);
}

inherits(CapitalLettersOnlyAnalyzer, RegexAnalyzer);

function CapitalLettersOnlyAnalyzer () {
	RegexAnalyzer.call(this, 'upperalpha', 'Upper alphanumeric', /^[A-Z]+$/);
}

inherits(LowerLettersOnlyAnalyzer, RegexAnalyzer);

function LowerLettersOnlyAnalyzer () {
	RegexAnalyzer.call(this, 'lower-letters-only', 'Lowercase letters only', /^[a-z]+$/);
}

module.exports = {
	'numeric': DigitsOnlyAnalyzer,
	DigitsOnlyAnalyzer: DigitsOnlyAnalyzer,
	LettersOnlyAnalyzer: LettersOnlyAnalyzer,
	CapitalLettersOnlyAnalyzer: CapitalLettersOnlyAnalyzer,
	LowerLettersOnlyAnalyzer: LowerLettersOnlyAnalyzer
};

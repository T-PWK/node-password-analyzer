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
	results[this.code] = (results[this.code] || 0) + (this.regexp.test(password) ? 1 : 0);
};

inherits(DigitsOnlyAnalyzer, RegexAnalyzer);

function DigitsOnlyAnalyzer () {
	RegexAnalyzer.call(this, 'numeric', 'Numeric only', /^\d+$/);
}

inherits(LettersOnlyAnalyzer, RegexAnalyzer);

function LettersOnlyAnalyzer () {
	RegexAnalyzer.call(this, 'lowerupperalpha', 'Lowercase and uppercase ASCII letters only', /^[a-zA-Z]+$/);
}

inherits(CapitalLettersOnlyAnalyzer, RegexAnalyzer);

function CapitalLettersOnlyAnalyzer () {
	RegexAnalyzer.call(this, 'upperalpha', 'Uppercase ASCII letters', /^[A-Z]+$/);
}

inherits(LowerLettersOnlyAnalyzer, RegexAnalyzer);

function LowerLettersOnlyAnalyzer () {
	RegexAnalyzer.call(this, 'loweralpha', 'Lowercase ASCII letters only', /^[a-z]+$/);
}

inherits(MonthsAnalyzer, Analyzer);

function MonthsAnalyzer () {
	Analyzer.call(this, 'months', 'Months');
}

MonthsAnalyzer.prototype.analyze = function (password, results) {
	var _passwd = password.toLowerCase();
	if(/^(january|february|march|april|may|june|july|august|september|october|november|december)$/.test(_passwd)) {
		results[_passwd] = (results[_passwd] || (results[_passwd] = 0)) + 1;
	}
};

module.exports = {
	'numeric': DigitsOnlyAnalyzer,
	'lowerupperalpha': LettersOnlyAnalyzer,
	'upperalpha': CapitalLettersOnlyAnalyzer,
	'loweralpha': LowerLettersOnlyAnalyzer,
	'months': MonthsAnalyzer
};

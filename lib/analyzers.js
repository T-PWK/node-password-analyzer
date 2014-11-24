(function () {
	'use strict';

	var inherits = require('util').inherits;

	function Analyzer (code, desc) {
		this.code = code || '[code]';
		this.description = desc || '[description]';
		this.multiKey = false;
	}

	Analyzer.prototype.analyze = function (password) {};

	Analyzer.prototype.getResults = function () {
		var results;
		if(this.multiKey) {
			results = [];
			for(var key in this.results || {}) {
				results.push({ code: key, total: this.results[key] });
			}
		} else {
			results = { code: this.code, total: this.total };
		}
		return results;
	};

	inherits(RegexAnalyzer, Analyzer);

	function RegexAnalyzer (code, desc, regexp) {
		Analyzer.call(this, code, desc);
		this.regexp = regexp;
		this.total = 0;
	}

	RegexAnalyzer.prototype.analyze = function (password) {
		if(this.regexp.test(password)) {
			this.total++;
		}
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
		this.results = {};
		this.multiKey = true;
	}

	MonthsAnalyzer.prototype.analyze = function (password) {
		var _passwd = password.toLowerCase();
		if(/^(january|february|march|april|may|june|july|august|september|october|november|december)$/.test(_passwd)) {
			this.results[_passwd] = (this.results[_passwd] || 0) + 1;
		}
	};

	inherits(PasswordLengthAnalyzer, Analyzer);

	function PasswordLengthAnalyzer (argument) {
		Analyzer.call(this, 'length', 'Length');
	}

	PasswordLengthAnalyzer.prototype.analyze = function (password) {
		var length = password.length;
		this.results[length] = (this.results[length] || 0) + 1;
	};

	module.exports = {
		Analyzer: Analyzer,
		RegexAnalyzer: RegexAnalyzer,
		DigitsOnlyAnalyzer: DigitsOnlyAnalyzer,
		LettersOnlyAnalyzer: LettersOnlyAnalyzer,
		CapitalLettersOnlyAnalyzer: CapitalLettersOnlyAnalyzer,
		LowerLettersOnlyAnalyzer: LowerLettersOnlyAnalyzer,
		MonthsAnalyzer: MonthsAnalyzer,
		PasswordLengthAnalyzer: PasswordLengthAnalyzer
	};

}());
(function () {
	'use strict';

	var inherits = require('util').inherits;

	function Analyzer (code, desc) {
		this.code = code || '[code]';
		this.description = desc || '[description]';
		this.singleKey = true;
	}

	Analyzer.prototype.analyze = function (password) {};

	Analyzer.prototype.getResults = function () {
		var results = [];
		if(!this.singleKey) {
			for(var key in this.results || {}) {
				results.push({ code: key, count: this.results[key] });
			}
		} else {
			results.push({ code: this.code, count: this.count });
		}
		return results;
	};

	inherits(RegexAnalyzer, Analyzer);

	function RegexAnalyzer (code, desc, regexp) {
		Analyzer.call(this, code, desc);
		this.regexp = regexp;
		this.count = 0;
	}

	RegexAnalyzer.prototype.analyze = function (password) {
		if(this.regexp.test(password)) {
			this.count++;
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
		this.singleKey = false;
	}

	MonthsAnalyzer.prototype.analyze = function (password) {
		var _passwd = password.toLowerCase();
		if(/^(january|february|march|april|may|june|july|august|september|october|november|december)$/.test(_passwd)) {
			this.results[_passwd] = (this.results[_passwd] || 0) + 1;
		}
	};

	function MaskAnalyzer (mask) {
		if(!/^(\?(l|u|s|d))+$/.test(mask)) {
			throw new Error('Invalid mask: ' + mask);
		}

		var _mask = mask.replace(/\?(l|u|s|d)/g, function (match) {
			return (function () {
				switch (match) {
					case '?l': return '[a-z]';
					case '?u': return '[A-Z]';
					case '?d': return '\\d';
					case '?s': return "[ !\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~]";
				}
			}());
		});

		RegexAnalyzer.call(this, mask, 'Mask: ' + mask, new RegExp('^' + _mask +'$'));
	}

	inherits(MaskAnalyzer, RegexAnalyzer);

	inherits(PasswordLengthAnalyzer, Analyzer);

	function PasswordLengthAnalyzer (argument) {
		Analyzer.call(this, 'length', 'Length');
		this.results = {};
		this.singleKey = false;
	}

	PasswordLengthAnalyzer.prototype.analyze = function (password) {
		var length = password.length;
		this.results[length] = (this.results[length] || 0) + 1;
	};

	module.exports = {
		Analyzer: Analyzer,
		RegexAnalyzer: RegexAnalyzer,
		MaskAnalyzer: MaskAnalyzer,
		DigitsOnlyAnalyzer: DigitsOnlyAnalyzer,
		LettersOnlyAnalyzer: LettersOnlyAnalyzer,
		CapitalLettersOnlyAnalyzer: CapitalLettersOnlyAnalyzer,
		LowerLettersOnlyAnalyzer: LowerLettersOnlyAnalyzer,
		MonthsAnalyzer: MonthsAnalyzer,
		PasswordLengthAnalyzer: PasswordLengthAnalyzer
	};

}());
(function () {
	'use strict';

	var inherits = require('util').inherits;
	var fmt = require('util').format;

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
		if(typeof mask !== 'string' || !mask.length) {
			throw new Error('Invalid mask: ' + mask);
		}

		var _mask = mask.replace(/(\?l)+|(\?u)+|(\?s)+|(\?d)|(\?a)+/g, function (match) {
			var mask = match.substring(0, 2), len = match.length / 2;
			return (function () {
				switch (match.substring(0, 2)) {
					case '?l': return '[a-z]' + (len > 1 ? fmt('{%d}', len) : '');
					case '?u': return '[A-Z]' + (len > 1 ? fmt('{%d}', len) : '');
					case '?d': return '\\d' + (len > 1 ? fmt('{%d}', len) : '');
					case '?s': return "[ !\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~]" + (len > 1 ? fmt('{%d}', len) : '');
					case '?a': return "[a-zA-Z0-9 !\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~]" + (len > 1 ? fmt('{%d}', len) : '');
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

	/**
	[*] Character-set:
[+]                loweralpha: 32% (46385)
[+]             loweralphanum: 29% (42290)
[+]                   numeric: 11% (16019)
[+]             mixedalphanum: 08% (12414)
[+]                upperalpha: 04% (6475)
[+]             upperalphanum: 04% (5703)
[+]                mixedalpha: 03% (4549)
[+]      loweralphaspecialnum: 01% (2219)
[+]                       all: 01% (1687)
[+]         loweralphaspecial: 01% (1436)
[+]         mixedalphaspecial: 00% (845)
[+]         upperalphaspecial: 00% (808)
[+]      upperalphaspecialnum: 00% (221)
[+]                specialnum: 00% (145)
[+]                   special: 00% (70)
	**/

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
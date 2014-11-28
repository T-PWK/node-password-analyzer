(function () {
	'use strict';

	var inherits = require('util').inherits;
	var fmt = require('util').format;
	var isArray = require('util').isArray;

	function Analyzer (code) {
		this.code = code || '[code]';
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

	function RegexAnalyzer (code, regexp) {
		Analyzer.call(this, code);
		this.count = 0;

		if(isArray(regexp)) {
			this.regexp = regexp;
		} else {
			this.regexp = [ regexp ];
		}
	}

	RegexAnalyzer.prototype.analyze = function (password) {
		for (var i = this.regexp.length - 1; i >= 0; i--) {
			if(!this.regexp[i].test(password)) {
				return;
			}
		}

		this.count++;
	};

	inherits(NumericAnalyzer, RegexAnalyzer);

	function NumericAnalyzer () {
		RegexAnalyzer.call(this, 'numeric', /^\d+$/);
	}

	inherits(MixedAlphaAnalyzer, RegexAnalyzer);

	function MixedAlphaAnalyzer () {
		RegexAnalyzer.call(this, 'mixedalpha', [/[a-z]/, /[A-Z]/, /^[a-zA-Z]+$/]);
	}

	inherits(UpperAlphaAnalyzer, RegexAnalyzer);

	function UpperAlphaAnalyzer () {
		RegexAnalyzer.call(this, 'upperalpha', /^[A-Z]+$/);
	}

	inherits(LowerAlphaAnalyzer, RegexAnalyzer);

	function LowerAlphaAnalyzer () {
		RegexAnalyzer.call(this, 'loweralpha', /^[a-z]+$/);
	}

	inherits(LowerAlphaNumAnalyzer, RegexAnalyzer);

	function LowerAlphaNumAnalyzer () {
		RegexAnalyzer.call(this, 'loweralphanum', [/[a-z]/, /[0-9]/, /^[a-z0-9]+$/]);
	}

	inherits(MixedAlphaNumAnalyzer, RegexAnalyzer);

	function MixedAlphaNumAnalyzer () {
		RegexAnalyzer.call(this, 'mixedalphanum', [/[a-z]/, /[A-Z]/, /[0-9]/, /^[a-zA-Z0-9]+$/]);
	}

	inherits(UpperAlphaNumAnalyzer, RegexAnalyzer);

	function UpperAlphaNumAnalyzer () {
		RegexAnalyzer.call(this, 'upperalphanum', [/[A-Z]/, /[0-9]/, /^[A-Z0-9]+$/]);
	}

	inherits(SpecialAnalyzer, RegexAnalyzer);

	function SpecialAnalyzer () {
		RegexAnalyzer.call(this, 'special', new RegExp("^[ !\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~]+$"));
	}

	inherits(SpecialNumAnalyzer, RegexAnalyzer);

	function SpecialNumAnalyzer () {
		RegexAnalyzer.call(this, 'specialnum', [
			/[0-9]/,
			new RegExp("[ !\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~]"),
			new RegExp("^[ !\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~0-9]+$")
		]);
	}

	/** TODO: add following anlayzers: loweralphaspecialnum, all, loweralphaspecial, mixedalphaspecial, upperalphaspecial, upperalphaspecialnum	**/

	inherits(MonthsAnalyzer, Analyzer);

	function MonthsAnalyzer () {
		Analyzer.call(this, 'months');
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

		RegexAnalyzer.call(this, mask, new RegExp('^' + _mask +'$'));
	}

	inherits(MaskAnalyzer, RegexAnalyzer);

	inherits(PasswordLengthAnalyzer, Analyzer);

	function PasswordLengthAnalyzer (argument) {
		Analyzer.call(this, 'length');
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
		NumericAnalyzer: NumericAnalyzer,
		MixedAlphaAnalyzer: MixedAlphaAnalyzer,
		UpperAlphaAnalyzer: UpperAlphaAnalyzer,
		LowerAlphaAnalyzer: LowerAlphaAnalyzer,
		LowerAlphaNumAnalyzer: LowerAlphaNumAnalyzer,
		UpperAlphaNumAnalyzer: UpperAlphaNumAnalyzer,
		MixedAlphaNumAnalyzer: MixedAlphaNumAnalyzer,
		SpecialAnalyzer: SpecialAnalyzer,
		SpecialNumAnalyzer: SpecialNumAnalyzer,
		MonthsAnalyzer: MonthsAnalyzer,
		PasswordLengthAnalyzer: PasswordLengthAnalyzer
	};

}());
(function () {
	var assert = require('assert');
	var util = require('util');
	var analyzers = require('../lib/analyzers');

	describe('Analyzers', function () {
		
		describe('MonthsAnalyzer', function () {
			var analyzer;

			beforeEach(function () {
				analyzer = new analyzers.MonthsAnalyzer();
			});

			it('should match passwords that are composed from month names only no matther the letter case', function () {
				
				analyzer.analyze('january');
				analyzer.analyze('JANUARY');
				analyzer.analyze('January');
				analyzer.analyze('februarY');

				var results = analyzer.getResults();

				assert(util.isArray(results));
				assert.equal(results.length, 2);
				assert.equal(findItemByCode(results, 'january').count, 3);
				assert.equal(findItemByCode(results, 'february').count, 1);
			});

			it('should match entire line of text, not find a containing text', function () {
				analyzer.analyze(' january');
				analyzer.analyze('JANUARY ');
				analyzer.analyze('January.');

				var results = analyzer.getResults();
				assert(util.isArray(results));
				assert.equal(results.length, 0);
			});
		});

		describe('NumericAnalyzer', function () {
			var analyzer;

			beforeEach(function () {
				analyzer = new analyzers.NumericAnalyzer();
			});

			it('should match passwords that are composed from numbers only', function () {
				analyzer.analyze('123312');
				analyzer.analyze('1234567890');
				analyzer.analyze('00000000');
				analyzer.analyze('1');

				var results = analyzer.getResults();
				assert.equal(results.length, 1);
				assert.equal(results[0].code, 'numeric');
				assert.equal(results[0].count, 4);
			});

			it('should not match passwords having at least one character which is not a number', function () {
				analyzer.analyze(' 00001212');
				analyzer.analyze('123456 ');
				analyzer.analyze('123,234,233');

				var results = analyzer.getResults();
				assert.equal(results.length, 1);
				assert.equal(results[0].code, 'numeric');
				assert.equal(results[0].count, 0);
			});
		});

		describe('MixedAlphaAnalyzer', function () {
			var analyzer;

			beforeEach(function () {
				analyzer = new analyzers.MixedAlphaAnalyzer();
			});

			it('should match passwords that are composed from lower and upper letters only', function () {
				analyzer.analyze('abcd');
				analyzer.analyze('ABCD');
				analyzer.analyze('abCD');

				var results = analyzer.getResults();

				assert.equal(results.length, 1);
				assert.equal(results[0].code, 'mixedalpha');
				assert.equal(results[0].count, 3);
			});

			it('should not match passwords having at least one character which is not a letter', function () {
				analyzer.analyze(' abcd');
				analyzer.analyze('ABC1');

				var results = analyzer.getResults();

				assert.equal(results.length, 1);
				assert.equal(results[0].code, 'mixedalpha');
				assert.equal(results[0].count, 0);
			});
		});

		describe('UpperAlphaAnalyzer', function () {
			var analyzer;

			beforeEach(function () {
				analyzer = new analyzers.UpperAlphaAnalyzer();
			});

			it('should match passwords that are composed from upper letters only', function () {
				analyzer.analyze('A');
				analyzer.analyze('ABCD');

				var results = analyzer.getResults();

				assert.equal(results.length, 1);
				assert.equal(results[0].code, 'upperalpha');
				assert.equal(results[0].count, 2);
			});

			it('should not match passwords having at least one character which is not an upper letter', function () {
				analyzer.analyze(' abcd');
				analyzer.analyze('ABC1');
				analyzer.analyze('ABCd');

				var results = analyzer.getResults();

				assert.equal(results.length, 1);
				assert.equal(results[0].code, 'upperalpha');
				assert.equal(results[0].count, 0);
			});
		});

		describe('LowerAlphaAnalyzer', function () {
			var analyzer;

			beforeEach(function () {
				analyzer = new analyzers.LowerAlphaAnalyzer();
			});

			it('should match passwords that are composed from lower letters only', function () {
				analyzer.analyze('a');
				analyzer.analyze('abcd');

				var results = analyzer.getResults();
				assert.equal(results.length, 1);
				assert.equal(results[0].code, 'loweralpha');
				assert.equal(results[0].count, 2);
			});

			it('should not match passwords having at least one character which is not a lower letter', function () {
				analyzer.analyze(' abcd');
				analyzer.analyze('abc1');
				analyzer.analyze('abcD');

				var results = analyzer.getResults();

				assert.equal(results.length, 1);
				assert.equal(results[0].code, 'loweralpha');
				assert.equal(results[0].count, 0);
			});
		});

		describe('LowerAlphaNumAnalyzer', function () {
			var analyzer = new analyzers.LowerAlphaNumAnalyzer();

			it('should match passwords with lowercase letters and numbers only', function () {
				analyzer.analyze('abc'); // match
				analyzer.analyze('ab1232'); // match
				analyzer.analyze('3424'); // match
				analyzer.analyze('Abc2134'); // do not match

				var results = analyzer.getResults();

				assert.equal(results.length, 1);
				assert.equal(results[0].code, 'loweralphanum');
				assert.equal(results[0].count, 3);
			});
		});

		describe('SpecialAnalyzer', function () {
			var analyzer = new analyzers.SpecialAnalyzer();

			it('should match passwords with special letters only', function () {
				analyzer.analyze('$%^'); // match
				analyzer.analyze(' $"!'); // match
				analyzer.analyze('!-='); // match
				analyzer.analyze('!as'); // do not match

				var results = analyzer.getResults();

				assert.equal(results.length, 1);
				assert.equal(results[0].code, 'special');
				assert.equal(results[0].count, 3);
			});
		});

		describe('SpecialNumAnalyzer', function () {
			var analyzer = new analyzers.SpecialNumAnalyzer();

			it('should match passwords with special and numeric characters only', function () {
				analyzer.analyze('$%^'); // match
				analyzer.analyze(' $"!'); // match
				analyzer.analyze('!-='); // match
				analyzer.analyze('!123'); // match
				analyzer.analyze('!asd'); // do not match

				var results = analyzer.getResults();

				assert.equal(results.length, 1);
				assert.equal(results[0].code, 'specialnum');
				assert.equal(results[0].count, 4);
			});
		});

		describe('PasswordLengthAnalyzer', function () {
			var analyzer;

			beforeEach(function () {
				analyzer = new analyzers.PasswordLengthAnalyzer();
			});

			it('should populate results with length for each password', function () {
				analyzer.analyze('a');
				analyzer.analyze('abcd');
				analyzer.analyze('foobar');
				analyzer.analyze('x');

				var results = analyzer.getResults();

				assert.equal(results.length, 3);
				assert.equal(findItemByCode(results, '1').count, 2);
				assert.equal(findItemByCode(results, '4').count, 1);
				assert.equal(findItemByCode(results, '6').count, 1);
				assert.equal(findItemByCode(results, '2'), null);
			});
		});

		describe('MaskAnalyzer', function () {
			var analyzer;

			it('should throw exception if mask is invalid', function () {
				assert.throws(function () { new analyzers.MaskAnalyzer(); });
				assert.throws(function () { new analyzers.MaskAnalyzer(''); });
				assert.throws(function () { new analyzers.MaskAnalyzer(123); });
			});

			describe('should create analyzer', function () {

				it("should analyze passwords composed of '?l' tokens only", function () {
					var analyzer = new analyzers.MaskAnalyzer('?l?l?l?l');

					analyzer.analyze('abcd');
					analyzer.analyze('abcde');
					analyzer.analyze('abcde');
					analyzer.analyze('Abcd');

					var results = analyzer.getResults();

					assert.equal(results.length, 1);
					assert.equal(results[0].code, '?l?l?l?l');
					assert.equal(results[0].count, 1);
				});

				it("should analyze passwords composed of '?u' tokens only", function () {
					var analyzer = new analyzers.MaskAnalyzer('?u?u?u?u');

					analyzer.analyze('ABCD');
					analyzer.analyze('ABCDE');
					analyzer.analyze('Abcd');

					var results = analyzer.getResults();

					assert.equal(results.length, 1);
					assert.equal(results[0].code, '?u?u?u?u');
					assert.equal(results[0].count, 1);
				});

				it("should analyze passwords composed of '?d' tokens only", function () {
					var analyzer = new analyzers.MaskAnalyzer('?d?d?d?d');

					analyzer.analyze('1234');
					analyzer.analyze('12345');
					analyzer.analyze('1234a');

					var results = analyzer.getResults();

					assert.equal(results.length, 1);
					assert.equal(results[0].code, '?d?d?d?d');
					assert.equal(results[0].count, 1);
				});

				it("should analyze passwords composed of '?s' tokens only", function () {
					var analyzer = new analyzers.MaskAnalyzer('?s?s?s?s');

					analyzer.analyze('**{}');
					analyzer.analyze(' *[]');
					analyzer.analyze(' *[!');
					analyzer.analyze(' !`@');
					analyzer.analyze('**{}*');
					analyzer.analyze('**{}a');

					var results = analyzer.getResults();

					assert.equal(results.length, 1);
					assert.equal(results[0].code, '?s?s?s?s');
					assert.equal(results[0].count, 4);
				});

				it("should analyze passwords composed of '?a' tokens only", function () {
					var analyzer = new analyzers.MaskAnalyzer('?a?a?a?a');

					analyzer.analyze('Pas!');
					analyzer.analyze('Pa*2');
					analyzer.analyze('1234');
					analyzer.analyze('abcd');
					analyzer.analyze('ABCD');
					analyzer.analyze('*{} ');

					var results = analyzer.getResults();

					assert.equal(results.length, 1);
					assert.equal(results[0].code, '?a?a?a?a');
					assert.equal(results[0].count, 6);
				});

				it("should analyze passwords with mask composed of letters and tokens e.g. 'Password?d'", function () {
					var analyzer = new analyzers.MaskAnalyzer('Password?d');

					analyzer.analyze('Password1');
					analyzer.analyze('Password0');
					analyzer.analyze('Password2');
					analyzer.analyze('password2');

					var results = analyzer.getResults();

					assert.equal(results.length, 1);
					assert.equal(results[0].code, 'Password?d');
					assert.equal(results[0].count, 3);
				});
			});
		});
	});

	function findItemByCode (results, code) {
		return results.filter(function (result) {
			return result.code == code;
		})[0];
	}

}());
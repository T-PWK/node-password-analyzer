(function () {
	var assert = require('assert');
	var util = require('util');
	var analyzers = require('../lib/analyzers');

	describe('Analyzers', function () {
		
		describe('Months analyzer', function () {
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
				analyzer.analyze(' january', results);
				analyzer.analyze('JANUARY ', results);
				analyzer.analyze('January.', results);

				var results = analyzer.getResults();
				assert(util.isArray(results));
				assert.equal(results.length, 0);
			});
		});

		describe('Numeric analyzer', function () {
			var analyzer;

			beforeEach(function () {
				analyzer = new analyzers.DigitsOnlyAnalyzer();
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
				analyzer.analyze(' 00001212', results);
				analyzer.analyze('123456 ', results);
				analyzer.analyze('123,234,233', results);

				var results = analyzer.getResults();
				assert.equal(results.length, 1);
				assert.equal(results[0].code, 'numeric');
				assert.equal(results[0].count, 0);
			});
		});

		describe('Letters only analyzer', function () {
			var analyzer;

			beforeEach(function () {
				analyzer = new analyzers.LettersOnlyAnalyzer();
			});

			it('should match passwords that are composed from lower and upper letters only', function () {
				analyzer.analyze('abcd');
				analyzer.analyze('ABCD');
				analyzer.analyze('abCD');

				var results = analyzer.getResults();

				assert.equal(results.length, 1);
				assert.equal(results[0].code, 'lowerupperalpha');
				assert.equal(results[0].count, 3);
			});

			it('should not match passwords having at least one character which is not a letter', function () {
				analyzer.analyze(' abcd', results);
				analyzer.analyze('ABC1', results);

				var results = analyzer.getResults();

				assert.equal(results.length, 1);
				assert.equal(results[0].code, 'lowerupperalpha');
				assert.equal(results[0].count, 0);
			});
		});

		describe('Uppercase letters only analyzer', function () {
			var analyzer;

			beforeEach(function () {
				analyzer = new analyzers.CapitalLettersOnlyAnalyzer();
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
				analyzer.analyze(' abcd', results);
				analyzer.analyze('ABC1', results);
				analyzer.analyze('ABCd', results);

				var results = analyzer.getResults();

				assert.equal(results.length, 1);
				assert.equal(results[0].code, 'upperalpha');
				assert.equal(results[0].count, 0);
			});
		});

		describe('Lowercase letters only analyzer', function () {
			var analyzer;

			beforeEach(function () {
				analyzer = new analyzers.LowerLettersOnlyAnalyzer();
			});

			it('should match passwords that are composed from lower letters only', function () {
				analyzer.analyze('a', results);
				analyzer.analyze('abcd', results);

				var results = analyzer.getResults();
				assert.equal(results.length, 1);
				assert.equal(results[0].code, 'loweralpha');
				assert.equal(results[0].count, 2);
			});

			it('should not match passwords having at least one character which is not a lower letter', function () {
				analyzer.analyze(' abcd', results);
				analyzer.analyze('abc1', results);
				analyzer.analyze('abcD', results);

				var results = analyzer.getResults();

				assert.equal(results.length, 1);
				assert.equal(results[0].code, 'loweralpha');
				assert.equal(results[0].count, 0);
			});
		});

		describe('Password length analyzer', function () {
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
	});

	function findItemByCode (results, code) {
		return results.filter(function (result) {
			return result.code == code;
		})[0];
	}

}());
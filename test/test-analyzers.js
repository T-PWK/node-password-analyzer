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

            // assert(results.february);

            // assert.equal(results.january, 3);
            // assert.equal(results.february, 1);
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
            assert.equal(results.total, 4);
            assert.equal(results.code, 'numeric');
        });

        it('should not match passwords having at least one character which is not a number', function () {
            var results = { numeric: 0 };
            analyzer.analyze(' 00001212', results);
            analyzer.analyze('123456 ', results);
            analyzer.analyze('123,234,233', results);

            var results = analyzer.getResults();
            assert.equal(results.total, 0);
            assert.equal(results.code, 'numeric');
        });
    });

    describe('Letters only analyzer', function () {
        var analyzer = new analyzers.LettersOnlyAnalyzer();

        it('should match passwords that are composed from lower and upper letters only', function () {
            var results = {};

            analyzer.analyze('abcd', results);
            analyzer.analyze('ABCD', results);
            analyzer.analyze('abCD', results);

            assert.equal(results.lowerupperalpha, 3);
        });

        it('should not match passwords having at least one character which is not a letter', function () {
            var results = { lowerupperalpha: 0 };
            analyzer.analyze(' abcd', results);
            analyzer.analyze('ABC1', results);

            assert.equal(results.lowerupperalpha, 0);
        });
    });

    describe('Upper letters only analyzer', function () {
        var analyzer = new analyzers.CapitalLettersOnlyAnalyzer();

        it('should match passwords that are composed from upper letters only', function () {
            var results = {};

            analyzer.analyze('A', results);
            analyzer.analyze('ABCD', results);

            assert.equal(results.upperalpha, 2);
        });

        it('should not match passwords having at least one character which is not an upper letter', function () {
            var results = { upperalpha: 0 };
            analyzer.analyze(' abcd', results);
            analyzer.analyze('ABC1', results);
            analyzer.analyze('ABCd', results);

            assert.equal(results.upperalpha, 0);
        });
    });

    describe('Upper letters only analyzer', function () {
        var analyzer = new analyzers.LowerLettersOnlyAnalyzer();

        it('should match passwords that are composed from lower letters only', function () {
            var results = {};

            analyzer.analyze('a', results);
            analyzer.analyze('abcd', results);

            assert.equal(results.loweralpha, 2);
        });

        it('should not match passwords having at least one character which is not a lower letter', function () {
            var results = { loweralpha: 0 };
            analyzer.analyze(' abcd', results);
            analyzer.analyze('abc1', results);
            analyzer.analyze('abcD', results);

            assert.equal(results.loweralpha, 0);
        });
    });

    describe('Password length analyzer', function () {
        var analyzer = new analyzers.PasswordLengthAnalyzer();

        it('should populate results with length for each password', function () {
            var results = {};

            analyzer.analyze('a', results);
            analyzer.analyze('abcd', results);
            analyzer.analyze('foobar', results);
            analyzer.analyze('x', results);

            assert.equal(results['1'], 2);
            assert.equal(results['4'], 1);
            assert.equal(results['6'], 1);
            assert(!results['2']);
        });

    });

});
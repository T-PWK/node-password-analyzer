var assert = require('assert');
var analyzers = require('../lib/analyzers');

describe('Analyzers', function () {
	
    describe('Months analyzer', function () {
        var analyzer = new analyzers['months'];

		it('should match passwords that are composed from month names only no matther the letter case', function () {
            var results = {}
            analyzer.analyze('january', results);
            analyzer.analyze('JANUARY', results);
            analyzer.analyze('January', results);
            analyzer.analyze('februarY', results);

            assert(results.january);
            assert(results.february);

            assert.equal(results.january, 3);
            assert.equal(results.february, 1);
		});

		it('should match entire line of text, not find a containing text', function () {
            var results = {}
            analyzer.analyze(' january', results);
            analyzer.analyze('JANUARY ', results);
            analyzer.analyze('January.', results);

            assert(!results.january);

            assert.equal(results.january || 0, 0);
		});
	});

    describe('Numeric analyzer', function () {
        var analyzer = new analyzers['numeric'];

        it('should match passwords that are composed from numbers only', function () {
            var results = {};

            analyzer.analyze('123312', results);
            analyzer.analyze('1234567890', results);
            analyzer.analyze('00000000', results);
            analyzer.analyze('1', results);

            assert.equal(results.numeric, 4);
        });

        it('should not match passwords having at least one character which is not a number', function () {
            var results = { numeric: 0 }
            analyzer.analyze(' 00001212', results);
            analyzer.analyze('123456 ', results);
            analyzer.analyze('123,234,233', results);

            assert.equal(results.numeric, 0);
        });
    });

    describe('Letters only analyzer', function () {
        var analyzer = new analyzers['lowerupperalpha'];

        it('should match passwords that are composed from lower and upper letters only', function () {
            var results = {};

            analyzer.analyze('abcd', results);
            analyzer.analyze('ABCD', results);
            analyzer.analyze('abCD', results);

            assert.equal(results.lowerupperalpha, 3);
        });

        it('should not match passwords having at least one character which is not a letter', function () {
            var results = { lowerupperalpha: 0 }
            analyzer.analyze(' abcd', results);
            analyzer.analyze('ABC1', results);

            assert.equal(results.lowerupperalpha, 0);
        });
    });

    describe('Upper letters only analyzer', function () {
        var analyzer = new analyzers['upperalpha'];

        it('should match passwords that are composed from upper letters only', function () {
            var results = {};

            analyzer.analyze('A', results);
            analyzer.analyze('ABCD', results);

            assert.equal(results.upperalpha, 2);
        });

        it('should not match passwords having at least one character which is not an upper letter', function () {
            var results = { upperalpha: 0 }
            analyzer.analyze(' abcd', results);
            analyzer.analyze('ABC1', results);
            analyzer.analyze('ABCd', results);

            assert.equal(results.upperalpha, 0);
        });
    });

    describe('Upper letters only analyzer', function () {
        var analyzer = new analyzers['loweralpha'];

        it('should match passwords that are composed from lower letters only', function () {
            var results = {};

            analyzer.analyze('a', results);
            analyzer.analyze('abcd', results);

            assert.equal(results.loweralpha, 2);
        });

        it('should not match passwords having at least one character which is not a lower letter', function () {
            var results = { loweralpha: 0 }
            analyzer.analyze(' abcd', results);
            analyzer.analyze('abc1', results);
            analyzer.analyze('abcD', results);

            assert.equal(results.loweralpha, 0);
        });
    });

});
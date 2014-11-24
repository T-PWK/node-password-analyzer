var assert = require('assert');
var analyzer = require('..');
var analyzers = require('../lib/analyzers');

var passwords = [
	'123456', 'abcdef'
];

describe("PasswordAnalyzer", function () {

	describe('addGroup', function () {
		var passwordAnalyzer;
		var expectedResults = {
			'Character sets': { total: 2, numeric: 1, loweralpha: 1, upperalpha: 0 },
			'Months': { total: 2 } 
		};

		// Verify if required analyzers are available
		before(function () {
			assert(analyzers.DigitsOnlyAnalyzer);
			assert(analyzers.LowerLettersOnlyAnalyzer);
			assert(analyzers.CapitalLettersOnlyAnalyzer);
		});

		// Build new PasswordAnalyzer before each test
		beforeEach(function () {
			passwordAnalyzer = new analyzer.PasswordAnalyzer();
		});

		// Perform password analysys and verify results for each test
		afterEach(function () {
			passwords.forEach(passwordAnalyzer.analyze.bind(passwordAnalyzer));
			assert.deepEqual(passwordAnalyzer.getResults(), expectedResults);
		});
		
		it('should setup groups with analyzers using analyzer short names (strings)', function () {
			passwordAnalyzer.addGroup('Character sets', ['numeric', 'loweralpha', 'upperalpha']);
			passwordAnalyzer.addGroup('Months', ['months']);
		});

		it('should setup groups with analyzers using analyzer constructors (functions)', function () {
			passwordAnalyzer.addGroup('Character sets', [
				analyzers.DigitsOnlyAnalyzer,
				analyzers.LowerLettersOnlyAnalyzer,
				analyzers.CapitalLettersOnlyAnalyzer
			]);
			passwordAnalyzer.addGroup('Months', [ analyzers.MonthsAnalyzer ]);
		});

		it('should setup groups with analyzers using analyzer instances (objects)', function () {
			passwordAnalyzer.addGroup('Character sets', [
				new analyzers.DigitsOnlyAnalyzer(),
				new analyzers.LowerLettersOnlyAnalyzer(),
				new analyzers.CapitalLettersOnlyAnalyzer()
			]);
			passwordAnalyzer.addGroup('Months', [new analyzers.MonthsAnalyzer()]);
		});

	});
});
var assert = require('assert');
var analyzer = require('..');
var analyzers = require('../lib/analyzers');

var passwords = [ '123456', 'abcdef', 'foobar', 'ABC', 'January' ];

describe("PasswordAnalyzer", function () {

	describe('addGroup', function () {

		it('should throw an execption if analyzer has not been provided', function () {
			var passwordAnalyzer = new analyzer.PasswordAnalyzer();
			
			assert.throws(function () {
				passwordAnalyzer.addGroup('Group name');
			});
		});

		it('should use existing group if a group with the same name has been added', function () {
			var passwordAnalyzer = new analyzer.PasswordAnalyzer();

			passwordAnalyzer.addGroup('Group', 'numeric');
			passwordAnalyzer.addGroup('Group', 'loweralpha');

			['123456', 'abcdef'].forEach(passwordAnalyzer.analyze.bind(passwordAnalyzer));

			var results = passwordAnalyzer.getResults();
			assert.deepEqual(results, {
				total: 2, groups: [
					{ 
						name: 'Group', 
						analyzers:[ { code: 'numeric', count: 1 }, { code: 'loweralpha', count: 1 } ]
					}
				]
			});
		});
	});

	describe('addGroup', function () {
		var passwordAnalyzer;
		var expectedResults = {
			total: 5,
			groups: [
				{ 
					name: 'Character sets', 
					analyzers:[
						{ code: 'numeric', count: 1 },
						{ code: 'loweralpha', count: 2 },
						{ code: 'upperalpha', count: 1 }
					]
				},
				{ 
					name: 'Months', 
					analyzers: [ { code: 'january', count: 1 } ]
				}
			]
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
var assert = require('assert');
var analyzer = require('..');

var passwords = [
	'123456', 'abcdef'
];

describe("PasswordAnalyzer", function () {
	describe('constructor', function () {

		it('should setup groups and analyzers from properties', function () {

			var passwordAnalyzer = new analyzer.PasswordAnalyzer({
				groups: [
					{ name: 'Character sets', analyzers: ['numeric', 'loweralpha', 'upperalpha'] },
					{ name: 'Months', analyzers: ['months'] }
				]
			});

			// Analyze passwords
			passwords.forEach(passwordAnalyzer.analyze.bind(passwordAnalyzer));

			assert.deepEqual(
				passwordAnalyzer.getResults(), 
				{ 
					'Character sets': { total: 2, numeric: 1, loweralpha: 1, upperalpha: 0 },
					Months: { total: 2 } 
				});
		});
	});

	describe('addGroup', function () {
		
		it('should setup groups with analyzers', function () {
			var passwordAnalyzer = new analyzer.PasswordAnalyzer();

			passwordAnalyzer.addGroup('Character sets', ['numeric', 'loweralpha', 'upperalpha']);
			passwordAnalyzer.addGroup('Months', ['months']);

			// Analyze passwords
			passwords.forEach(passwordAnalyzer.analyze.bind(passwordAnalyzer));

			assert.deepEqual(
				passwordAnalyzer.getResults(), 
				{ 
					'Character sets': { total: 2, numeric: 1, loweralpha: 1, upperalpha: 0 },
					Months: { total: 2 } 
				});
		});

	});
});
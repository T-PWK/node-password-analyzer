var assert = require('assert');
var analyzer = require('..');

var passwords = [
	'123456', 'abcdef'
]

describe("PasswordAnalyzer", function () {
	describe('constructor', function () {

		it('foo ...', function () {

			var passwordAnalyzer = new analyzer.PasswordAnalyzer({
				groups: [
					{ name: 'Character sets', analyzers: ['numeric', 'loweralpha', 'upperalpha'] },
					{ name: 'Months', analyzers: ['months'] }
				]
			});

			passwords.forEach(passwordAnalyzer.analyze.bind(passwordAnalyzer));

			console.log(passwordAnalyzer.getResults());
		});
		
		it('bar ...', function () {
			var passwordAnalyzer = new analyzer.PasswordAnalyzer();

			passwordAnalyzer.addGroup('Character sets', ['numeric', 'loweralpha', 'upperalpha']);
			passwordAnalyzer.addGroup('Months', ['months']);

			passwords.forEach(passwordAnalyzer.analyze.bind(passwordAnalyzer));
		});

	});
});
(function () {
	var assert = require('assert');
	var util = require('util');
	var analyzers = require('../lib/analyzers');

	describe('Analyzers', function () {

		describe('Analyzer (base class)', function() {
			it('should throw an exception if no code has been provided', function () {
				assert.throws(function () {
					new analyzers.Analyzer();
				}, /Missing code/ );
			});
		});
		
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
			it('should match passwords that are composed from numbers only', function () {
				verifyAnalyzer(new analyzers.NumericAnalyzer(), ['123312', '1234567890', '00000000', '1'], 4);
			});

			it('should not match passwords having at least one character which is not a number', function () {
				verifyAnalyzer(new analyzers.NumericAnalyzer(), [' 123312', '123456 ', '123,234,233'], 0);
			});
		});

		describe('MixedAlphaAnalyzer', function () {
			it('should match passwords that are composed from lower and upper letters only', function () {
				verifyAnalyzer(new analyzers.MixedAlphaAnalyzer(), ['abcd', 'ABCD', 'abCD', 'abCD1'], 1);
			});

			it('should not match passwords having at least one character which is not a letter', function () {
				verifyAnalyzer(new analyzers.MixedAlphaAnalyzer(), [' abcd', 'ABC1'], 0);
			});
		});

		describe('UpperAlphaAnalyzer', function () {
			it('should match passwords that are composed from upper letters only', function () {
				verifyAnalyzer(new analyzers.UpperAlphaAnalyzer(), ['A', 'ABCD'], 2);
			});

			it('should not match passwords having at least one character which is not an upper letter', function () {
				verifyAnalyzer(new analyzers.UpperAlphaAnalyzer(), ['abcd', 'ABC1', 'ABCd'], 0);
			});
		});

		describe('LowerAlphaAnalyzer', function () {
			it('should match passwords that are composed from lower letters only', function () {
				verifyAnalyzer(new analyzers.LowerAlphaAnalyzer(), ['a', 'abcd'], 2);
			});

			it('should not match passwords having at least one character which is not a lower letter', function () {
				verifyAnalyzer(new analyzers.LowerAlphaAnalyzer(), [' abcd', 'abc1', 'abcD'], 0);
			});
		});

		describe('MixedAlphaNumAnalyzer', function () {
			it('should match passwords with uppercase and lowercase letters and numbers only', function () {
				verifyAnalyzer(new analyzers.MixedAlphaNumAnalyzer(), ['abc', 'A1232B', 'A1232b', '3424', 'Abc2134'], 2);
			});
		});

		describe('UpperAlphaNumAnalyzer', function () {
			it('should match passwords with uppercase letters and numbers only', function () {
				verifyAnalyzer(new analyzers.UpperAlphaNumAnalyzer(), ['abc', 'A1232B', '3424', 'Abc2134'], 1);
			});
		});

		describe('LowerAlphaNumAnalyzer', function () {
			it('should match passwords with lowercase letters and numbers only', function () {
				verifyAnalyzer(new analyzers.LowerAlphaNumAnalyzer(), ['abcd', 'ab1232', '3424', 'Abc2134'], 1);
			});
		});

		describe('SpecialAnalyzer', function () {
			it('should match passwords with special letters only', function () {
				verifyAnalyzer(new analyzers.SpecialAnalyzer(), ['$%^', ' $"!', '!-=', '!as'], 3);
			});
		});

		describe('SpecialNumAnalyzer', function () {
			it('should match passwords with special and numeric characters only', function () {
				verifyAnalyzer(new analyzers.SpecialNumAnalyzer(), ['$%^', ' $"!', '!-=', '!123', '!asd'], 1);
			});
		});

		describe('LowerAlphaSpecialNumAnalyzer', function () {
			it('should match passwords composed of special and loweralpha characters and numbers only', function () {
				verifyAnalyzer(new analyzers.LowerAlphaSpecialNumAnalyzer(), 
					['asdf', '234', '$asdd', '!-=', '!123', '!asd1'], 1);
			});
		});

		describe('LowerAlphaSpecialNumAnalyzer', function () {
			it('should match passwords composed of special and loweralpha characters and numbers only', function () {
				verifyAnalyzer(new analyzers.LowerAlphaSpecialNumAnalyzer(), 
					['asdf', '234', '$asdd', '!-=', '!123', '!asd1', '!Asd1'], 1);
			});
		});

		describe('MixedAlphaSpecialAnalyzer', function () {
			it('should match passwords composed of special and loweralpha characters and numbers only', function () {
				verifyAnalyzer(new analyzers.MixedAlphaSpecialAnalyzer(), 
					['asdf', 'ABC', '$asdd', '!-=', '!ABC', '!asd1', '!Asd1', '!Asd'], 1);
			});
		});

		describe('UpperAlphaSpecialNumAnalyzer', function () {
			it('should match passwords composed of special and loweralpha characters and numbers only', function () {
				verifyAnalyzer(new analyzers.UpperAlphaSpecialNumAnalyzer(), 
					['asdf', 'ABC', '$asdd', '!-=', '!ABC', '!asd1', '!Asd1', '!ASD1','!Asd'], 1);
			});
		});

		describe('LowerAlphaSpecialAnalyzer', function () {
			it('should match passwords composed of loweralpha and special characters only', function () {
				verifyAnalyzer(new analyzers.LowerAlphaSpecialAnalyzer(), 
					['asdf', 'ABC', '$asdd', '!-=', '!ABC', '!asd1', '!Asd1', '!ASD1','!Asd'], 1);
			});
		});

		describe('UpperAlphaSpecialAnalyzer', function () {
			it('should match passwords composed of special and upperalpha and special characters only', function () {
				verifyAnalyzer(new analyzers.UpperAlphaSpecialAnalyzer(), 
					['asdf', 'ABC', '$asdd', '!-=', '!ABC', '!asd1', '!Asd1', '!ASD1','!Asd'], 1);
			});
		});

		describe('AllCharsAnalyzer', function () {
			it('should match passwords composed of all character types (lower, upper, special and number)', function () {
				verifyAnalyzer(new analyzers.AllCharsAnalyzer(), 
					['asdf', 'ABC', '$asdd', '!-=', '!ABC', '!asd1', '!Asd1', '!ASD1','!Asd'], 1);
			});
		});

		describe('PasswordLengthAnalyzer', function () {
			it('should populate results with length for each password', function () {
				var analyzer = new analyzers.PasswordLengthAnalyzer();

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

				it("should analyze passwords composed of several '?l' tokens only", function () {
					verifyAnalyzer(new analyzers.MaskAnalyzer('?l?l?l?l'), ['abcd', 'abcde', 'abcde', 'Abcd'], 1);
				});

				it("should analyze passwords composed of letters and '?l' token only", function () {
					verifyAnalyzer(new analyzers.MaskAnalyzer('Password?l'), ['abcd', 'Password1', 'Password', 'Passworda'], 1);
				});

				it("should analyze passwords composed of several '?u' tokens only", function () {
					verifyAnalyzer(new analyzers.MaskAnalyzer('?u?u?u?u'), ['ABCD', 'ABCDE', 'Abcd'], 1);
				});

				it("should analyze passwords composed of letters and '?u' token only", function () {
					verifyAnalyzer(new analyzers.MaskAnalyzer('Password?u'), ['Password', 'Passworda', 'PasswordA'], 1);
				});

				it("should analyze passwords composed of several '?d' tokens only", function () {
					verifyAnalyzer(new analyzers.MaskAnalyzer('?d?d?d?d'), ['1234', '12345', '1234a'], 1);
				});

				it("should analyze passwords with mask composed of letters and a '?d' token only", function () {
					verifyAnalyzer(new analyzers.MaskAnalyzer('Password?d'), ['Password1','Password0','Password2','password2'], 3);
				});

				it("should analyze passwords composed of several '?s' tokens only", function () {
					verifyAnalyzer(new analyzers.MaskAnalyzer('?s?s?s?s'), ['**{}', ' *[]', ' *[!', ' !`@', '**{}*', '**{}a'], 4);
				});

				it("should analyze passwords composed of letters and a '?s' token only", function () {
					verifyAnalyzer(new analyzers.MaskAnalyzer('Password?s'), ['Password1','PasswordA','Password.','password!'], 1);
				});

				it("should analyze passwords composed of several '?a' tokens only", function () {
					verifyAnalyzer(new analyzers.MaskAnalyzer('?a?a?a?a'), ['Pas!','Pa*2','1234','abcd','ABCD','*{} '], 6);
				});

				it("should analyze passwords composed of letters and a '?a' tokens only", function () {
					verifyAnalyzer(new analyzers.MaskAnalyzer('Password?a'), ['Password1','PasswordA','Password.','password!'], 3);
				});
			});
		});
	});

	function findItemByCode (results, code) {
		return results.filter(function (result) {
			return result.code == code;
		})[0];
	}

	function verifyAnalyzer (analyzer, passwords, count, args) {
		passwords.forEach(analyzer.analyze.bind(analyzer));

		var results = analyzer.getResults();

		assert.equal(results.length, 1);
		assert.equal(results[0].code, analyzer.code);
		assert.equal(results[0].count, count);					
	}

}());
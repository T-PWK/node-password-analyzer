[![Build Status](https://travis-ci.org/T-PWK/node-password-analyzer.svg?branch=master)](https://travis-ci.org/T-PWK/node-password-analyzer) 
[![npm version](https://badge.fury.io/js/password-analyzer.svg)](http://badge.fury.io/js/password-analyzer) 
[![Code Climate](https://codeclimate.com/github/T-PWK/node-password-analyzer/badges/gpa.svg)](https://codeclimate.com/github/T-PWK/node-password-analyzer) 
[![Test Coverage](https://codeclimate.com/github/T-PWK/node-password-analyzer/badges/coverage.svg)](https://codeclimate.com/github/T-PWK/node-password-analyzer)

Password Analyzer
======================

**Passwords Analyzer** is an API developed to aid in analysis of password lists. 

It allows to analyze existing passwords and based on the analysis system password requirements can be changed (say, increase minimum password length or password complexity by requiring special characters) in order to improve system security.

## Usage ##

```js
var analyzer = require('password-analyzer');
var passwordAnalyzer = new analyzer.PasswordAnalyzer();

// Setup groups and analyzers for each group
passwordAnalyzer.addGroup('Character sets', ['numeric', 'loweralpha', 'upperalpha']);
passwordAnalyzer.addGroup('Months', ['months']);

// Sample passwords
var passwords = [ '123456', 'abcdef', 'foobar', 'ABC', 'January' ];
passwords.forEach(passwordAnalyzer.analyze.bind(passwordAnalyzer));

// returns object with results of passwords analysis
passwordAnalyzer.getResults();
```

The `addGroup` function accepts two parameters:
- a string specifying a group name - that name will appear in an analysis results object
- an array or a single analyzer which can be:
	- a string representing a pre-defined analyzer code (you can find analyzer codes below)
	- an analyzer constructor (function) - a new analyzer will be instantiated using the given constructor
	- an analyzer instance

Example of password analysis results:

```js
{
	total: 5, // total number of anlyzed passwords
	groups: [ // All analysis groups
	{
		// Group name
		name: 'Character sets', 

		// Analyzers for the given group
		analyzers:[
			// Analyzer code (id) and number of passwords matching rules of the given analyzer
			{ code: 'numeric', count: 1 },
			{ code: 'loweralpha', count: 2 },
			{ code: 'upperalpha', count: 1 }
		]
	}, { 
		name: 'Months', 
		analyzers: [ { code: 'january', count: 1 } ]
	}
]};
```

### Available Analyzers ###

- `AllCharsAnalyzer` - (code: `all`) 
- `Analyzer` - base analyzer - it is can be extended to create other more specialized analyzers
- `LowerAlphaAnalyzer` -  (code: `loweralpha`) checks if a password is composed of lowercase letters only
- `LowerAlphaNumAnalyzer` - (code `loweralphanum`) checks if a password is composed of lowercase letters and numbers only
- `LowerAlphaSpecialAnalyzer` - (code `loweralphaspecial`) checks if a password is composed of lowercase and special characters only
- `LowerAlphaSpecialNumAnalyzer` - (code `loweralphaspecialnum`) checks if a password is composed of: lowercase, special and numbers only
- `MaskAnalyzer` - checks if a passwords is matched by a specific mask (see details below)
- `MixedAlphaAnalyzer` - (code: `mixedalpha`) checks if a password is composed of letters only
- `MixedAlphaNumAnalyzer` - (code `mixedalphanum`) checks if a password is composed of upper and lowercase letters only
- `MixedAlphaSpecialAnalyzer` - (code `mixedalphaspecial`) checks if a password is composed of: uppercase, lowercase and special characters only
- `MonthsAnalyzer` - (code: `months`) checks if a password is composed of English month names (case insensitive) only
- `NumericAnalyzer` - (code: `numeric`) checks if a password is composed of digits only
- `PasswordLengthAnalyzer` - (code: `length`) performs password length analysis
- `RegexAnalyzer` - regular expression analyzer - perform password analysis based on configured regular expressions (password matching)
- `SpecialAnalyzer` - (code: `special`) checks if a password is composed of special characters only
- `SpecialNumAnalyzer` - (code: `specialnum`) checks if a password is composed of digits and special characters only
- `UpperAlphaAnalyzer` - (code: `upperalpha`) checks if a password is composed of capital letters only 
- `UpperAlphaNumAnalyzer` - (code: `upperalphanum`) checks if a password is composed of capital letters and digits only 
- `UpperAlphaSpecialAnalyzer` - (code: `upperalphaspecial`) checks if a password is composed of capital letters and special characters only 
- `UpperAlphaSpecialNumAnalyzer` - (code: `upperalphaspecialnum`) checks if a password is composed of: capital letters, special characters and digits only 

#### MaskAnalyzer ####
Mask analyzer checks if a password is matched by a specific mask. The matching mask can be composed of letters and some masks as follows:
- `?l` - matches a single lowercase character
- `?u` - matches a single uppercase character
- `?d` - matches a single digit
- `?s` - matches a single special character i.e. one of: `!"#$%&'()*+,-./:;<=>?@[\]^_``{|}~«space»`
- `?a` - matches any single characters i.e. `?l` or `?u` or `?d` or `?s`

So a password like this _foo123_ would be matched by the following mask: `?l?l?l?d?d?d`.

## Author ##
Written by Tom Pawlak - [Blog](https://blog.abelotech.com)

## License ##

Copyright (c) 2014 Tom Pawlak

MIT License : https://blog.abelotech.com/mit-license/

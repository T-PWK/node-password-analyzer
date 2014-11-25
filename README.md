[![Build Status](https://travis-ci.org/T-PWK/node-password-analyzer.svg?branch=master)](https://travis-ci.org/T-PWK/node-password-analyzer) [![npm version](https://badge.fury.io/js/node-password-analyzer.svg)](http://badge.fury.io/js/node-password-analyzer) [![Dependency Status](https://gemnasium.com/T-PWK/node-password-analyzer.svg)](https://gemnasium.com/T-PWK/node-password-analyzer) [![Code Climate](https://codeclimate.com/github/T-PWK/node-password-analyzer/badges/gpa.svg)](https://codeclimate.com/github/T-PWK/node-password-analyzer) [![Test Coverage](https://codeclimate.com/github/T-PWK/node-password-analyzer/badges/coverage.svg)](https://codeclimate.com/github/T-PWK/node-password-analyzer)

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

passwordAnalyzer.getResults(); // returns object with results of passwords analysis
```

The `addGroup` function accepts two parameters:
- a string specifying a group name - that name will appear in an analysis results object
- an array or a single analyzer which can be:
	- a string representing a pre-defined analyzer code (you can find analyzer codes below)
	- an analyzer constructor (function) - a new analyzer will be instancieted using the given constructor
	- an analyzer instance

Example of password analysis results:

```js
{
	total: 5, // total number of anlyzed passwords
	groups: [ // All analysis groups
	{
		name: 'Character sets', // Group name
		analyzers:[             // Analyzers for the given group
			{ code: 'numeric', count: 1 },	// Analyzer code (id) and number of passwords
											// matching rules of the given analyzer
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

- `Analyzer` - base analyzer - it is can be extended to create other more specialized analyzers
- `RegexAnalyzer` - regular expression analyzer - perform password analysis based on configured regular expressions (password matching) 
- `MaskAnalyzer` - checks if a passwords is matched by a specific mask (see details below)
- `DigitsOnlyAnalyzer` - (code: `numeric`) checks if a password is composed from digits only
- `LettersOnlyAnalyzer` - (code: `lowerupperalpha`) checks if a password is composed from letters only
- `CapitalLettersOnlyAnalyzer` - (code: `upperalpha`) checks if a password is composed from capital letters only 
- `LowerLettersOnlyAnalyzer` -  (code: `loweralpha`) checks if a password is composed from lowercase letters only
- `MonthsAnalyzer` - (code: `months`) checks if a password is composed from English month names (case insensetive) only
- `PasswordLengthAnalyzer` - (code: `length`) performs password length analysis

#### MaskAnalyzer ####
Mask analyzer checks if a password is matched by a specific mask. The matching mask can be composed from elements as follows:
- `?l` - matches a single lowercase character
- `?u` - matches a single uppercase character
- `?d` - matches a single digit
- `?s` - matches a single special character i.e. one of:

``` 
!\"#$%&'()*+,-./:;<=>?@[\\]^\_`{|}~
```
and a _space character_.

So a password like this _foo123_ would be matched by the following mask: `?l?l?l?d?d?d`.

## Author ##
Writen by Tom Pawlak - [Blog](http://blog.tompawlak.org)

## License ##

Copyright (c) 2014 Tom Pawlak

MIT License : http://blog.tompawlak.org/mit-license

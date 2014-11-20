var util = require('util');
var analyzers = require('./lib/analyzers');
var Group = require('./lib/group');

var test = ['123456', 'foobar', 'xyz', 'FOOBAR', 'FooBar34'];

function analyze (passwords) {

	var analyzer = new PasswordAnalyzer();
	analyzer.addGroup('foo bar 1', analyzers.DigitsOnlyAnalyzer);
	analyzer.addGroup('foo bar 2', 'numeric');

	passwords.forEach(function (passwd) {
		analyzer.analyze(passwd);
	});

	console.log(util.inspect(analyzer, {depth: 5, colors: true}));
}

function PasswordAnalyzer (options) {
	options = options || {};
	this._groups = [];
}

PasswordAnalyzer.prototype.addGroup = function (name, analyzersOrFn) {
	if (!analyzersOrFn) { 
		throw new Error('Analyzers are required');
	}
	var group;

	for (var i = this._groups.length - 1; i >= 0; i--) {
		if(this._groups[i].name === name) {
			group = this._groups[i];
			break;
		}
	};

	if(!group) {
		group = new Group(name);
		this._groups.push(group);
	}

	if(util.isArray(analyzersOrFn)) {
		analyzersOrFn.forEach(group.addAnalyzer.bind(group));
	}
	else {
		group.addAnalyzer(analyzersOrFn);
	}
};

PasswordAnalyzer.prototype.analyze = function (password) {
	this._groups.forEach(function (group) {
		group.analyze(password);
	});
};

analyze(test);
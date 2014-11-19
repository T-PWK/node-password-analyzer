var util = require('util');
var analyzers = require('./lib/analyzers');
var test = ['123456', 'foobar', 'xyz', 'FOOBAR', 'FooBar34'];

function analyze (passwords) {

	var g = new Group();
	console.log(g)

	g.addAnalyzer(new analyzers.DigitsOnlyAnalyzer());
	g.addAnalyzer(new analyzers.LettersOnlyAnalyzer());
	g.addAnalyzer(new analyzers.CapitalLettersOnlyAnalyzer());
	g.addAnalyzer(new analyzers.LowerLettersOnlyAnalyzer());

	passwords.forEach(function (passwd) {
		g.analyze(passwd);
	});

	console.log(g);
	console.log('=========================')

}

function Group (name, analyzers) {
	this.name = name || '[group]';
	this._results = { total: 0 };
	this._analyzers = [];

	if(util.isArray(analyzers)) {
		this._analyzers = this._analyzers.concat(analyzers);
	} else if(analyzers != null) {
		this.analyzers.push(analyzers);
	}

	this._analyzers.forEach(function (analyzer) {
		this._results[analyzer.code] = 0;
	}, this);
}

Group.prototype.addAnalyzer = function (analyzer) {
	this._analyzers.push(analyzer);
	this._results[analyzer.code] = 0;
};

Group.prototype.analyze = function (password) {
	this._results.total++;
	this._analyzers.forEach(function (analyzer) {
		if(analyzer.analyze(password)) {
			this._results[analyzer.code]++;
		}
	}, this);
};

analyze(test);
var util = require('util');
var analyzers = require('./analyzers');

function Group (name, analyzers) {
	this.name = name || '[group]';
	this._results = { total: 0 };
	this._analyzers = [];

	if(util.isArray(analyzers)) {
		this._analyzers = this._analyzers.concat(analyzers);
	} else if(analyzers) {
		this.analyzers.push(analyzers);
	}
}

Group.prototype.addAnalyzer = function (analyzer) {
	if(util.isFunction(analyzer)) {
		this._analyzers.push(new analyzer);
	}
	else if(typeof analyzer === 'string') {
		this._analyzers.push(new analyzers[analyzer]);
	}
	else {
		this._analyzers.push(analyzer);
	}
};

Group.prototype.analyze = function (password) {
	this._results.total++;
	this._analyzers.forEach(function (analyzer) {
		analyzer.analyze(password, this._results);
	}, this);
};

module.exports = Group;
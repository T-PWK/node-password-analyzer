(function () {
	'use strict';
	
	var util = require('util');
	var analyzers = require('./lib/analyzers');

	function PasswordAnalyzer (options) {
		options = options || {};
		this._groups = [];

		if(options.groups) {
			options.groups.forEach(function (group) {
				this.addGroup(group.name, group.analyzers);
			}, this);
		}
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
		}

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

	PasswordAnalyzer.prototype.getResults = function() {
		return this._groups.reduce(function (memo, group) {
			memo[group.name] = group.getResults();
			return memo;
		}, {});
	};

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
			this._analyzers.push(new analyzer());
		}
		else if(typeof analyzer === 'string') {
			this._analyzers.push(new analyzers[analyzer]());
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

	Group.prototype.getResults = function() {
		return this._results;
	};

	module.exports = {
		PasswordAnalyzer: PasswordAnalyzer,
		analyzers: analyzers
	};
}());


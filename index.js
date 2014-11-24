(function () {
	'use strict';
	
	var isArray = require('util').isArray;
	var analyzers = require('./lib/analyzers');

	var analyzersMapping = {
		numeric: 			analyzers.DigitsOnlyAnalyzer,
		lowerupperalpha: 	analyzers.LettersOnlyAnalyzer,
		upperalpha: 		analyzers.CapitalLettersOnlyAnalyzer,
		loweralpha: 		analyzers.LowerLettersOnlyAnalyzer,
		months: 			analyzers.MonthsAnalyzer,
		bylength: 			analyzers.PasswordLengthAnalyzer
	};

	function PasswordAnalyzer (options) {
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
		}

		if(!group) {
			group = new Group(name);
			this._groups.push(group);
		}

		if(isArray(analyzersOrFn)) {
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

		if(isArray(analyzers)) {
			this._analyzers = this._analyzers.concat(analyzers);
		} else if(analyzers) {
			this.analyzers.push(analyzers);
		}
	}

	Group.prototype.addAnalyzer = function (analyzer) {
		if(isFunction(analyzer)) {
			this._analyzers.push(new analyzer());
		}
		else if(typeof analyzer === 'string') {
			this._analyzers.push(new analyzersMapping[analyzer]());
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

	function isFunction(object) {
		return !!(object && object.constructor && object.call && object.apply);
	}
}());


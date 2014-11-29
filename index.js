(function () {
	'use strict';
	
	var isArray = require('util').isArray;
	var analyzers = require('./lib/analyzers');

	var analyzersMapping = {
		numeric:				analyzers.NumericAnalyzer,
		mixedalpha:				analyzers.MixedAlphaAnalyzer,
		upperalpha:				analyzers.UpperAlphaAnalyzer,
		loweralpha:				analyzers.LowerAlphaAnalyzer,
		loweralphanum:			analyzers.LowerAlphaNumAnalyzer,
		mixedalphanum:			analyzers.MixedAlphaNumAnalyzer,
		upperalphanum:			analyzers.UpperAlphaNumAnalyzer,
		special:				analyzers.SpecialAnalyzer,
		specialnum:				analyzers.SpecialNumAnalyzer,
		months:					analyzers.MonthsAnalyzer,
		bylength:				analyzers.PasswordLengthAnalyzer,
		loweralphaspecialnum: 	analyzers.LowerAlphaSpecialNumAnalyzer,
		mixedalphaspecial: 		analyzers.MixedAlphaSpecialAnalyzer,
		upperalphaspecialnum: 	analyzers.UpperAlphaSpecialNumAnalyzer,
		loweralphaspecial: 		analyzers.LowerAlphaSpecialAnalyzer,
		upperalphaspecial: 		analyzers.UpperAlphaSpecialAnalyzer,
		all: 					analyzers.AllCharsAnalyzer
	};

	function PasswordAnalyzer () {
		this._groups = [];
		this._total = 0;
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
		this._total++;
		this._groups.forEach(function (group) {
			group.analyze(password);
		});
	};

	PasswordAnalyzer.prototype.getResults = function() {
		var results = { total: this._total, groups: [] };

		return this._groups.reduce(function (results, group) {
			results.groups.push(group.getResults());
			return results;
		}, results);
	};

	function Group (name, analyzers) {
		this.name = name || '[group]';
		this._results = {};
		this._analyzers = [];

		if(isArray(analyzers)) {
			this._analyzers = this._analyzers.concat(analyzers);
		} else if(analyzers) {
			this.analyzers.push(analyzers);
		}
	}

	Group.prototype.addAnalyzer = function (analyzer) {
		if(isFunction(analyzer)) {
			/*jshint -W055 */
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
		var results = { name: this.name, analyzers:[] };

		this._analyzers.reduce(function (results, analyzer) {
			Array.prototype.push.apply(results, analyzer.getResults());
			return results;
		}, results.analyzers);

		return results;
	};

	module.exports = {
		PasswordAnalyzer: PasswordAnalyzer,
		analyzers: analyzers
	};

	function isFunction(object) {
		return !!(object && object.constructor && object.call && object.apply);
	}
}());

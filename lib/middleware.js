"use strict";

var fuse = require('fuse'),
	url = require('url'),
	path = require('path'),
	sep = path.sep,
	debug = require('debug')('connect-fuse:middleware'),
	fs = require('fs');

module.exports = function (options) {

	options = options || {};

	// accept {src:,dest:}, otherwise it must be an array
	if (options instanceof Object && options.src && options.dest) {
		options = {
			files: [options]
		};
	} else if (Array.isArray(options)) {
		options = {
			files: options
		};
	}

	// require files to compile
	if (!options.files || !Array.isArray(options.files)) {
		throw new Error('connect-fuse requires an array of files to compile');
	}

	// default compile (can be overridden to change values as required)
	options.compile = options.compile || function (input, output, callback) {
		fuse.fuseFile(input, output, callback);
	};

	return function fuser(req, res, next) {

		if (req.method !== 'GET' && req.method !== 'HEAD') {
			return next();
		}

		var pathname = url.parse(req.url).pathname,
			toCompile = [];

		if (!/\.(js|html)$/.test(pathname)) {
			return next();
		}

		// Ignore ENOENT to fall through as 404
		function error(err) {
			next(err.code === 'ENOENT' ? null : err);
		}

		// loop through each 'inputFile'
		options.files.forEach(function (o) {

			var overlap = compareEnd(o.dest, pathname);
			var regex = '^' + pathname + '$';
			var relativePath;

			if (overlap.charAt(0) !== '/') {
				overlap = '/' + overlap;
			}

			function compile() {
				
				debug('render %s', overlap);

				options.compile(o.src, o.dest, function (err, results) {

					if (err) {
						return error(err);
					}

					debug('rendered %s', overlap);

					return next();

				});

			}

			if (overlap.length && new RegExp(regex).test(overlap)) {

				// save state
				toCompile.push(o);

				// compile the file
				compile();

			}

		});

		// if we don't have anything to compile, let's move on
		if (toCompile.length === 0) {
			next();
		}

	};

};

function compareEnd(pathA, pathB) {

	var overlap = [];

	pathA = pathA.split(sep);
	pathB = pathB.split(sep);

	while (pathA[pathA.length - 1] === pathB[pathB.length - 1]) {
		overlap.push(pathA.pop());
		pathB.pop();

	}

	return overlap.reverse().join(sep);
	
}
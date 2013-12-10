# connect-fuse

> connect-fuse is a connect middlware wrapper around [Fuse](http://github.com/smebberson/fuse). [Fuse](http://github.com/smebberson/fuse) is a tool to fuse multiple JavaScript or HTML files into one.

## Installation

To use fuse within Express, you must install fuse-connect. fuse-connect is a connect middlware wrapper for Fuse.

	[sudo] npm install fuse-connect --save

## Usage

Fuse uses inline comment-based directives to determine which files you'd like to fuse. You can use `@depends`, `@import` or `@include` as the directive.

For usage guidelines, see the [Fuse readme](http://github.com/smebberson/fuse).

### With express

Make sure you've installed fuse-connect. You can then include fuse-connect to bind requests to particular files to fuse, so that they're automatically updated upon request.

	var fuse = require('fuse-connect');
	var filesToFuse = [
		{src: '/path/to/src-file.js', dest: '/path/to/dest-file.js'},
		{src: '/path/to/src-file.html', dest: '/path/to/dest-file.html'}
	];

	// add fuse-connect to the middleware
	app.use(fuse.middleware(filesToFuse));


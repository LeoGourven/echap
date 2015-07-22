require('babel-core/polyfill');
const path = require('path');
const fs = require('fs');
const del = require('del');
const uglify = require("uglify-js");
const ncp = require('ncp').ncp;
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
ncp.limit = 16;
const modulesPath = path.resolve(__dirname, "modules");
const buildPath = path.resolve(__dirname, 'build');
const distPath = path.resolve(__dirname, 'dist');
const config = require('./webpack.config.js').setPath(distPath);
const sassLoader = config.module.loaders.find(function(d){ return d.test.toString().indexOf("sass") > -1 });
sassLoader.loader = ExtractTextPlugin.extract("style-loader", [
  "css-loader",
  "sass-loader?sourceMap&indentedSyntax&includePaths[]=" + modulesPath,
].join("!"))
const START = Date.now();
config.plugins.push(new ExtractTextPlugin("styles.css"));
config.plugins.push(new webpack.optimize.UglifyJsPlugin());
config.plugins.push(new webpack.optimize.DedupePlugin());
config.plugins.push(new webpack.optimize.OccurenceOrderPlugin());
del([distPath], function (err, paths) {
	console.log('Deleting \t', paths.join('\n'));
	fs.mkdirSync(distPath);
	ncp(buildPath, distPath, function (err) {
		if (err) return console.error(err);
		console.log('Coping \t\t', buildPath, '->', distPath)
		webpack(config).run(function(err, stats) {
			console.log('Compiling \t', distPath, "\n");
			console.log('Total \t\t', Date.now()-START, "ms");
		});
	});
});

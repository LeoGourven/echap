const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require("path");
const appScripts = [path.resolve(__dirname, "src", "app.js")];
const modulesPath = path.resolve(__dirname, "src");
const buildPath = path.resolve(__dirname, "build");
const hotScripts = [
  'webpack-dev-server/client?http://0.0.0.0:8080',
  'webpack/hot/only-dev-server'
];
const getconfig = function(exportPath) {

  if (!exportPath) exportPath = buildPath;

  return {
    devtool: "eval",
    hotScripts: hotScripts,
    cache: true,
    watch: false,
    entry: {
      "bundle":  appScripts
    },
    output: {
      path : exportPath,
      filename: 'scripts/[name].js', 
      publicPath: '/',
    },
    resolve : {
      extensions: ['', '.js', '.sass'],
      alias : {}
    },
    module: { 
      loaders: [
        { test: /\.css$/, loader: "style-loader!css-loader" },
        { test: /\.png$/, loader: "url-loader?limit=100000" },
        { test: /\.jpg$/, loader: "url-loader" },
        { test: /\.ttf$/, loader: "url-loader" },
        {
          test: /\.(js)$/,
          exclude: /node_modules/,
          loaders: ["babel-loader"],
        },
        {
          test: /\.sass$/,
          loader: [
            "style-loader",
            "css-loader",
            "sass-loader?sourceMap&indentedSyntax&includePaths[]=" + modulesPath,
          ].join("!"),
        },
      ] 
    },

    plugins: [ 
      new webpack.optimize.CommonsChunkPlugin("scripts/init.js"),
      new HtmlWebpackPlugin({
        template: path.resolve(buildPath, 'index.html'),
        inject: 'body'
      })
    ]
  }
};
const config = getconfig();
config.setPath = getconfig;
module.exports = config;

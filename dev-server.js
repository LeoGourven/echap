require("babel-core/polyfill");

const path = require("path");
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const buildPath = path.resolve(__dirname, "build");
const serverPort = 8080;

// get build config for webpack
const config = require('./webpack.config.js');

// affect dev-server parameters
Object.assign(config, {
  // enable file watching
  watch: true,
  // add HMR plugin for hot-loading
  plugins: config.plugins.concat([new webpack.HotModuleReplacementPlugin()]),
  // add HMR needed scripts
  entry: {
    "bundle" : config.entry["bundle"].concat(config.hotScripts)
  }
});

// dev-server config
const devConfig = {
  // public path for files serving
  publicPath: config.output.publicPath,
  // enable HMR
  hot: false,
  // no-hashbang-navigation ready
  historyApiFallback: true,
  // content base for server
  contentBase: buildPath,
  // It suppress everything except error, so it has to be set to false as well
  // to see success build.
  stats: {
    // Config for minimal console.log mess.
    assets: false,
    colors: true,
    version: false,
    hash: false,
    timings: true,
    chunks: false,
    chunkModules: false
  }
};

// start dev-server based on webpack with the config
new WebpackDevServer(webpack(config), devConfig)
    .listen(serverPort, 'localhost', function (err, result) {
        if (err) console.log(err);

        console.log('   Listening at localhost:'+serverPort);
    });

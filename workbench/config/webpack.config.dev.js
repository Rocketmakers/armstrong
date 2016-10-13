/*********************************************
    WEBPACK - DEVELOPMENT COMPILER CONFIG
**********************************************/

var webpack = require('webpack');
var path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var APP_DIR = path.join(__dirname, '../app');
var buildPath = path.join(__dirname, '../www');
var tsConfigPath = path.resolve('./app/tsconfig.json');

console.log(tsConfigPath);

var scssLoaders = [
  "style-loader",
  "css-loader?sourceMap",
  "autoprefixer-loader?browsers=last 4 version",
  "resolve-url-loader",
  "sass-loader?sourceMap&indentedSyntax=false&includePaths[]=" + APP_DIR,
];

module.exports = {
  debug: true,
  devtool: 'eval',
  resolve: {
    extensions: ["", ".ts", ".tsx", ".webpack.js", ".web.js", ".js", ".sass", ".scss"],
  },
  entry: [
    './app/index.tsx'
  ],
  module: {
    loaders: [
      { test: /\.ts(x)?$/, loaders: ["ts-loader?tsconfig=" + tsConfigPath] },
      { test: /\.scss$/, loaders: scssLoaders },
      { test: /\.(ttf|eot|svg|woff2?)(\?[a-z0-9]+)?$/, loader: 'url-loader' },
      { test: /\.(png|jpeg|jpg|gif)$/, loader: 'url-loader?limit=1000' }
    ]
  },
  output: {
    filename: 'app.js',
    path: buildPath,
    publicPath: 'http://localhost:3010/'
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: path.resolve('./dev.html'), to: 'index.html' }
    ])
  ]
};

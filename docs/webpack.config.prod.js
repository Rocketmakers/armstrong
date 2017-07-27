var fs = require("fs");
var path = require('path');

var CopyWebpackPlugin = require('copy-webpack-plugin');

var srcPath = path.resolve('./source');
var outPath = path.resolve('./www');

var tsConfigPath = path.join(srcPath, 'tsconfig.json');
var entryFilePath = path.join(srcPath, 'app.tsx');
var buildPath = path.join(__dirname);

var styleLoaders = [
  "style-loader",
  "css-loader?sourceMap",
  "sass-loader?sourceMap&indentedSyntax=false&includePaths[]=" + srcPath,
];

var options = {
  resolve: {
    extensions: [ "", ".ts", ".tsx", ".webpack.js", ".web.js", ".js", ".sass", ".scss" ],
  },
  entry: [
    './app/app.tsx'
  ],
  output: {
    filename: "app.js",
    path: buildPath,
  },
  module: {
    loaders: [
      { test: /\.ts(x)?$/, loaders: ["ts-loader?tsconfig=" + tsConfigPath] },
      { test: /\.(s?)css$/, loaders: styleLoaders },
      { test: /\.(png|jpg|jpeg|ttf|eot|svg|woff2?)(\?[a-z0-9]+)?$/, loader: 'url-loader' }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: path.join(srcPath, 'prod.html'), to: 'index.html' },
      { from: path.join(srcPath, 'assets/libraries') }
    ])
  ]
}

module.exports = options;
/*************************************************
    WEBPACK - DEVELOPMENT COMPILER CONFIG - WEB
**************************************************/

var webpack = require('webpack');
var path = require('path');

var APP_DIR = path.join(__dirname, '../source');
var buildPath = path.join(__dirname, '../www');
var tsConfigPath = path.join(__dirname, '../tsconfig.json');

var scssLoaders = [
  "style-loader",
  "css-loader?sourceMap",
  "autoprefixer-loader?browsers=last 2 version",
  "sass-loader?indentedSyntax=false&includePaths[]=" + APP_DIR,
];

module.exports = {
  devtool: 'eval',
  resolve: {
    extensions: ["", ".ts", ".tsx", ".webpack.js", ".web.js", ".js", ".sass", ".scss"],
  },
  entry: [
    './source/index.tsx'
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
    publicPath: 'http://localhost:3000/'
  }
};

/*********************************************
    WEBPACK - DEVELOPMENT COMPILER CONFIG
**********************************************/

var webpack = require('webpack');
var path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var APP_DIR = path.join(__dirname, '../app');
var buildPath = path.join(__dirname, '../www');
var tsConfigPath = path.resolve('./app/tsconfig.json');

var scssLoaders = [
  "style-loader",
  "css-loader?sourceMap",
  "autoprefixer-loader?browsers=last 4 version",
  "resolve-url-loader",
  "sass-loader?sourceMap&indentedSyntax=false&includePaths[]=" + APP_DIR,
];

module.exports = {
  devtool: 'eval',
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".scss"]
  },
  entry: {
    app: "./app/index.tsx",
    vendor: ["react", "underscore", "moment", "armstrong-react", "react-dom", "react-router", "classnames"]
  },
  module: {
    rules: [
      { test: /\.ts(x)?$/, loader: "ts-loader", options: { tsconfig: tsConfigPath, transpileOnly: true } },
      { test: /\.scss$/, loader: ExtractTextPlugin.extract({ fallback: "style-loader", use: "css-loader!sass-loader" }) },
      { test: /\.(ttf|eot|svg|woff2?)(\?[a-z0-9]+)?$/, loader: 'url-loader?limit=1000' },
      { test: /\.(png|jpeg|jpg|gif)$/, loader: 'url-loader?limit=1000' }
    ]
  },
  output: {
    filename: 'bundle.js',
    path: buildPath,
    publicPath: 'http://localhost:3010/'
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: path.resolve('./dev.html'), to: 'index.html' }
    ]),
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor",
      filename: "vendor.bundle.js",
      minChunks: Infinity
    }),

    new ExtractTextPlugin("styles.css")
  ],
};

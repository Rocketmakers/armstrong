const path = require("path");
const webpack = require("webpack");

const CopyWebpackPlugin = require('copy-webpack-plugin');
var MiniCssExtractPlugin = require("mini-css-extract-plugin");

const sourcePath = path.resolve("./source");
const outputPath = path.resolve("./out");

module.exports = () => {
  console.log("=================================");

  const config = {
    mode: "development",
    devtool: "eval",
    entry: {
      app: path.join(sourcePath, "index.tsx")
    },
    output: {
      filename: "[name].js",
      path: outputPath,
      publicPath: "/"
    },
    resolve: {
      symlinks: false,
      extensions: [".ts", ".tsx", ".js", ".scss"] // search for files ending with these extensions when importing
    },
    module: {
      rules: [
        {
          test: /\.scss$/, use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'sass-loader',
          ],
        },
        { test: /\.(ttf|eot|svg|woff2?)(\?[a-z0-9]+)?$/, loader: 'url-loader?limit=1000' },
        { test: /\.(png|jpeg|jpg|gif)$/, loader: 'url-loader?limit=1000' },
        {
          test: /\.tsx?$/,
          loader: "ts-loader", // compile typescript
        },
      ]
    },
    plugins: [
      new CopyWebpackPlugin([
        { from: "index.html" },
      ]),
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: "[name].css",
        chunkFilename: "[id].css"
      })
    ]
  }

  return config
}
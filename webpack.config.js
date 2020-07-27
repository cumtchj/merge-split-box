const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const {CleanWebpackPlugin} = require("clean-webpack-plugin")
const webpack = require('webpack')

const ENV = "development"
module.exports = {
  mode: ENV,
  devtool: "clean-module-eval-source-map",
  entry: {
    index: './src/index'
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js"
  },
  devServer: {
    contentBase: "./dist",
    open: true,
    port: 8080,
    hot: true,
    hotOnly: true
  },
  resolve: {
    extensions: [".js", '.scss']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: "/node_modules/",
      }, {
        test: /\.scss$/,
        use:[
          'style-loader',
          {
            loader:"css-loader",
            options: {
              importLoaders:2,
              modules:true
            }
          },
          'sass-loader',
          'postcss-loader'
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
    new CleanWebpackPlugin({cleanOnceBeforeBuildPatterns: ["dist"]}),
    ENV === "development" && new webpack.HotModuleReplacementPlugin()
  ]
}

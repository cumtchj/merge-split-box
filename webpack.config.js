const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const {CleanWebpackPlugin} = require("clean-webpack-plugin")
const webpack = require('webpack')
const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin')

const ENV = process.env.NODE_ENV
console.log("ENV====", ENV)
module.exports = function () {
  let config = {
    optimization: {
      minimizer: []
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./src/index.html",
      }),
      new CleanWebpackPlugin({cleanOnceBeforeBuildPatterns: ["dist"]}),
    ],
  }
  if (ENV === "development") {
    config.devServer = {
      contentBase: "./dist",
      open: true,
      port: 8080,
      hot: true,
      hotOnly: true
    };
    config.plugins.push(new webpack.HotModuleReplacementPlugin())
  }

  // if(ENV==="production"){
  //   config.optimization.minimizer.push( new UglifyjsWebpackPlugin({
  //     uglifyOptions: {
  //       mangle: true,
  //       output: {
  //         comments: false,
  //         beautify: false,
  //       },
  //     }
  //   }))
  // }

  return {
    mode: ENV,
    devtool: ENV === "production" ?
      "cheap-module-source-map" :
      "clean-module-eval-source-map",
    entry: {
      index: './src/index'
    },
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "[name].js"
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
          use: [
            'style-loader',
            {
              loader: "css-loader",
              options: {
                importLoaders: 2,
                modules: true
              }
            },
            'sass-loader',
            'postcss-loader'
          ]
        }
      ]
    },


    ...config
  }
}

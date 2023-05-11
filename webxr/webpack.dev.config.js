const path = require("path");
const merge = require("webpack-merge");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const common = require("./webpack.common.config");

module.exports = merge(common, {
  node: {
    fs: 'empty'
  },
  mode: "development",
  // no weird "eval" stuff, shows code relatively clear in dist/main.js
  devtool: "none",
  // this is just the entry js that gets bundled
  entry: {
    beam_vr: "./beam/index.js",
    calculus_vr: "./calculus/index.js",
    expression_validation: "./calculus/components/GraphComponent/MathExpression.js"
  },
  output: {
    // the filename is the name of the bundled file
    filename: "[name].bundle.js",
    // dist is the folder name it gets exported to
    path: path.resolve(__dirname, "dist"),
    publicPath: "/"
  },
  devServer: {
    https: true,
    host:"0.0.0.0",
    overlay: {
      warnings: false,
      errors: true
    }
  },
  plugins: [new HtmlWebpackPlugin({
    favicon: "./calculus/images/favicon.png",
    chunks: [''],
    template: "./index.html",
    filename: "index.html",
    // Injects file in the head of the html
    inject: 'head'
  }),new HtmlWebpackPlugin({
    favicon: "./calculus/images/favicon.png",
    chunks: ['expression_validation'],
    template: "./calculus/home.html",
    filename: "calculus_home.html",
    // Injects file in the head of the html
    inject: 'head'
  }),
  new HtmlWebpackPlugin({
    favicon: "./calculus/images/favicon.png",
    chunks: ['calculus_vr'],
    template: "./calculus/scene.html",
    filename: "calculus_scene.html",
    // Injects file in the head of the html
    inject: 'head'
  }),
  new HtmlWebpackPlugin({
    favicon: "./beam/images/favicon.png",
    chunks: ['beam_vr'],
    template: "./beam/beam_scene.html",
    filename: "beam_scene.html",
    // Injects file in the head of the html
    inject: 'head'
  })]
});
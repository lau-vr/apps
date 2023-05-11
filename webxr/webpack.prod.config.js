const path = require("path");
const merge = require("webpack-merge");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");

const common = require("./webpack.common.config");

module.exports = merge(common, {
  node: {
    fs: 'empty'
  },
  // production mode makes it uglyfied/minified
  mode: "production",
  // no weird "eval" stuff, shows code relatively clear in dist/main.js
  devtool: "none",
  entry: {
    beam_vr: "./beam/index.js",
    calculus_vr: "./calculus/index.js",
    expression_validation: "./calculus/components/GraphComponent/MathExpression.js"
  },
  output: {
    // the filename is the name of the bundled file
    filename: "[name].[contentHash].bundle.js",
    // dist is the folder name it gets exported to
    path: path.resolve(__dirname, "dist"),
  },
  devServer: {
    overlay: {
      warnings: false,
      errors: true
    }
  },
  optimization: {
    minimizer: [new TerserPlugin()]
  },
  // Deletes the dist folder, so the new .js files wont stack and pollute the folder
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
  }),new HtmlWebpackPlugin({
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
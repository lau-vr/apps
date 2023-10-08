const path = require("path");
const merge = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const common = require("./webpack.common.config");

module.exports = merge(common, {
  node: {
    fs: "empty",
  },
  // production mode makes it uglyfied/minified
  mode: "production",
  // no weird "eval" stuff, shows code relatively clear in dist/main.js
  devtool: "none",
  entry: {
    beam_vr: "./beam/index.js",
    calculus_vr: "./calculus/index.js",
    sorting_vr: "./sorting/index.js",
    crystallographic_vr: "./crystallographic_planes/index.js",
    crystallographic_BCC: "./crystallographic_planes/adjustLocationBCC.js",
    crystallographic_BCCAR: "./crystallographic_planes/adjustLocationBCCAR.js",
    crystallographic_BCCQuiz: "./crystallographic_planes/BCCquiz.js",
    crystallographic_BCCQuizAR: "./crystallographic_planes/BCCquizAR.js",
    crystallographic_FCC: "./crystallographic_planes/adjustLocationFCC.js",
    crystallographic_FCCAR: "./crystallographic_planes/adjustLocationFCCAR.js",
    crystallographic_FCCQuiz: "./crystallographic_planes/FCCquiz.js",
    crystallographic_FCCQuizAR: "./crystallographic_planes/FCCquizAR.js",
    expression_validation:
      "./calculus/components/GraphComponent/MathExpression.js",
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
      errors: true,
    },
  },
  optimization: {
    minimizer: [new TerserPlugin()],
  },
  // Deletes the dist folder, so the new .js files wont stack and pollute the folder
  plugins: [
    new HtmlWebpackPlugin({
      favicon: "./calculus/images/favicon.png",
      chunks: [""],
      template: "./index.html",
      filename: "index.html",
      // Injects file in the head of the html
      inject: "head",
    }),
    new HtmlWebpackPlugin({
      favicon: "./calculus/images/favicon.png",
      chunks: ["expression_validation"],
      template: "./calculus/home.html",
      filename: "calculus_home.html",
      // Injects file in the head of the html
      inject: "head",
    }),
    new HtmlWebpackPlugin({
      favicon: "./calculus/images/favicon.png",
      chunks: ["calculus_vr"],
      template: "./calculus/scene.html",
      filename: "calculus_scene.html",
      // Injects file in the head of the html
      inject: "head",
    }),
    new HtmlWebpackPlugin({
      favicon: "./beam/images/favicon.png",
      chunks: ["beam_vr"],
      template: "./beam/beam_scene.html",
      filename: "beam_scene.html",
      // Injects file in the head of the html
      inject: "head",
    }),
    new HtmlWebpackPlugin({
      favicon: "./sorting/images/favicon.png",
      chunks: ["sorting_vr"],
      template: "./sorting/sorting_scene.html",
      filename: "sorting_scene.html",
      // Injects file in the head of the html
      inject: "head",
    }),
    new HtmlWebpackPlugin({
      favicon: "./crystallographic_planes/images/favicon.png",
      chunks: ["crystallographic_vr"],
      template: "./crystallographic_planes/mainmenue.html",
      filename: "mainmenue.html",
      inject: "head",
    }),
    new HtmlWebpackPlugin({
      favicon: "./crystallographic_planes/images/favicon.png",
      chunks: ["crystallographic_BCC"],
      template: "./crystallographic_planes/BCC_v3.html",
      filename: "BCC_v3.html",
      inject: "head",
    }),
    new HtmlWebpackPlugin({
      favicon: "./crystallographic_planes/images/favicon.png",
      chunks: ["crystallographic_BCCAR"],
      template: "./crystallographic_planes/bccAR.html",
      filename: "bccAR.html",
      inject: "head",
    }),
    new HtmlWebpackPlugin({
      favicon: "./crystallographic_planes/images/favicon.png",
      chunks: ["crystallographic_BCCQuiz"],
      template: "./crystallographic_planes/BCCquiz.html",
      filename: "BCCquiz.html",
      inject: "head",
    }),
    new HtmlWebpackPlugin({
      favicon: "./crystallographic_planes/images/favicon.png",
      chunks: ["crystallographic_BCCQuizAR"],
      template: "./crystallographic_planes/BCCquizAR.html",
      filename: "BCCquizAR.html",
      inject: "head",
    }),
    new HtmlWebpackPlugin({
      favicon: "./crystallographic_planes/images/favicon.png",
      chunks: ["crystallographic_FCC"],
      template: "./crystallographic_planes/FCC.html",
      filename: "FCC.html",
      inject: "head",
    }),
    new HtmlWebpackPlugin({
      favicon: "./crystallographic_planes/images/favicon.png",
      chunks: ["crystallographic_FCCAR"],
      template: "./crystallographic_planes/fccAR.html",
      filename: "fccAR.html",
      inject: "head",
    }),
    new HtmlWebpackPlugin({
      favicon: "./crystallographic_planes/images/favicon.png",
      chunks: ["crystallographic_FCCQuiz"],
      template: "./crystallographic_planes/FCCquiz.html",
      filename: "FCCquiz.html",
      inject: "head",
    }),
    new HtmlWebpackPlugin({
      favicon: "./crystallographic_planes/images/favicon.png",
      chunks: ["crystallographic_FCCQuizAR"],
      template: "./crystallographic_planes/FCCquizAR.html",
      filename: "FCCquizAR.html",
      inject: "head",
    }),
  ],
});

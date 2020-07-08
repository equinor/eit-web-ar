/* eslint-disable */
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin"); // https://github.com/jantimon/html-webpack-plugin
const RemovePlugin = require("remove-files-webpack-plugin"); // https://github.com/Amaimersion/remove-files-webpack-plugin
const WebpackMd5Hash = require("webpack-md5-hash");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
   mode: "development",
   entry: {
      app: "./index.js",
      ui: "./modules/ui.js"
   },
   output: {
      filename: "[name].[hash].js",
      path: path.resolve(__dirname, "./dist"),
   },
   optimization: {
      splitChunks: {
         cacheGroups: {
            commons: {
               test: /[\\/]node_modules[\\/]/,
               name: "vendor",
               chunks: "all"
            }
         }
      },
   },
   devtool: "inline-source-map",
   devServer: {
      contentBase: "./dist",
      port: 3000,
      https: true // true for self-signed, object for cert authority
   },
   module: {
      rules: [
         {
            test: /\.css$/,
            use: [
               "style-loader",
               "css-loader",
            ],
         },
         {
            test: /\.(png|svg|jpg|gif)$/,
            use: [{
               loader: "file-loader",
               options: {
                  name: "[folder]/[name].[ext]",
               }
            }],
         },
         {
            test: /\.mp3$/,
            use: [{
               loader: "file-loader",
               options: {
                  name: "[folder]/[name].[ext]",
               }
            }],
         },
         {
            test: /\.(woff|woff2|eot|ttf|otf)$/,
            use: [{
               loader: "file-loader",
               options: {
                  name: "[name].[ext]"
               }
            }],
         },
         {
            test: /\.(html)$/,
            use: [
               "html-loader",
            ]
         }
      ],
   },
   plugins: [
      new RemovePlugin({
         before: {
            // parameters for "before normal compilation" stage.
            // expects what your output folder is "dist".
            include: [
               './dist'
           ]
         },
         watch: {
            // parameters for "before watch compilation" stage.
         },
         after: {
            // parameters for "after normal and watch compilation" stage.
         }
      }),
      new HtmlWebpackPlugin({
         hash: true,
         favicon: "./favicon.ico",
         template: "./index.html",
         filename: "index.html",
         inject: "head",
         chunks: ["app", "vendor"],
         chunksSortMode: "dependency"
      }),
      new HtmlWebpackPlugin({
         hash: true,
         favicon: "./favicon.ico",
         template: "./epic1.html",
         filename: "epic1.html",
         inject: "head",
         chunks: ["app", "vendor"],
         chunksSortMode: "dependency"
      }),
      new HtmlWebpackPlugin({
         hash: true,
         favicon: "./favicon.ico",
         template: "./epic2.html",
         filename: "epic2.html",
         inject: "head",
         chunks: ["app", "vendor", "ui"],
         chunksSortMode: "dependency"
      }),
      new HtmlWebpackPlugin({
         hash: true,
         favicon: "./favicon.ico",
         template: "./epic3.html",
         filename: "epic3.html",
         inject: "head",
         chunks: ["app", "vendor"],
         chunksSortMode: "dependency"
      }),
      new HtmlWebpackPlugin({
         hash: true,
         favicon: "./favicon.ico",
         template: "./game.html",
         filename: "game.html",
         inject: "head",
         chunks: ["app", "vendor"],
         chunksSortMode: "dependency"
      }),
      new WebpackMd5Hash(),
      new CopyPlugin([
        { from: './src/frontend/images', to: 'images' },
        { from: './src/frontend/gltf', to: 'gltf' },
        { from: './src/frontend/audio', to: 'audio' },
        { from: './src/frontend/game', to: 'game' }
      ]),
   ],
   externals: {
     fs: 'fs'
   }
};

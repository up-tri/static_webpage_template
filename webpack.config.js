const path = require("path");
const fs = require("fs");

// plugins
const HtmlPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

// recursive readdir(for .html resources)
function recursiveFindHTML(dirname) {
  return fs.readdirSync(dirname, { withFileTypes: true })
    .flatMap(sub => {
      const currentPath = `${dirname}/${sub.name}`;
      return sub.isFile() ? [currentPath] : recursiveFindHTML(currentPath);
    })
    .filter(pathname => /\.html$/.test(pathname))
    .map(pathname => pathname.replace(path.join(__dirname, "src/html/"), ""));
};

/** @type {import('webpack').Configuration} */
module.exports = {
  mode: process.env.NODE_ENV || "development",
  entry: {
    app: [
      path.join(__dirname, "src/ts/index.ts"),
      path.join(__dirname, "src/scss/app.scss"),
    ]
  },
  output: {
    clean: true,
    path: path.resolve(__dirname, "dist"),
    filename: "js/[name].[hash].js",
    library: {
      type: "umd"
    },
    globalObject: "this"
  },
  resolve: {
    extensions: [".ts", ".js", ".scss"]
  },
  module: {
    rules: [
      // typescript
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader",
            options: {
              configFile: process.env.NODE_ENV === "development" ? "tsconfig.json" : "tsconfig.prod.json",
            }
          }
        ]
      },
      // scss
      {
        test: /\.scss$/,
        use: [
          process.env.NODE_ENV === "production" ? MiniCssExtractPlugin.loader : "style-loader",
          {
            loader: "css-loader",
            options: {
              url: false,
            }
          },
          {
            loader: "sass-loader",
            options: {
              // dart-sass
              implementation: require("sass"),
            }
          },
        ],
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/app.[hash].css",
    }),
    new CopyPlugin({
      patterns: [{
        from: path.resolve(__dirname, 'src/img/'),
        to: path.resolve(__dirname, 'dist/img/'),
      }]
    }),
    ...recursiveFindHTML(path.join(__dirname, "src/html")).map(filename => new HtmlPlugin({ filename, template: `src/html/${filename}` }))
  ]
};

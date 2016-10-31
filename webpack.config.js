const path = require('path');

module.exports = {
  cache: true,
  entry: './src/main.js',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, './js'),
  },
  externals: {
    ChineseDistricts: 'window.ChineseDistricts',
    jquery: 'window.jQuery',
    vue: 'window.Vue',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015'],
        },
      },
    ],
  },
  devtool: 'source-map',
};

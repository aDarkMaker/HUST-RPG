const path = require('path');

module.exports = {
  mode: 'development',
  entry: './scripts/gameInit.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  resolve: {
    fallback: {
      "path": require.resolve("path-browserify"),
      "url": require.resolve("url/"),
      "util": false,
      "stream": false,
      "buffer": false,
      "crypto": false
    }
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/i,
        type: 'asset',
        generator: {
          filename: 'assets/[name][ext]'
        }
      }
    ]
  },
  devServer: {
    static: {
      directory: path.join(__dirname),
      publicPath: '/'
    },
    hot: true,
    open: true
  }
}
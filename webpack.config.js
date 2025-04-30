const path = require('path');

module.exports = {
  mode: 'development',
  entry: './scripts/gameInit.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '' // 修改为空字符串，使用相对路径
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
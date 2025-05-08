const path = require('path');

module.exports = {
  resolve: {
    fallback: {
      path: require.resolve('path-browserify'),
      fs: require.resolve('browserify-fs'),
      child_process: require.resolve('child-process-promise'),
      zlib: require.resolve('browserify-zlib'),
      stream: require.resolve('stream-browserify'),
      util: require.resolve('util'),
      buffer: require.resolve('buffer'),
      process: require.resolve('process/browser'),
      crypto: require.resolve('crypto-browserify'),
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      os: require.resolve('os-browserify'),
      assert: require.resolve('assert')
    },
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules|scripts\//,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'images/',
              publicPath: '/',
              emitFile: true
            }
          }
        ]
      },
      {
        test: /\.(svg)$/i,
        use: [
          {
            loader: 'svg-url-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'images/',
              publicPath: '/',
              emitFile: true
            }
          }
        ]
      }
    ]
  },
  externals: {
    fs: false,
    path: false,
    child_process: false
  }
};

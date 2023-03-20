const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { resolve } = require('path')
const {
  CLIENT_HOST_PORT
} = require('./src/server/enviornment-variables/development')

module.exports = {
  mode: 'development',
  entry: {
    app: ['regenerator-runtime/runtime', './src/index.js']
  },
  output: {
    path: resolve('public'),
    filename: '[name].bundle.js'
  },
  devServer: {
    port: CLIENT_HOST_PORT
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        use: 'babel-loader',
        test: /\.js$/,
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html'
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: './public/favicon.ico',
          to: 'favicon.ico'
        },
        {
          from: './src/client/logo.png',
          to: 'logo.png'
        }
      ]
    }),
    new webpack.DefinePlugin({
      ROOT_URL: JSON.stringify('http://localhost:5059'),
      TEST_MODE: JSON.stringify('false')
    })
  ],
  resolve: {
    fallback: {
      path: require.resolve('path-browserify')
    }
  }
}

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  devtool: 'inline-source-map',
  devServer: {
    port: 5288,
    contentBase: './dist',
    proxy: {
      '/api': 'http://localhost:61386'
    }
  },
  entry: [
      path.resolve(__dirname, 'src/index')
  ],
  target: 'web',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html'    }),
    new CopyPlugin([
      { from: './src/assets', to: 'assets' }
    ])
  ],
  module: {
    rules: [
      {
        test: /\.(css|scss)$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'assets'
            }
          }
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'assets'
            }
          }
        ]
      },
      {
        test: /\.js$/, 
        exclude: /node_modules/, 
        loaders: ['babel-loader', 'eslint-loader'] 
      },
      {
        test: /\.(html)$/,
        use: [
          'html-loader'
        ]
      }
    ]
  }
}
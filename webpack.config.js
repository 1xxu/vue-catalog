const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const VueloaderPlugin = require('vue-loader/lib/plugin')

const buildDir = path.resolve(__dirname, 'dist')
const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  mode: process.env.NODE_ENV,
  entry: './src/index.js',
  output: {
    filename: 'index.js',
    path: buildDir,
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          isProd ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              babelrc: false, // 禁用外部 babelrc
              presets: [
                [
                  '@babel/preset-env',
                  {
                    modules: false, // 不编译成 commonjs
                    useBuiltIns: 'usage', // 按需 polyfill
                    corejs: 3,
                  },
                ],
              ],
              plugins: [
                'lodash', // 按需加载 lodash
                '@babel/plugin-proposal-optional-chaining'
              ]
            }
          },
        ]
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      }
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new VueloaderPlugin(),
    ...isProd ? [new MiniCssExtractPlugin()] : [
      new HtmlWebpackPlugin({
        template: 'src/index.html',
      }),
    ],
    new webpack.HotModuleReplacementPlugin(),
  ],
  ...isProd ? {} : {
    devtool: 'source-map',
    devServer: {
      contentBase: buildDir,
      host: '0.0.0.0',
      port: 12306,
      open: true,
      hot: true,
      hotOnly: true,
    },
  },
  resolve: {
    extensions: ['.js', '.vue', '.json']
  }
}

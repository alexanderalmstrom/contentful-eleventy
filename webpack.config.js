const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, argv) => {
  const isDev = argv.mode === 'development';

  return {
    mode: argv.mode,
    devtool: isDev ? 'eval-source-map' : false,
    entry: './src/scripts/main.js',
    output: {
      path: path.resolve(__dirname, 'public'),
      filename: 'main.js',
      publicPath: '/'
    },
    devServer: {
      contentBase: path.resolve(__dirname, 'public'),
      watchContentBase: true,
      port: 5000,
      hot: true,
      historyApiFallback: true,
      host: '0.0.0.0',
      disableHostCheck: true,
    },
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /(node_modules)/,
          use: { loader: 'babel-loader' }
        }, {
          test: /\.(sc|c)ss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: { hmr: isDev }
            }, {
              loader: 'css-loader',
              options: { sourceMap: isDev }
            }, {
              loader: 'postcss-loader',
              options: { sourceMap: isDev }
            }, {
              loader: 'sass-loader',
              options: {
                sassOptions: {
                  sourceMap: isDev,
                  includePaths: ['node_modules']
                }
              }
            }
          ]
        }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'main.css'
      })
    ]
  }
}

const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');

const propOrTest = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';

const externals = [];
if (propOrTest) {
  externals.push(nodeExternals());
}

const serverRules = [
  {
    test: /\.js$/,
    exclude: /node_modules/,
    use: ['babel-loader'],
  },
];

if (!propOrTest) {
  serverRules.push({
    test: /node_modules\/JSONStream\/index\.js$/,
    loader: 'string-replace-loader',
    query: {
      search: '#! /usr/bin/env node',
      replace: ' ',
    },
  });
}

const extractText = new ExtractTextPlugin({
  filename: '/css/[name].css',
  disable: false,
  allChunks: true,
});

const bootstraprcCustomLocation = './.bootstraprc';
const bootsrapConfig = 'bootstrap-loader/lib/bootstrap.loader?extractStyles' +
  `&configFilePath=${__dirname}/${bootstraprcCustomLocation}` +
  '!bootstrap-loader/no-op.js';

module.exports = [
  {
    name: 'server',
    target: 'node',
    externals: externals,
    entry: {
      index: './src/server/index.js',
    },
    output: {
      path: path.join(__dirname, 'dist'),
      filename: 'server.bundle.js',
      libraryTarget: 'commonjs2',
    },
    module: {
      rules: serverRules,
    },
  },
  {
    name: 'client',
    entry: {
      client: ['babel-polyfill', './src/client/index.js'],
      bootstrap: bootsrapConfig,
    },
    output: {
      path: path.join(__dirname, 'dist'),
      filename: '[name].bundle.js',
    },
    resolve: {
      extensions: ['*', '.js', '.jsx'],
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: ['css-loader'],
            publicPath: '/dist',
          }),
        },
        {
          test: /\.scss$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: ['css-loader', 'resolve-url-loader', 'sass-loader?sourceMap'],
            publicPath: '/dist',
          }),
        },
        {
          test: /.jsx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: [
                  ['react'],
                  ['es2015', { modules: false }],
                ],
              },
            },
          ],
        },
        {
          test: /\.(woff|woff2|ttf|eot)/,
          use: 'url-loader?limit=100000&name=[name].[ext]',
        },
        {
          test: /\.(jpe?g|png|gif|svg)$/i,
          use: [
            'file-loader?name=images/[name].[ext]',
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'Colibri',
        minify: {
          collapseWhitespace: true,
        },
        template: './src/client/index.html',
      }),
      extractText,
      new webpack.NamedModulesPlugin(),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      }),
    ],
  },
];

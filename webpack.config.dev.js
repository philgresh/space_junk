const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

const isDevelopment = process.env.NODE_ENV === 'development';

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 3000,
  },
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: [/\.js?$/],
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          query: {
            presets: ['@babel/env'],
          },
        },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.module\.s(a|c)ss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.module\.s(a|c)ss$/,
        loader: [
          isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: true,
              sourceMap: isDevelopment,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: isDevelopment,
            },
          },
        ],
      },
      {
        test: /\.s(a|c)ss$/,
        exclude: /\.module.(s(a|c)ss)$/,
        loader: [
          isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              sourceMap: isDevelopment,
            },
          },
        ],
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: {
          loader: 'url-loader',
        },
        // use: [
        //   'file-loader',
        //   {
        //     loader: 'image-webpack-loader',
        //     options: {
        //       name: `[name].[ext]`,
        //       mozjpeg: {
        //         progressive: true,
        //         quality: 65,
        //       },
        //       optipng: {
        //         enabled: !isDevelopment,
        //       },
        //       pngquant: {
        //         quality: '65-90',
        //         speed: 4,
        //       },
        //       gifsicle: {
        //         interlaced: false,
        //       },
        //       webp: {
        //         quality: 75,
        //       },
        //     },
        //   },
        // ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: './index.html',
      inject: true,
      template: path.resolve(__dirname, 'src', 'index.html'),
    }),
    new FaviconsWebpackPlugin('./src/assets/images/favicon-32x32.png'),
  ],
  resolve: {
    extensions: [
      '.js',
      '.jsx',
      '.scss',
      '.module.scss',
      '.gif',
      '.png',
      '.jpg',
      '.jpeg',
      '.svg',
    ],
  },
};

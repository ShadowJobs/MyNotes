const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  externals: {
    'react': 'window.React',
    'react-dom': 'window.ReactDOM',
  },
  module: {
    rules: [
      {
        // test: /\.jsx?$/, 
        test: /\.(jsx?|tsx?)$/, // 匹配 JS, JSX, TS, 和 TSX 文件
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            // presets: ['@babel/preset-env', '@babel/preset-react']
            presets: ['@babel/preset-env', '@babel/preset-react',
              '@babel/preset-typescript'// 添加这个预设来处理 TypeScript
            ]
          }
        }
      }
    ]
  },
  resolve: {
    alias: { //设置别名
      '@': path.resolve(__dirname, 'src'), // 将 '@' 设置为 'src' 目录的绝对路径
      //... 可能还有其他别名配置
    },
    // extensions: ['.js', '.jsx']
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'] // 添加 .ts 和 .tsx
    // ... 其他 resolve 配置 ...
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index.html'
    })
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    open: true
  }
};

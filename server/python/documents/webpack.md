# 1. loader
- ant design pro项目里，使用webpackChain无效，可能内部有配置覆盖

- ### 如何在代码里使用特定loader
  - 在配置里用rule+test+use的方式配置
  - 在import或require语句中使用loader前缀
    - `!` 前缀会禁用所有已配置的 normal loader。
    - `!!` 前缀会禁用所有已配置的 loader（包括 pre 和 post）。
    - `-!` 前缀会禁用所有已配置的 pre 和 normal loader。
    
  import md from '!!raw-loader!./markdown.md'

  所以 `!!raw-loader!` 的作用是：跳过所有其他配置的 loader，只使用 raw-loader 来处理文件。

  这种方式通常用于特定情况下覆盖默认配置，不是所有 loader 都需要这样使用。

- ### 常用的 loader
  1. `babel-loader`: 转换 ES6+ 代码为 ES5。
  2. `css-loader`: 解析 CSS 文件，处理 CSS 中的依赖。
  3. `style-loader`: 将 CSS 插入到 DOM 中。
  4. `sass-loader`: 将 SASS/SCSS 转换为 CSS。
  5. `file-loader`: 处理文件导入，返回文件的 URL。
  6. `url-loader`: 类似 file-loader，但可以返回 data URL。
  7. `ts-loader`: 将 TypeScript 转换为 JavaScript。
  8. `eslint-loader`: 在 Webpack 编译过程中运行 ESLint。
  9. `vue-loader`: 处理 Vue 单文件组件。
  10. `html-loader`: 导出 HTML 为字符串，需要时最小化 HTML。


# 2. 配置项

```js
const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')
// const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const LoadablePlugin = require('@loadable/webpack-plugin')

// const smp = new SpeedMeasurePlugin() // 测量构建速度
const devMode = process.env.NODE_ENV !== 'production';
const pkg = require('./package.json');

module.exports = ({
  mode: devMode ? 'development' : 'production',
  devtool: devMode ? 'inline-source-map' : 'hidden-source-map',
  entry: path.resolve(__dirname, './src/index.ts'),
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: devMode ? 'linyreact.js' : 'linyreact.min.js',
    library: 'linyreact',
    libraryTarget: 'umd'
  },
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
    }
  },

  module: {
    rules: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      {
        test: /\.tsx?$/,
        use: [
          'babel-loader?cacheDirectory',
          {
            loader: 'ts-loader',
            options: {
              configFile: 'tsconfig.json'
            }
          }
        ]
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader // 抽取样式文件，将css样式文件用link标签引入，使用此loader就不需要用style-loader，即使用了也不会有效果
          },
          {
            loader: 'css-loader',
            options: {
              modules: {
                auto: true,
                localIdentName: devMode ? '[path][name]__[local]' : '[hash:base64:5]'
              },
              importLoaders: 2, // 一个css中引入了另一个css，也会执行之前两个loader，即postcss-loader和sass-loader
            }
          },
          {
            // 使用 postcss 为 css 加上浏览器前缀
            loader: 'postcss-loader',
            options: {
              // options has an unknown property 'plugins';
              postcssOptions: {
                // PostCSS plugin autoprefixer requires PostCSS 8.将autoprefixer降到8.0.0版本
                plugins: [require('autoprefixer')]
              }
            }
          },
          {
            loader: 'sass-loader' // 使用 sass-loader 将 scss 转为 css
          }
        ]
      },
      {
        test: /(\.(eot|ttf|woff|woff2)|font)$/,
        loader: 'file-loader',
        options: { outputPath: 'fonts/' }
      },
      {
        test: /\.(png|jpg|gif|svg|jpeg)$/,
        loader: 'file-loader',
        options: { outputPath: 'images/' }
      }
    ]
  },
  plugins: [
    // new CleanWebpackPlugin(),
    // new LoadablePlugin(),
    // 该插件能够使得指定目录被忽略，从而使得打包变快，文件变小;下面忽略了包含’./locale/'该字段路径的文件目录,但是也使得我们使用的时候不能显示中文语言了，所以这个时候可以手动引入中文语言的目录
    // new webpack.IgnorePlugin(/\.\/locale/, /moment/),
    // 主要用于对打包好的js文件的最开始处添加版权声明
    new webpack.BannerPlugin(`linyreact ${pkg.version}`),
    // 将CSS提取到单独的文件中
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: devMode ? 'linyreact.css' : 'linyreact.min.css',
      chunkFilename: '[id].css'
    })
    // devMode ? new webpack.HotModuleReplacementPlugin() : null
  ],
  optimization: {
    minimizer: devMode
      ? []
      : [
          // 压缩js代码
          // new UglifyJsPlugin({
          //   cache: true, // 启用文件缓存并设置缓存目录的路径
          //   parallel: true, // 使用多进程并行运行
          //   sourceMap: true // set to true if you want JS source maps
          // }),
          // webpack v5 使用内置的TerserJSPlugin替代UglifyJsPlugin，因为UglifyJsPlugin不支持ES6
          new TerserJSPlugin({
            // cache: true, // 启用文件缓存并设置缓存目录的路径
            parallel: true, // 使用多进程并行运行
            // sourceMap: true // set to true if you want JS source maps
          }),
          // 用于优化或者压缩CSS资源
          new OptimizeCSSAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano'), // 用于优化\最小化 CSS 的 CSS 处理器，默认为 cssnano
            cssProcessorOptions: { safe: true, discardComments: { removeAll: true } }, // 传递给 cssProcesso
            canPrint: true // 布尔值，指示插件是否可以将消息打印到控制台，默认为 true
          })
        ],
    sideEffects: false,
    // "sideEffects": ["./src/some-side-effectful-file.js"],防止被tree shaking
  }
});

```

# 3. node 功能注入

  前端打包工具（如Webpack、Vite等）会在构建过程中，识别并替换所有`process.env.NODE_ENV`为部署时确定的环境变量。这是通过`DefinePlugin`插件来实现的。

  ### 配置Webpack中的DefinePlugin

  在Webpack配置文件中，可以使用`DefinePlugin`插件注入环境变量。以下是一些基本配置的示例：

  ```javascript
  const webpack = require('webpack');
  module.exports = {
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      })
    ]
  };
  ```

  ### package.json

  通过`package.json`中的脚本设置不同的环境：

  ```json
  {
    "scripts": {
      "start": "NODE_ENV=development webpack serve",
      "build": "NODE_ENV=production webpack"
    }
  }
  ```

  ### 在ant design pro项目里自定义
  通常使用umi的功能，即 .env 文件配置，然后在代码里使用 process.env.xxx 来获取环境变量
  
  步骤：
  1. 创建.env文件，内容为： TEST_ENV=SHADOW, 或者在config/config.ts里，直接使用process.env.TEST_ENV = 'SHADOW'
  2. config/config.ts里加入：export default defineConfig({define: {'process.env': process.env,},});
  3. 在代码里使用：process.env.TEST_ENV
  
  注意，如果要使用自定义的变量，第二步是必须的，默认情况下，process.env.NODE_ENV是webpack处理的，代码里(node启动 和 项目运行)都能用，但是如果不写第二步，
  那么process.env.TEST_ENV只能在node启动时使用，运行时就没有了。有了第二步后，process.env.TEST_ENV就能在运行时使用了。

# 4. webpack-chain 其他依赖于webpack的项目，如下：
查看craco.config.js, antdp1/config/config.js,
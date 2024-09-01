// https://umijs.org/config/
import { defineConfig } from 'umi';
import { join } from 'path';

import defaultSettings from './defaultSettings';
import proxy from './proxy';
import routes from './routes';
import MonacoWebpackPlugin from 'monaco-editor-webpack-plugin';

const { REACT_APP_ENV } = process.env;

export default defineConfig({
  hash: true,
  antd: {},
  // publicPath: '/ly/',

  dva: {
    hmr: true,
  },
  layout: {
    // https://umijs.org/zh-CN/plugins/plugin-layout
    locale: false,
    siderWidth: 208,
    ...defaultSettings,
    collapsedButtonRender: false,//这个是隐藏菜单的收起按钮。具体定义是在ProLayout里
  },
  // https://umijs.org/zh-CN/plugins/plugin-locale
  locale: {
    // default zh-CN
    default: 'zh-CN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@ant-design/pro-layout/es/PageLoading',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes,
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'root-entry-name': 'variable',
  },
  // esbuild is father build tools
  // https://umijs.org/plugins/plugin-esbuild
  esbuild: {},
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  // Fast Refresh 热更新
  fastRefresh: {},
  openAPI: [
    {
      requestLibPath: "import { request } from 'umi'",
      // 或者使用在线的版本
      // schemaPath: "https://gw.alipayobjects.com/os/antfincdn/M%24jrzTTYJN/oneapi.json"
      schemaPath: join(__dirname, 'oneapi.json'),
      mock: false,
    },
    {
      requestLibPath: "import { request } from 'umi'",
      schemaPath: 'https://gw.alipayobjects.com/os/antfincdn/CA1dOm%2631B/openapi.json',
      projectName: 'swagger',
    },
  ],
  nodeModulesTransform: { type: 'none' },
  mfsu: {},
  webpack5: {},
  exportStatic: {},
  chainWebpack: (memo) => {
    memo.module //实测，这样导入的md，不会按纯文本处理，而是会生成一个module，是个函数，原因待查
      .rule('md').test(/\.md$/).use('raw-loader').loader('raw-loader').end();
    // memo.module .rule('js').exclude.add(/\.md$/)
    memo.plugin('monaco-editor').use(MonacoWebpackPlugin, [
      { languages: ['javascript','json','python'] },
    ]);
    // memo.module
    //   .rule('worker')
    //   .test(/\.worker\.js$/)
    //   .use('worker-loader')
    //   .loader('worker-loader');
    memo.optimization.splitChunks({
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/](react|react-dom|@ant-design|antd|@antv)[\\/]$/,
          name: 'vendors',
          chunks: 'all',
        }
      }
    });
    return memo;
  },

  // externals:  process.env.CDN_REGION === 'EU' ? {}:{
  //   'react': 'window.React',
  //   'react-dom': 'window.ReactDOM',
  // },

  // // 引入被 external 库的 scripts
  // // 区分 development 和 production，使用不同的产物
  // scripts: scripts: process.env.CDN_REGION === 'EU' ? 
  // [
  //   'https://unpkg.com/react@18.2.0/umd/react.production.min.js',
  //   'https://unpkg.com/react-dom@18.2.0/umd/react-dom.production.min.js',
  // ]: process.env.NODE_ENV === 'development' ? [
  //   'https://gw.alipayobjects.com/os/lib/react/18.2.0/umd/react.development.js',
  //   'https://gw.alipayobjects.com/os/lib/react-dom/18.2.0/umd/react-dom.development.js',
  // ] : [
  //   'https://gw.alipayobjects.com/os/lib/react/18.2.0/umd/react.production.min.js',
  //   'https://gw.alipayobjects.com/os/lib/react-dom/18.2.0/umd/react-dom.production.min.js',
  // ],
  
  devtool:"source-map", //默认关掉，不然会很慢
  devServer:{
    //注意devServer是umi的配置，不是webpack的配置，修改之后umi会自动合并到webpack的配置中，并且需要重启
    // 重启后在浏览器里还需要清空缓存，disable cache，并手动刷新才能生效
    port: 8009,
    headers: {
      // 'X-Frame-Options': 'DENY',  // 只允许同源的站点嵌入，实测在本地无效（gpt解释为localhost下，同源限制会放宽，或许使用ip访问也会生效？），
      // 但是gpt说在build后nginx服务器上可行，所以待验证
      
      // 'Content-Security-Policy': "frame-ancestors 'none'",//本地会生效
      // "Access-Control-Allow-Origin": "http://localhost:8009", //只允许同源访问，在别的域名下使用fetch时会报错
    }
  }
});

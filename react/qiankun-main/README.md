# Getting Started with Create React App
主项目：qiankun-main  react18
子项目：
  1,react1 react17
  2,vue/myvue-vue3 vue3.0 参考 https://zhuanlan.zhihu.com/p/618433202
待解决问题：
1，ant design pro项目做主项目
2，ant design pro项目做子项目
3，vue3项目做主项目 待参考https://blog.csdn.net/weixin_46769087/article/details/131406750

qiankun 原理
学习 https://www.bilibili.com/video/BV1H34y117fe/?spm_id_from=333.337.search-card.all.click&vd_source=8b372dea1018ca4ba01e5493f0aaaf82
知识点：
子应用不需要安装qiankun包
匹配路由，监听路由变化，onhashchange,popstate,pushstate,等
路由改变时，卸载旧代码，加载新代码，有单独的库kuitos/import-html-entry，这个库可以获取html，css,js，并提供sandbox环境执行js，
卸载旧路由时怎么获取旧的app？需要自己记录2个页面prev和curr。（因为浏览器不提供，否则切换时无法销毁旧的页面）
-------------------自己实现怎么做？start-------------------
实现：import-html-entry，通过createElement("div"),设置div的innerHtml,然后这个div就可以querySelectorAll("script")得到所有脚本代码
渲染节点是container指定的节点，通过主应用设置__POWERED_BY_QIANKUN__来控制
innerHtml不自动执行<javascript>标签，需要获取节点后，获得节点内的脚本（沙箱隔离方式2种1，代理沙箱，2，快照沙箱）
获取的脚本可能是源码，可能是链接，（如果是链接，需要先下载）eval执行这些代码
注意执行脚本时主应用需要设置
const module={exports:{}}
const exports=module.exports
目的是伪造commonjs环境，
需要指定运行时publicPath，主项目需要指定这个值__INJECTED_PUBLIC_PATH_BY_QIANKUN__
css隔离有2种技术
子项目需要允许跨域
子项目必须打包成1个库，格式umd（用于上下兼容js版本）,这个库的名字设置在webpack output library里,主应用会通过这个库名找子应用的mount,unmount,bootstrap函数
特殊举例：async function mount(app){
  app.mount && (await app.mount({container:document.querySelector("app.container")}))
}
css处理方式1,shadowDom（浏览器提供的css隔离节点，兼容？）,2所有style class前都加一个前缀

-------------------自己实现end-------------------


This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)
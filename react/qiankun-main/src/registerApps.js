import { registerMicroApps, start,initGlobalState } from 'qiankun';
const loader = (loading) => {
    console.log('加载状态', loading)
}
const actions = initGlobalState({
    name:'jw',
    age:30
})
actions.onGlobalStateChange((newVal,oldVal)=>{
    console.log('parent',newVal,oldVal)
})

registerMicroApps([
    // {
    //     name: 'reactApp',
    //     entry: '//localhost:9102', // 默认react启动的入口是10000端口
    //     activeRule: '/react',
    //     container: '#container',
    //     loader,
    //     props: { a: 1, util: {} }
    // },
    {
        name: 'vueApp',
        entry: '//localhost:9101',
        activeRule: '/vue',
        container: '#container',
        loader,
        props: { a: 1, util: {} }
    },
    {
        name: 'react my',
        entry: '//localhost:9102',
        activeRule: '/react1',
        container: '#container', 
        loader,
        props: { a: 1, util: {} }
    }
], {
    beforeLoad() {
        console.log('before load')
    },
    beforeMount() {
        console.log('before mount')
    },
    afterMount() {
        console.log('after mount')
    },
    beforeUnmount() {
        console.log('before unmount')
    },
    afterUnmount() {
        console.log('after unmount')
    }
})
start({
    sandbox:{
        // 实现了动态样式表
        // css-module,scoped 可以再打包的时候生成一个选择器的名字  增加属性 来进行隔离
        // BEM
        // CSS in js
        // shadowDOM 严格的隔离

        // strictStyleIsolation:true,
        //experimentalStyleIsolation:true // 缺点 就是子应用中的dom元素如果挂在到了外层，会导致样式不生效
    }
})



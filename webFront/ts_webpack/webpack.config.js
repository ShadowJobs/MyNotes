const path=require('path')
const htmlWebpackPlugin=require("html-webpack-plugin")
const {CleanWebpackPlugin} = require("clean-webpack-plugin")

//使用webpack需要npm install webpack webpack-cli ts-loader typescript
// npm i -D webpack webpack-cli typscript ts-loader (-D表示装到devDependencies里）
//对于想在命令行下使用webpack的，需要npm install -g webpack webpack-cli，安装到全局。
//

module.exports={
    entry:"./src/a.ts", //指定入口文件
    output:{
        path:path.resolve(__dirname,'dist'), //也可以直接写“./dist"
        filename:"aOutPut.js",//输出文件名
        environment:{
            arrowFunction:false //本行是指webpack打包时不使用箭头函数，对于在低版本的浏览器里（如ie11不支持箭头函数），必须加上。
        }
    },
    module:{//指定webpack打包时要使用的模块
        rules:[
            {
                test:/\.ts$/, //test为固定字段，指定本{}内的规则生效的文件，此处为所有的以ts结尾的文件
                use:[//如果只用1个，则可以直接写'ts-loader',如果有多个加载器，则要用数组，执行时从后往前执行，所以应该先转js
                    {//复杂的loader设置，可以写成{}
                        loader:'babel-loader',
                        options:{ //设置信息
                            presets:[
                                [
                                    "@babel/preset-env",
                                    {
                                    //可能在哪些浏览器运行,有了这个之后，就不必配置tsconfig.json里的es版本target了，
                                    //比如这里要支持ie版本11，那么babel会自动转化为老版本的js。所以由于ie11不支持const，所以生成的aOutPut里变成了var o={...}
                                        targets:{"chrome":"88" ,"ie":"11"},
                                        corejs:"3",//corejs版本,比如ie11里没有Promise，所以这里会引用corejs里的Promise
                                        useBuiltIns:"usage"//使用corejs的方式，usage表示按需加载，如果代码里没有用到Promise，那么不会加载core里的Promise
                                    }
                                ]
                            ]
                        }
                    },//
                    'ts-loader'//这个loader是将ts转成js的，
                ],// 用ts-loader处理
                exclude:/node-modules/ ,//排除文件
            }
        ]

    },
    plugins:[
        new CleanWebpackPlugin(),//这一行会在webpack执行前，先清空dist目录
        new htmlWebpackPlugin({
            //这个插件会自动生成一个html文件，好处是，不必每次都去手动修改dist/html，因为可能会生成多个js，会多次修改
            title:"ly写的html里的title" //写一些自定义的html内容,
            // template:"./src/index.html" //自定义的模板，新生成的网页会在这个基础上修改。
        }),
    ],

    //对于webpack，因为ts最终会被打包，所以如果不指定哪些文件会本require的话，可能最后所有的文件都会被打成一个js文件
    //如果有一个a.ts内require了b.ts，那么就会找不到b，因为被打包了，所以这里用一个resolve指定一下：哪些文件可能会被require
    resolve:{
        extensions:[".ts",".js"] //指出所有的ts和js文件都可能会被引用
    }
}
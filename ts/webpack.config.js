const path=require('path')

//使用webpack需要npm install webpack webpack-cli ts-loader typescript
// npm i -D webpack webpack-cli typscript ts-loader (-D表示装到devDependencies里）
//对于想在命令行下使用webpack的，需要npm install -g webpack webpack-cli，安装到全局。
//

module.exports={
    entry:"./src/a.ts", //指定入口文件
    output:{
        path:path.resolve(__dirname,'dist'), //也可以直接写“./dist"
        filename:"aOutPut.js"//输出文件名
    },
    module:{//指定webpack打包时要使用的模块
        rules:[
            {
                test:/\.ts$/, //test为固定字段，指定本{}内的规则生效的文件，此处为所有的以ts结尾的文件
                use:'ts-loader',// 用ts-loader处理
                exclude:/node-modules/ ,//排除文件
            }
        ]

    }
}
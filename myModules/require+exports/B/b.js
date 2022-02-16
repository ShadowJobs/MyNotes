// let a0=require("../A/main0.js")
// let a0=require("../A/main0")
let a0=require("../A") //3种写法都对，require会自动补全.js，
// 如果没有，会到A/package.json里找 main指定的入口，再没有会找A/index.js
//搜索的顺序：node_modules里找名A的包-同名文件夹-package.json指定main，上级node_modules里找A.js
console.log(a0.b)
a0.a()

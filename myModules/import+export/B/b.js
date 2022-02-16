import a from "../A/main0.js" //这里必须带.js，因为是用户自定义的，只有内建模块可以不带js
//a不用写成{a},因为在main0.js里是export default导出的

// import a from "../A" //不能使用这种写法，import的查找方式与require不一样


import {b} from "../A/main0.js" //这里必须加{},只要不是default的都要加
a()
b()
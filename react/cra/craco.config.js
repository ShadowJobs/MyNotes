const path=require('path');

//craco的使用：在不eject的情况下修改webpack的功能。
// 然后在项目里加craco.config.js文件，然后在package.json里把除了eject之外的react-scripts命令修改为craco.
// 如react-scripts start-> craco start

module.exports={
    webpack:{
        alias:{"@":path.resolve(__dirname,'src')}
    }
}

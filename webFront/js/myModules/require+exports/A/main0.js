const a=()=>console.log("liny self defined components library")
console.log("aaaaa")
console.log(module) //module1里
let b=9999
module.exports.a=a
module.exports.b=b
console.log(module) //module2,  可以看到这里的输出多了a和b的内容.  在引用方哪里，得到的就是exports的内容

// 输出为Module {
//     id: '/Users/me/ly/mygit/MyNotes/myModules/require+exports/A/main0.js',
//     path: '/Users/me/ly/mygit/MyNotes/myModules/require+exports/A',
//     exports: { a: [Function: a], b: 9999 },
//     filename: '/Users/me/ly/mygit/MyNotes/myModules/require+exports/A/main0.js',
//     loaded: false,
//     children: [],
//     paths: [
//       '/Users/me/ly/mygit/MyNotes/myModules/require+exports/A/node_modules',
//       '/Users/me/ly/mygit/MyNotes/myModules/require+exports/node_modules',
//       '/Users/me/ly/mygit/MyNotes/myModules/node_modules',
//       '/Users/me/ly/mygit/MyNotes/node_modules',
//       '/Users/me/ly/mygit/node_modules',
//       '/Users/me/ly/node_modules',
//       '/Users/me/node_modules',
//       '/Users/node_modules',
//       '/node_modules'
//     ]
//   }

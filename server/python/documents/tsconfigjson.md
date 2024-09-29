```json
vite配置
{
  "compilerOptions": { // 编译器选项
    "target": "ESNext", // 目标版本
    "useDefineForClassFields": true, // 为类字段使用define
    "lib": ["DOM", "DOM.Iterable", "ESNext"], // 引入的库
    "declaration": true, // 生成对应的.d.ts文件
    "declarationDir": "./dist/types", // 生成对应的.d.ts文件的目录
    "allowJs": true, // 允许使用JS文件. 即js文件也会被编译，并生成对应的.d.ts文件.而js的.d.ts生成规则，可以在js文件里写 JSDoc 注释，见add.js里的注释格式
    "checkJs": true, // 检查JS文件,利用JSDoc注释，可以检查js文件

    "skipLibCheck": true, // "skipLibCheck": true, // 跳过第三方的lib检查，使用 "skipLibCheck": true 不会导致 TypeScript 编译器忽略您的应用代码中的类型错误。它只是跳过了对所有 .d.ts 文件的类型检查。这意味着：
    // 项目中的 TypeScript 代码 (*.ts, *.tsx) 仍然会被完全检查。
    // 来自于第三方声明文件的类型错误不会阻止编译过程。
    // 如果第三方库之间的类型定义有冲突，这些冲突也不会阻碍编译。



    "esModuleInterop": false, // 不使用esModuleInterop
    "allowSyntheticDefaultImports": true, // 允许合成默认导入
    "strict": true, // 严格模式
    "forceConsistentCasingInFileNames": true, // 强制文件名大小写一致
    "module": "ESNext", // 模块类型
    "moduleResolution": "Node", // 模块解析方式
    "resolveJsonModule": true, // 解析JSON模块
    "isolatedModules": true, // 隔离模块
    "noEmit": true, // 不生成输出文件
    "jsx": "react-jsx", // JSX语法
    "baseUrl": ".", // 基本路径
    "paths": {
      "@/*": ["./src/*"] // 路径别名
    }
  },
  "include": ["src"], // 包含的文件
  "references": [{ "path": "./tsconfig.node.json" }] // 引用的tsconfig文件
}


```
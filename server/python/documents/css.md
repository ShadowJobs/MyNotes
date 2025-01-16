# 1. tailwind css 
- 响应式设计友好

## 安装和配置步骤
1. 安装和配置 Tailwind CSS:
```bash
npm install -D tailwindcss postcss autoprefixer
# 生成 Tailwind 配置文件
npx tailwindcss init -p
然后修改tailwind.config.cjs,可以直接参考本项目里的配置
```
2. 创建主 CSS 文件 (src/input.css):
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

3. 在 package.json 中添加构建命令:
```json
  "scripts": {
    "build": "tailwindcss -i ./src/input.css -o ./dist/output.css --watch"
  }
```

4. 在 入口tsx 文件中引入 CSS 文件

## 常用类名说明

### 1. 布局
- `container`: 响应式容器
- `flex`: Flex 布局
- `grid`: Grid 布局
- `hidden/block`: 显示/隐藏

### 2. 间距
- `p-{size}`: padding
- `m-{size}`: margin
- `space-x-{size}`: 水平间距
- `space-y-{size}`: 垂直间距

### 3. 尺寸
- `w-{size}`: 宽度
- `h-{size}`: 高度
- `max-w-{size}`: 最大宽度

### 4. 颜色
- `text-{color}`: 文字颜色
- `bg-{color}`: 背景颜色
- `border-{color}`: 边框颜色

### 5. 响应式前缀
- `sm:`: >= 640px
- `md:`: >= 768px
- `lg:`: >= 1024px
- `xl:`: >= 1280px
- `2xl:`: >= 1536px

## 最佳实践

1. 组件提取
```javascript
// 可以使用 @apply 指令创建可复用的组件样式
@layer components {
  .btn-primary {
    @apply py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600;
  }
}
```

2. 自定义配置
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'brand': '#ff0000',
      },
      spacing: {
        '128': '32rem',
      }
    }
  }
}
```

## 注意事项
开发环境文件可能较大,生产环境会自动优化

# 2. css-in-js 

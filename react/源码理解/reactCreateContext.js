// createContext 和 useContext 是 React 提供的 Context API 的一部分，它们使得组件之间的数据传递更为简单，特别是对于那些需要在许多层次的组件树中传递数据的场景。

// createContext
// createContext 是一个函数，当你调用它时，它会创建一个 Context 对象。当 React 渲染订阅了这个 Context 对象的组件时，它会从组件树中匹配最近的上层 <Provider> 中读取当前的 context 值。

// const MyContext = React.createContext(defaultValue);
// defaultValue 参数是 Context 的默认值，当组件没有匹配到一个上层 <Provider> 时，该值将被使用。
// MyContext 包含了两个重要的元素：Provider 和 Consumer（后者在新版的 React 中不常用，因为新增了 useContext Hook）。
// 使用 Context.Provider 组件可以包裹其他组件，并通过 value 属性来传递数据给所有下层的组件。下层组件无论嵌套有多深，都能访问到由 Provider 提供的数据。

// useContext
// useContext 是 React 提供的一个 Hook，它允许函数组件直接访问 Context 的值，而无需通过 Consumer 组件嵌套。

// const value = useContext(MyContext);
// 你必须确保传递给 useContext 的参数是由 createContext 创建的 Context 对象本身。
// 当 Context 的值发生变化时，使用了 useContext(MyContext) 的所有组件都将重新渲染，并获取到最新的 context 值。
// 示例代码：

import React, { createContext, useContext } from 'react';

// 创建一个 ThemeContext
const ThemeContext = createContext('light');

// 一个使用 ThemeContext 的组件
function ThemedButton() {
  // 直接通过 useContext 获取 context 值
  const theme = useContext(ThemeContext); 
  return <button className={theme}>I am styled by theme context!</button>;
}

function App() {
  // 使用 Provider 包裹子组件，并传递 "dark" 作为当前的 context 值
  return (
    <ThemeContext.Provider value="dark">
      <ThemedButton />
    </ThemeContext.Provider>
  );
}

export default App;
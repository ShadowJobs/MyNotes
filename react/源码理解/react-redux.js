// connect 的原理：
// 获取 store：
// connect 函数通过 React 的上下文（Context）API 获取由 <Provider> 组件提供的 Redux store。<Provider> 包裹在应用的最顶层，并接收一个 store 属性，这样整个应用的任何组件都能够访问到 Redux store。

// 映射状态和派发到 Props：
// 你可以给 connect 传递两个可选的参数：mapStateToProps 和 mapDispatchToProps。

// mapStateToProps 是一个函数，它定义了如何将 Redux store 中的状态转换为组件的 props。每当 store 更新时，mapStateToProps 将被调用。
// mapDispatchToProps 可以是一个函数或对象，它定义了一系列可在组件中调用以触发 dispatch 的 action creators。
// 监听 store 变化：
// connect 使得组件自动订阅 Redux store 的变化。当 Redux store 发生变化时，它会重新计算 mapStateToProps 和 mapDispatchToProps 的结果，并在需要时更新组件的 props，从而触发组件的重新渲染。

// 优化性能：
// connect 通过浅比较前后 mapStateToProps 和 mapDispatchToProps 的结果来避免不必要的重新渲染。

import React, { useContext, useState, useEffect } from 'react';

// 创建一个 Context 以供 Provider 和 connect 使用
const ReduxContext = React.createContext(null);

// Provider 组件，它接收一个 store，并通过 Context API 使得这个 store 在子组件中可用
export function Provider({ store, children }) {
  return <ReduxContext.Provider value={store}>{children}</ReduxContext.Provider>;
}

// connect 函数，接收 mapStateToProps 和 mapDispatchToProps，
// 并返回另一个函数，这个函数接收一个组件并返回一个新的增强组件
export function connect(mapStateToProps, mapDispatchToProps) {
  return (WrappedComponent) => {
    return (props) => {
      const store = useContext(ReduxContext); // 从 Context 获取 store
      const [mappedState, setMappedState] = useState(() =>
        mapStateToProps(store.getState())
      );

      // 订阅 store 的变化
      useEffect(() => {
        const unsubscribe = store.subscribe(() => {
          setMappedState(mapStateToProps(store.getState()));
        });
        return unsubscribe; // 清理订阅
      }, [store]);
      
      // 构造 dispatchProps 对象
      const dispatchProps = mapDispatchToProps
        ? mapDispatchToProps(store.dispatch)
        : { dispatch: store.dispatch };

      // 将 stateProps、dispatchProps 和 ownProps 合并后作为 props 传递给包装的组件
      return <WrappedComponent {...props} {...mappedState} {...dispatchProps} />;
    };
  };
}

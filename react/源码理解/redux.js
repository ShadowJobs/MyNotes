// Redux 是一个用于 JavaScript 应用的状态管理库，其核心原则包括：

// 单一数据源：
// 整个应用的状态存储在一个称为 store 的对象树中。这使得状态更易于管理。

// 状态是只读的：
// 唯一改变状态的方法是派发一个 action。一个 action 是一个带有 type 属性的普通 JavaScript 对象，用于描述发生了什么样的事件。

// 使用纯函数来执行修改：
// 为了指定 store 树如何响应 action 并发送到 store，你需要编写称为 reducers 的纯函数。reducers 接收前一状态与 action，返回新状态。

// createStore 是 Redux 中最关键的方法。它用于创建一个 store 对象, 该对象包含整个应用状态，并提供了对状态进行操作的一些方法。
function createStore(reducer, initialState) {
  let state = initialState;
  let listeners = [];

  // getState 方法返回当前的应用状态。
  const getState = () => state;

  // dispatch 方法接受一个 action（描述发生了什么），然后调用 reducer 函数来计算新的状态。
  const dispatch = (action) => {
    state = reducer(state, action);
    listeners.forEach(listener => listener());
  };

  // subscribe 方法允许外部代码订阅状态变化的通知。
  const subscribe = (listener) => {
    listeners.push(listener);
    return () => { // 返回一个取消订阅的函数
      listeners = listeners.filter(l => l !== listener);
    };
  };

  // 初始化状态
  dispatch({ type: '@@redux/INIT' });

  return { getState, dispatch, subscribe };
}

// combineReducers 是一个辅助函数，它帮助我们组合多个 reducer 到一个单一的 reducing 函数中。
function combineReducers(reducers) {
  return (state = {}, action) => {
    return Object.keys(reducers).reduce(
      (nextState, key) => {
        nextState[key] = reducers[key](state[key], action);
        return nextState;
      },
      {}
    );
  };
}

// 使用示例:
const counterReducer = (state = 0, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    default:
      return state;
  }
};

const todosReducer = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return state.concat([action.text]);
    default:
      return state;
  }
};

// 组合多个 reducers
const rootReducer = combineReducers({
  counter: counterReducer,
  todos: todosReducer
});

// 创建 store
const store = createStore(rootReducer);

// 订阅状态变化
store.subscribe(() => console.log(store.getState()));

// 派发 actions
store.dispatch({ type: 'INCREMENT' }); // 输出: { counter: 1, todos: [] }
store.dispatch({ type: 'ADD_TODO', text: 'Learn Redux' }); // 输出: { counter: 1, todos: ['Learn Redux'] }

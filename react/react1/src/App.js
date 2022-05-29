import logo from './logo.svg';
import './App.css';
import './a.css'
import {BrowserRouter, Link, Route, Routes} from 'react-router-dom'
import {Home} from './pages/Home'
import {List} from './pages/List'
import {User} from './pages/User'
import { NameList } from './pages/subpages/NameList';
import { ScoreList } from './pages/subpages/ScoreList';
import CounterPage1 from './pages/CounterPage1';
import CounterPage2 from './pages/CounterPage2';
import CounterPage3 from './pages/CounterPage3';
import AuthComponent from './pages/AuthComponent';
import { Login } from './pages/login';


function App() {
  console.log(process.env.REACT_APP_DEVELOPMENT_P1)
  return (
    <div className="App">
      <BrowserRouter>
      <ul>
        <li>最简路由，多级路由的简单使用</li>
        <li>使用mobx实现跨组件的通信,store模块化</li>
        <li>
          <ul>路由鉴权：
            <li>用AuthComponent来封装需要鉴权的路径（定义见AuthComponent,使用见App.js）</li>
            <li>AuthComponent里面通过组件跳转，login.js里通过代码跳转，都是通过Navigate来实现的</li>
            <li>另外注意AuthComponent里children的用法</li>
          </ul>
        </li>
      </ul>
      {/* 本行是必须写的，不然下面的router会报错 */}
      <div className='with-border'>
        <Link to="/">首页</Link>
        <span> | </span>
        <Link to="/list">列表</Link>
        <span> | </span>
        <Link to="/user">用户</Link>
        <br/>
        <div className='with-border'>
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/login" element={<Login/> }/>
            <Route path="/list" element={<List/>}>
              <Route path="/list/name" element={<NameList/>}/>
              <Route path="/list/score" element={<ScoreList/>}/>
            </Route>
            <Route path="/user/*" element={<AuthComponent><User/></AuthComponent>}/>
            {/* 注意这里的星号是只有二级嵌套路由，配合User.jsx里的route，那里面的route不能再带/user了 */}
          </Routes>
        </div>
      </div>
      </BrowserRouter>
      <br/>
      <div className='with-border'>
        计数组件，使用mobx
        <br/>
        <CounterPage1/><br/>
        <CounterPage2/><br/>
        注意,npm i mobx mobx-react-lite。      组件1,2都必须使用observer()
        <br/> mobx-react-lite只能在函数组件里使用，要用类组件则应该用npm i mobx-react
      </div>
      <br/>
      <div className='with-border'>
        mobx模块化<br/>
        <CounterPage3/>
      </div>
      <br/>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js  </code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;

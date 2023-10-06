import { Button } from "antd";
import "./css-variable.css"
const CssVariable = () => {
  return <>
    <div>css变量,css条件，import，</div>
    <ul>
      <li>后定义的变量会覆盖先定义的，所以要控制css引入顺序</li>
      <li>局部的会覆盖全局的</li>
      <li>如果你在浏览器开发者工具中调试样式时，不能找到对应的变量，这可能是因为这个变量没有被应用到任何样式上，或者在当前的作用域中不存在</li>
    </ul>
    <div className="cv-first-row啊">拖动浏览器尺寸，当宽度小于500时，css的规则就会生效</div>
    <div className="import-test">css的import会产生请求，但是在antdp里打包时会自动打到一个css里，所以没产生请求</div>
    <div className="calculate">变量计算,计算后padding的值翻倍了</div>
    <div className="third">
      <Button onClick={()=>{
        document.documentElement.style.setProperty('--third-color', 'blue');
      }}>修改</Button>
      点击按钮修改css变量
    </div>

    <div id="id1" className="cl1 cl2 vv">where伪类选择，权重0</div>
    <div id="id2" className="cla1 cla2 vv">使用多个#id2#id2或者.cla1.cla1来提升权重，可以避免使用!important</div>
    <div className="vv ab">not伪类选择，class含cl的都失效</div>
    <div id="id3">
      <div id="parent">
        <h1>直接定义的优先级高于从父节点集成的</h1>
      </div>
    </div>
  </>
}
export default CssVariable;
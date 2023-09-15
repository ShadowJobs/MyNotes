import { useEffect } from "react"
import { Helmet } from "umi";
// tag函数会把模板字符串拆分成数组，参数是拆分后的数组和变量
const TagFunc1 = (strs, ...args: any[]) => {
  console.log(strs, args);//
  return strs[0]
}
const TagFunc2 = (strs, a, b) => {
  console.log(strs);
  console.log(a(true));
  console.log(b);

  return strs[0]
}

export default function JsTest() {
  // 初步用法
  const userInput = "<img src='http://url.to.file.which/not.exist' onerror=alert(document.cookie);>"
  const TagFuncTest1 = () => {
    let b = 2
    var x = `background-color: ${ri => ri ? '#1890ff' : '#fff'}`
    console.log(x); //x里的函数不会执行，直接输出字符串
    TagFunc1`background-color: ${ri => ri ? '#1890ff' : '#fff'};color:"red"`
    TagFunc1`background-color: ${"blue"};color:${"red"}` //本函数结果拆分的数组为["background-color: ",";color:",""]，参数为["blue","red"]
    TagFunc2`background-color: ${ri => ri ? '#1890ff' : '#fff'};color:"red"${b}`
  }
  function htmlEscape(literals, ...substitutions) {
    let result = "";
    // 遍历原始的字符串和占位符
    for (let i = 0; i < substitutions.length; i++) {
      result += literals[i];
      result += escape(substitutions[i]);  // 对用户的输入进行转义处理
    }
    // 添加最后一段文字
    result += literals[literals.length - 1];
    return result;
  }
  function escape(s) {
    return s.replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  useEffect(() => {
    TagFuncTest1();
  }, [])
  return <>
    <Helmet>
      <meta charSet="utf-8" />
      <title>本页面标题被修改了</title>
      <link rel="canonical" href="http://mysite.com/example" />  {/* 用于告诉搜索引擎这个页面的永久链接地址。 */}
      <meta name="description" content="这是一个示例描述" /> {/* 搜索相关 */}
    </Helmet>
    <ul style={{ listStyleType: "decimal" }}>
      <li>tag 函数TagFunc1`backgr${"{2}"}`,请查看代码;模板字符串里如果直接写函数，那么就会直接输出函数字符串；如果传给tag函数，就可以在tag函数中执行</li>
      <li>tag函数用于html <div dangerouslySetInnerHTML={{
        __html: htmlEscape`<div>${userInput}</div>`
      }} /></li>
      <li>Helmet用法，查看源码</li>
    </ul>
  </>
}
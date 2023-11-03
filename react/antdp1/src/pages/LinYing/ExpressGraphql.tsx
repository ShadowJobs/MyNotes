import { ExpressUrl } from "@/global"
import { Button, Divider, Image, message } from "antd"
import { useEffect, useState } from "react"
import { request } from "umi"

const ExpressGraphql = () => {
  const [expressResult, setExpressResult] = useState('')
  const [imgData, setImgData] = useState('' as any)
  const [graphqlResult, setGraphqlResult] = useState({} as any)
  useEffect(async () => {
    console.log('ExpressGraphql')
    const data = await fetch(`${ExpressUrl}/graphql/client?query={ hello }`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    })
      .then(r => r.json())
    console.log(data.data.hello);

  }, [])
  console.log(expressResult);

  const GraphQlButton=(props:{query:string,btn?:string,method?:string})=>{
    const {query,btn,method}=props
    return <Button onClick={async () => {
      const r = method==="post"?await request(`${ExpressUrl}/graphql/client`, {
        method: "post",
        data: { query }
      }):
      await request(`${ExpressUrl}/graphql/client?query={ ${query} }`)
      setGraphqlResult(r)
    }}>
      {btn || query}
    </Button>
  }
  const ExpressButton=(props:{url:string,method?:string,btn?:string})=>{
    const {url,method,btn}=props
    return <Button onClick={async () => {
      const r = await request(`${ExpressUrl}/${url}`, { method: method || "GET", })
      const r2=typeof r==="object"?JSON.stringify(r,null,2):r
      setExpressResult(r2)
    }}>
      {btn || url}
    </Button>
  }
  return (
    <div>
      <h1>express,graphql接口测试</h1>
      ExpressGraphql, return string
      <br />
      <ExpressButton url="helloworld"/>
      <ExpressButton url="job" btn="jobget"/>
      <ExpressButton url="job" method="POST" btn="jobpost"/>
      <ExpressButton url="job/longtime_await" btn="await长任务"/>
      <ExpressButton url="job/longtime_compute" btn="cpu密集"/>
      <ExpressButton url="job/lt_worker_thread" btn="cpu+worker线程"/>
      <ExpressButton url="error2"/>
      <br/>
      <Button onClick={()=>{
        const source = new EventSource(`${ExpressUrl}/stream/eventsource`);
        // EventSource主要方法有：onmessage,onopen,onerror,close,readyState(返回此对象的当前状态，连接未建、正在连接、已经连接或者连接关闭对应的值分别为0, 1, 2, 3.)
        source.onmessage = event=>{
          if(event.data==="close") return source.close() // 当收到后端的close消息时，需要手动关闭连接
          setExpressResult(pre=>pre+event.data)
          setTimeout(() => {source.close()}, 11000);//如果连接断开，浏览器会在约3秒钟后尝试重新连接,并且会不停的重试，所以11秒后关闭连接
        }
      }}>EventSource长连</Button>
      <Button onClick={()=>{
        var xhr = new XMLHttpRequest();
        xhr.open('GET', `${ExpressUrl}/stream/gpt-stream`, true); // 设定请求以及URL
        xhr.onprogress = function(e) { // 设定 onprogress 事件处理器
            var responseText = xhr.responseText; // 获取服务端返回的文本
            setExpressResult(responseText)
        };
        xhr.send(); // 发送请求
      }}>类GPT流</Button>


      <div>Express Req Result is</div>
      <div style={{width:"100%",wordBreak:"break-all"}}>{expressResult}</div>
      <Divider />
      <ExpressButton url="user/12?info=all" btn="params"/>
      <ExpressButton url="readfile" btn="readfile"/>
      <ExpressButton url="rdasync" btn="read async"/>
      <ExpressButton url="write" method="POST" btn="write"/>


      <Divider />
      <div>Test graphql</div>
      <GraphQlButton query="hello"/>
      <GraphQlButton query="ly"/>
      <GraphQlButton query=" user {name age hobbies score{name score}} " btn="user"/>
      <GraphQlButton query=" articles{id title content} " btn="articles"/>
      <GraphQlButton query=' article(id:"7"){id title content} ' btn="article"/>
      <GraphQlButton query='mutation{ addArticle(title:"title4",content:"content4"){id title content} }' btn="addArticle" method="post"/>
      <GraphQlButton query='mutation{ updateArticle(id:"2",title:"title2",content:"content2 updated"){id title content} }' btn="updateArticle" method="post"/>
      <GraphQlButton query='mutation{ deleteArticle(id:"2"){id title content} }' btn="deleteArticle" method="post"/>

      <br />
      <div style={{ whiteSpace: "pre-wrap", wordBreak: "break-all", }}>
        {JSON.stringify(graphqlResult, null, 2)}
      </div>

      <Divider>跨域测试</Divider>
      <Button onClick={async () => {
        const r = await request(`/api-outer-proxy/a.jpg`, { responseType: 'blob' })
        setImgData(URL.createObjectURL(r))
      }}>通过nginx转发到外站</Button>
      <Button onClick={() => {
        try {
          request(`https://www.xyccstudio.cn/ly/a.jpg`)
        } catch (error) {
          message.error(error.message)
        }
      }}>直接请求外站会报cors</Button>
      <br />
      <img src={imgData} alt="" width={200}/>
      要用createObjectURL转换一下
    </div>
  )
}

export default ExpressGraphql

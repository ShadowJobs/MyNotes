import { ExpressUrl } from "@/global"
import { safeReq } from "@/utils"
import { Button, Divider } from "antd"
import { useEffect, useState } from "react"
import { request } from "umi"

const ExpressGraphql = () => {
  const [expressResult, setExpressResult] = useState('')
  const [objResult, setObjResult] = useState({} as any)
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

  return (
    <div>
      <h1>express,graphql接口测试</h1>
      ExpressGraphql, return string
      <br />
      <Button onClick={async () => {
        const r = await safeReq(async () => {
          return await request(`${ExpressUrl}/helloworld`)
        }, null, true)
        setExpressResult(r)
      }}>Helloworld</Button>

      <Button onClick={
        async () => {
          const r = await safeReq(async () => {
            return await request(`${ExpressUrl}/job`)
          }, null, true)
          setExpressResult(r)
        }
      }>
        job get
      </Button>
      <Button onClick={
        async () => {
          const r = await safeReq(async () => {
            return await request(`${ExpressUrl}/job`, {method: "POST",})
          }, null, true)
          setExpressResult(r)
        }
      }>
        job post
      </Button>
      <Button onClick={
        async () => {
          const r = await safeReq(async () => {
            return await request(`${ExpressUrl}/error2`)
          }, null, true)
          setExpressResult(r)
        }
      }>
        Error
      </Button>

      <div>Express Req Result is</div>
      <div>{expressResult}</div>
      <Divider />

      <Button onClick={
        async () => {
          const r = await safeReq(async () => {
            return await request(`${ExpressUrl}/user/12?info=all`)
          }, null, true)
          setObjResult(r)
        }
      }>
        Params
      </Button>
      <Button onClick={
        async () => {
          const r = await safeReq(async () => {
            return await request(`${ExpressUrl}/readfile`)
          }, null, true)
          setObjResult(r)
        }
      }>
        Readfile
      </Button>
      <Button onClick={
        async () => {
          const r = await safeReq(async () => {
            return await request(`${ExpressUrl}/rdasync`)
          }, null, true)
          setObjResult(r)
        }
      }>
        Read Async
      </Button>
      <Button onClick={
        async () => {
          const r = await safeReq(async () => {
            return await request(`${ExpressUrl}/write`, {
              method: "POST",
              data: { a: 1 }
            })
          }, null, true)
          setObjResult(r)
        }
      }>
        Write
      </Button>
      <br />
      Express Object result is
      <div>{JSON.stringify(objResult, null, 2)}</div>

      <Divider/>
      <div>Test graphql</div>
      <Button onClick={
        async () => {
          const r = await safeReq(async () => {
            return await request(`${ExpressUrl}/graphql/client?query={ hello }`)
          }, null, true)
          setGraphqlResult(r)
        }
      }>
        Hello
      </Button>
      <Button onClick={
        async () => {
          const r = await safeReq(async () => {
            return await request(`${ExpressUrl}/graphql/client?query={ ly }`)
          }, null, true)
          setGraphqlResult(r)
        }
      }>
        ly
      </Button>
      <Button onClick={
        async () => {
          const r = await safeReq(async () => {
            return await request(`${ExpressUrl}/graphql/client?query={ user {name age hobbies score{name score}} }`)
          }, null, true)
          setGraphqlResult(r)
        }
      }>
        user
      </Button>
      <Button onClick={
        async () => {
          const r = await safeReq(async () => {
            return await request(`${ExpressUrl}/graphql/client?query={ articles{id title content} }`)
          }, null, true)
          setGraphqlResult(r)
        }
      }>
        articles
      </Button>
      <Button onClick={
        async () => {
          const r = await safeReq(async () => {
            return await request(`${ExpressUrl}/graphql/client?query={ article(id:"2"){id title content} }`)
          }, null, true)
          setGraphqlResult(r)
        }
      }>
        article
      </Button>
      <Button onClick={
        async () => {
          const r = await safeReq(async () => {
            return await request(`${ExpressUrl}/graphql/client`,{
              method:"post",
              data:{query:`mutation{ addArticle(title:"title4",content:"content4"){id title content} }`}
            })
          }, null, true)
          setGraphqlResult(r)
        }
      }>
        addArticle
      </Button>
      <Button onClick={
        async () => {
          const r = await safeReq(async () => {
            return await request(`${ExpressUrl}/graphql/client`,{
              method:"post",
              data:{query:`mutation{ updateArticle(id:"2",title:"title2",content:"content2 updated"){id title content} }`}
            })
          }, null, true)
          setGraphqlResult(r)
        }
      }>
        updateArticle
      </Button>
      <Button onClick={
        async () => {
          const r = await safeReq(async () => {
            return await request(`${ExpressUrl}/graphql/client`,{
              method:"post",
              data:{query:`mutation{ deleteArticle(id:"2"){id title content} }`}
            })
          }
          , null, true)
          setGraphqlResult(r)
        }
      }>
        deleteArticle
      </Button>

      <br/>
      <div style={{ whiteSpace: "pre-wrap",wordBreak: "break-all",}}>
        {JSON.stringify(graphqlResult,null,2)}
      </div>
    </div>
  )
}

export default ExpressGraphql

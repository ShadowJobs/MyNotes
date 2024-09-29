import { PythonUrl } from "@/global"
import { request, useParams } from "umi"
import { MarkdownComp } from "../LinYing/SmallComps"
import { useQuery } from "react-query"

const Document: React.FC = () => {
  const { file } = useParams<{ file: string }>()
  const { data } = useQuery(["file", file], async () => {
    const r = await request(`${PythonUrl}/doc/file/${file}`)
    return r.data
  }, {
    staleTime: 1000 * 3, // 数据在3秒后会陈旧 //这两个时间才是关键，不设置的话，会一直请求
    cacheTime: 1000 * 6, // 缓存在10秒后删除
  })
  return <><MarkdownComp content={data} /> </>
}
export default Document
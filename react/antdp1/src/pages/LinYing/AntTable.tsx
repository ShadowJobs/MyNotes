import ProTable from '@ant-design/pro-table';
import _ from 'lodash';
import { Button, Collapse, message, Slider,Tag } from 'antd';
import React, { useState } from 'react';
import { ProFormSelect } from '@ant-design/pro-form';
// import "./table.less"
import { TestMesObjData } from './TestChartData';
import { DownloadOutlined } from '@ant-design/icons';

const AntTable: React.FC<{ tableResult: any; isMerged: boolean, metricID?: number }> = ({
  tableResult,
  isMerged,
  metricID
}) => {
  tableResult=TestMesObjData.data.find(v=>v.type=="antTable")
  const[tags,setTags]=useState<string[]>([])
  const [data, setData] = useState<any[]>([])
  const headers: string[] = tableResult.headers 
  const [selected, setSelected] = useState<boolean[]>(new Array(tableResult.searchOption?.length || 0).fill(false) );
  const _data: any[] = []


const downloadIcon=(
  <DownloadOutlined
    onClick={() => {
      const csv: (number | string)[] = [];
      const table = tableResult;
      console.log(table.values);
      let headers = table.headers;
      if (!headers) {
        headers = [];
        table.indicators.map((indicator) => {
          Object.keys(table.values[indicator]).map((header) =>
            (headers as string[]).push(header),
          );
        });
        headers = [...new Set(headers)];
      }
      csv.push(['', ...headers].join(','));
      table.indicators.map((indicator) => {
        const row: (string | number)[] = [indicator];
        (headers as string[]).map((header) => {
          let d=table.values[indicator][header]
          if(d=="ddloc" || d=="ddloc_reform" || d=="subpage"){
            // if(row.urlWithParams) //对比专用
            //   return <a href={`/allevaluates/jobs/job/${getStrWithSep(row,"url")}/${getStrWithSep(row,"metric_id")}/${getStrWithSep(row,"ind")}/${getStrWithSep(row,"displayname")}`} target="_blank">{getTransStr("对比")}</a>
            // else 
              row.push(`${window.location.origin}/allevaluates/jobs/job/${d}/${metricID}/${indicator}`)
          }else if(d?.indexOf?.("http")==0){
            row.push(`${window.location.origin}/${d}&metric_id=${metricID}`)
          }else {
            if(d?.replace) row.push(d.replaceAll(',','，'))
            else row.push(d)
          }
        });
        csv.push(row.join(','));
      });
      const csvStr = csv.join('\n');
      const filename = `${table.title}.csv`;
      const link = document.createElement('a');
      link.style.display = 'none';
      link.setAttribute('target', '_blank');
      link.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvStr));
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }}
  />
)
  for (const [key, value] of Object.entries(tableResult.values)) {
    _data.push({ indicator: key, ...value })
  }

  let searchRange:string[]=tableResult.searchRange || []
  let searchSelect:string[]=tableResult.searchSelect || []
  let searchRelate:{searchRange:string[],searchSelect:string[]}=tableResult.searchRelates || {searchRange:[],searchSelect:[]}
  const getTags=(dataArr:any[])=>{
    let headers:string[]=[]
    _.uniq(_data.map(v=>{
      Object.keys(v).map(k=>{
        if(k.indexOf("tags")==0 && v[k].length>0) 
          headers.push(v[k])
      })
    }).flat())
    return _.uniq(headers.flat())
  }
  const refreshFilters = (params?: any) => {
    if(!params) {
      setData(_data)
      setTags(getTags(_data))
      return ;
    }
    let filteredData=_data
    for (const [key, value] of Object.entries(params)) {
      if(key.indexOf('indicator')==0) filteredData=filteredData.filter(v=>v[key].indexOf(value)!=-1)
      else if(key.indexOf('tags')==0 && value && value.length>0) {
        filteredData=filteredData.filter(v=>{
          let hasTag=true;
          for(const tag of value) {
            if(!v[key].includes(tag)){hasTag=false;break;}
          }
          return hasTag;
        })
      }else{
        if(searchSelect.includes(key)){
          filteredData=filteredData.filter(v=>v[key]==value)
          if(isMerged && (searchRelate.searchSelect[key]!=undefined) ) {
            searchRelate.searchSelect[key].map((key2:string)=>{
              filteredData=filteredData.filter(v=>v[key2]==value)
            })
          }
        }else if(searchRange.indexOf(key)!=-1){
          filteredData=filteredData.filter(v=>v[key]>=value[0] && v[key]<=value[1])
          if(isMerged && searchRelate.searchRange[key]){
            searchRelate.searchRange[key].map((key2:string)=>{
              filteredData=filteredData.filter(v=>v[key2]>=value[0] && v[key2]<=value[1])
            })
          }
        }
      }
    }
    setData(filteredData)

    setTags(getTags(filteredData))
    return filteredData.length
  }

  const getColorClass=(d)=>{
    if(d==100) return "mes-value-with-green"
    else if(d>=60) return "mes-value-with-yellow"
    else return "mes-value-with-red"
  }
  const columns:any =[
    {title:"Event 名称",dataIndex:"indicator",className: "tableHead3",key:"indicator",width:"50px",colSize:1,onCell:()=>({ className: "prevent-click"})} , 
    ...(headers.map((head:string) => ({
      title: head, dataIndex: head, key: head, className: "tableHead3",
      // oncell主要是用来设置className,然后通过className来指定css样式， 用于控制格子是否可点击，以及鼠标滑过格子时，同一行的格子是否变色
      onCell: tableResult.withColor && tableResult.withColor.length>0 && head.indexOf(tableResult.withColor[0])!=-1?
        (row, index) => { 
          return { className: getColorClass(row[head])+(head.indexOf("url")!=0?" prevent-click":"")}
      }:(row, index)=>{
        if(typeof row[head]=="string" && (row[head].startsWith("withUrl:")|| row[head].startsWith("innerLink:")|| row[head].startsWith("json:"))){
          return {}          
        }
        return ({ className: head.indexOf("url")!=0?"prevent-click":""})
      },
      render: head.indexOf("url")==0 ? (d, row) => {
        if (d !== undefined && d !== null) {
          return <a href={`/allevaluates/jobs/job/${d}/${metricID}/${row["indicator"]}`} target="_blank">{("前往")}</a>
        }
        return d
      }:head.indexOf("tags")==0?(d,row)=>{
        return  <div>{d.sort && d.sort().map((v,idx)=>{return <Tag color="blue" key={idx}>{v}</Tag>})}</div> //一串tags
      }:(d,row)=>{
        if(typeof d =="object") return d
        if(typeof d =="string"){
           if(d.startsWith("json:")){ //
            const obj:any=JSON.parse(d.slice(5,d.length))
            if(obj.type=="download"){
              return <Button type="link" onClick={async ()=>{
                const result=await (obj.file_path)
                window.open(result.data.url) //下载链接，直接open
              }}>{obj.label || "Download"}</Button>
            }
            return <div></div>
          }
        }
        const [val, delta] = d.toString().split( '/DELTASPLIT/', );
          let idx=delta && (delta[delta.length-1]=="%" ? delta.length-1 : delta.length);
          return <div style={{whiteSpace: isMerged?'pre-wrap':'pre'}} >
            {val} 
            {delta !== undefined && (
              parseFloat(delta.substring(0, idx)) == 0?
                (<p className='anttable-p-value-neutral'>{delta}</p>):
              (parseFloat(delta.substring(0, idx)) > 0?
                (<p className='anttable-compare-up'>▲ {delta}</p>):
              (<p className='anttable-compare-down'>▼ {delta}</p>))
              )}
          </div>
      },
      // 是否可以被搜索
      search:(searchRange.indexOf(head)==-1 && searchSelect.indexOf(head)==-1 && (head.indexOf("tags")!=0 || head.indexOf("Baseline")!=-1))?false:undefined,
      valueType: searchSelect.indexOf(head)!=-1?"select":undefined,//搜索的数据类型
      valueEnum: searchSelect.indexOf(head)!=-1?Object.fromEntries(_.uniq(_data.map(v=>v[head])).map(v=>[v,v])):undefined
      ,renderFormItem: searchRange.indexOf(head)!=-1?  //自定义顶部搜索栏
        (column, { type, defaultRender, ...rest }, form) => {
          if (type === 'form') { return null; }
          let minv=_.min(_data.map(v=>v[head]))
          let maxv=_.max(_data.map(v=>v[head]))
          return (
             <Slider name={head} range min={minv} max={maxv} defaultValue={[minv,maxv]}
              onChange={(v)=>{ form.setFields([{ name: head, value: v }]); }}/> //注意这里的onChange，会传递给filter
          )
        }:head.indexOf("tags")==0?(column, { type, defaultRender, ...rest }, form) => {
          if (type === 'form') { return null; }
          return (<ProFormSelect.SearchSelect placeholderAlign="left" mode="multiple"
            style={{verticalAlign:"left",textAlign:"left"}}
            placeholder=""
            options={tags.map((tag) => { return { value: tag, label: tag } })}
            fieldProps={{ labelInValue: false, }}
          />)
        }:undefined
    }))
  )]
  return (<div>
        点击导出为Excel
        {downloadIcon}
        <ProTable columns={columns} dataSource={data} bordered rowKey="indicator" className='hoverNone'
          pagination={{ pageSize: 20, }} search={{ collapsed: false, span:{xs: 24,sm: 24,md:12,lg: 12,xl: 8,xxl: 6,}}}
          request={async (params: any) => {
            let len=refreshFilters(params)
            return { data: data, success: true, total: len }
          }}
          toolBarRender={tableResult.searchOption?
            () => tableResult.searchOption.map((v,idx)=>{
              return <Button key={idx} type={selected[idx]?'default':'primary'} onClick={()=>{}}>
                {v.key+" "+v.trend}
              </Button>
            })
            :undefined}
        /></div>
  )
};

export default AntTable
import React, { Fragment, useEffect,useCallback, useRef, useState } from 'react';
import { Line, Pie, Column, Bar,G2, Box } from '@ant-design/charts';
import { Col, Collapse, Divider, Image, Row,Input, Space, Spin  } from 'antd';
import { LineConfig } from '@ant-design/charts/es/line';
import { PieConfig } from '@ant-design/charts/es/pie';
import { ColumnConfig } from '@ant-design/charts/es/column';
import { isNumber, max, min } from 'lodash';
import ReactJson from "react-json-view"
const { registerInteraction } = G2;
import _ from 'lodash';
import { formatNumber, safeReq, timestampToDateString } from '@/utils';
import { request } from 'umi';
import AnchorPop from './AnchorPop';
import ChartCard from './chartCard';
export const MaxPageChartNum=6
export const OpenResultPage=true

function aisWheelDown(event) {
  event.gEvent.preventDefault();
  event.gEvent.stopPropagation();
  event.gEvent.originalEvent.preventDefault(); // 阻止 mousewheel 的默认行为
  event.gEvent.originalEvent.stopPropagation(); // 阻止 mousewheel 的默认行为
  return event.gEvent.originalEvent.deltaY > 0;
}
registerInteraction('view-zoom', {
  start: [
    {
      trigger: 'plot:mousewheel',
      isEnable(context) { 
        return aisWheelDown(context.event);
      },
      action: 'scale-zoom:zoomIn',
      throttle: { wait: 20, leading: true, trailing: false },
    },{
      trigger: 'plot:mousewheel',
      isEnable(context) {
        
        return !aisWheelDown(context.event);},

      action: 'scale-zoom:zoomOut',
      throttle: { wait: 20, leading: true, trailing: false },
    },
  ],
  rollback: [{ trigger: 'dblclick', action: ['scale-zoom:reset'] }],
});
registerInteraction('brush', {
  showEnable: [
    { trigger: 'plot:mouseenter', action: 'cursor:crosshair' },
    { trigger: 'plot:mouseleave', action: 'cursor:default' },
  ],
  start: [
    {
      trigger: 'plot:mousedown',
      action: ['brush:start', 'rect-mask:start', 'rect-mask:show'],
    },
  ],
  processing: [
    {
      trigger: 'plot:mousemove',
      action: ['rect-mask:resize'],
    },
  ],
  end: [
    {
      trigger: 'plot:mouseup',
      action: ['brush:filter', 'brush:end', 'rect-mask:end', 'rect-mask:hide'],
    },
  ],
  rollback: [{ trigger: 'dblclick', action: ['brush:reset'] }],
});
registerInteraction('view-drag', {
  showEnable: [
    { trigger: 'plot:mouseenter', action: 'cursor:move' },
    { trigger: 'plot:mouseleave', action: 'cursor:default' },
  ],
  start:[{trigger: 'plot:mousedown',action:"scale-translate:start"} ],
  processing: [{trigger: 'plot:mousemove',action:"scale-translate:translate"}],
  end: [{trigger: 'plot:mouseup',action:"scale-translate:end"}],
  rollback: [{ trigger: 'dblclick', action: ['scale-translate:reset'] }],
});
const commonTypes=['scatter','divider','html','image','map','table','antTable','line','pie','bar','StackArea','box','echart','json',
  'feishu','imageMerge','embeddedPage','nppKanban']
export const GetChartCards:React.FC<{category: string | null,resultData:any,team?:string}> = 
  ({category,resultData,team}) => {
  const initResults=category
    ? resultData.data?.filter((result) => result.category == category)
    : resultData.data;
  // const results=initResults
  const [results,setResults] = useState<any[]>([])
  const [loadIndex, setLoadIndex] = useState(MaxPageChartNum);
  const observerRef = useRef();
  const lastElRef = useCallback((node) => { // 观察最后一个元素
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setLoadIndex(prevIndex => prevIndex + 5); // 每次多加载5个
      }
    });
    if (node) observerRef.current.observe(node);
  },[]);
  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <AnchorPop results={results} setResult={setResults} initResults={initResults} meta={{}} loadAll={()=>setLoadIndex(results.length)}/>
        <Row gutter={[32, 32]}>
          {results?.slice(0, OpenResultPage?loadIndex:results.length).map((result, index) => {
            return commonTypes.includes(result.type) ? <ChartCard result={result} key={result.title+index} team={team}/>:
              <Fragment key={result.title+index}/>
          })}
        </Row>
        {loadIndex < results.length && OpenResultPage && <div ref={lastElRef} style={{textAlign:"center"}}>
          <Spin style={{marginRight:10}}/>Loading more...
        </div>} 
    </Space>
  );
};

const getAnnotationConfgs = (annotation: Mynote.ApiAggLineAnnotation) => {
  const configs = {
    point: {
      type: 'dataMarker',
      position: [
        (annotation as Mynote.ApiDataMarkerAnnotation).x,
        (annotation as Mynote.ApiDataMarkerAnnotation).y,
      ],
      text: {
        content: annotation.label,
      },
      point: {
        style: {
          fill: '#fd961f',
          stroke: '#fd961f',
        },
      },
      autoAdjust: true,
    },
    vertical_line: {
      type: 'line',
      start: [(annotation as Mynote.ApiVerticalLineAnnotation).x, 'min'],
      end: [(annotation as Mynote.ApiVerticalLineAnnotation).x, 'max'],
      text: {
        content: annotation.label,
        position: 'right',
        style: { textAlign: 'right' },
      },
      style: {
        lineDash: [4, 4],
      },
      autoAdjust: true,
    },
    horizontal_line: {
      type: 'line',
      start: ['min', (annotation as Mynote.ApiHorizontalLineAnnotation).y],
      end: ['max', (annotation as Mynote.ApiHorizontalLineAnnotation).y],
      text: {
        content: annotation.label,
        position: 'right',
        style: { textAlign: 'right' },
      },
      style: {
        lineDash: [4, 4],
      },
      autoAdjust: true,
    },
  };

  return configs[annotation.type] ? configs[annotation.type] : {};
};

export const LineChart: React.FC<{
  chart: MesAPI.AggLineChart;
  options: { autofitY: boolean,noScale:boolean 
  mouseover?:Function};
}> = ({ chart, options, mouseover }) => {
  const extraTip=chart.external?.extraTip
  const ref=useRef()
  const data = chart.data
    .map((line) => {
      return line.points.map((point) => {
        const r= {
          ...point,
          label: line.label,
          [chart.x_label]: point.x,
          [chart.y_label]: point.y,
        };
        extraTip?.map(v=>{r[v]=point[v]})
        return r
      });
    })
    .flat();

  const yData = chart.data.map((line) => line.points.map((point) => point.y)).flat(1);
  const yMin = min(yData)
  const yMax = max(yData)//Math.max.apply(Math, yData); 老的方法有内存占用过高，疑似有泄漏

  const annotations = chart.extra?.map((annotation) => getAnnotationConfgs(annotation));
  const config: LineConfig = {
    data,
    ...(chart.external?.pointSize?{point:{size:chart.external.pointSize}}:{}),
    xField: chart.x_label,
    yField: chart.y_label,
    seriesField: 'label',
    xAxis: {
      title: {
        text: chart.x_label,
      },
      label:{
        rotate:chart.external?.xLabel?.rotate || 0,
        offsetX:chart.external?.xLabel?.offsetX || 0,
        offsetY:chart.external?.xLabel?.offsetY || 0,
      }
    },
    yAxis: {
      title: {
        text: chart.y_label,
      },
      min: options.autofitY ? yMin : 0,
      max: yMax,
      label:{
        rotate:chart.external?.yLabel?.rotate || 0,
        offsetX:chart.external?.yLabel?.offsetX || 0,
        offsetY:chart.external?.yLabel?.offsetY || 0,
      }
    },
    meta: {
      ...(chart.external?.xString?{}:{
        [chart.x_label]: { type: 'linear' },
        [chart.y_label]: { type: 'linear' },
      })
    },
    ...(chart.data.filter((line) => line.color !== undefined).length == chart.data.length && {
      color: chart.data.map((line) => line.color as string),
    }),
    ...(annotations && { annotations: annotations }),
    interactions: [
      ...options.noScale?[]: [
        {type:"view-zoom"},
        {type:"view-drag"},
      ],
    ],
    tooltip: extraTip?{
      fields: [chart.y_label,...(extraTip||[])],}
      :{},
  };
  if(chart?.external?.closeAnimation) config.animation=false

  if(chart?.external?.useBigNumFormat){//用这个值来判断调用者来自cloudBI
    config.yAxis.label.formatter=(v)=>formatNumber(parseFloat(v))
  }
  if(chart?.external?.xDate){//用这个值来判断调用者来自cloudBI
    config.xAxis.label.formatter=(v)=>timestampToDateString(Number(v))
  }

  const handleWheel = e => e.preventDefault()
  useEffect(()=>{
    ref.current?.addEventListener('wheel', handleWheel, { passive: false });
    return ()=>ref.current?.removeEventListener('wheel', handleWheel);
  },[])
  return (
    <div ref={ref}>
      <Line {...config} onReady={(plot)=>{
        plot.on('element:click', (e) => {
          if(e.data.data.ptype=="url")
            e.data.data.url && window.open(e.data.data.url,"_blank")

        });
        plot.on('element:mouseover', (e) => {
          console.log(e);
          if(!Array.isArray(e.data.data)){
            mouseover?.(e.data.data.x)
          }
        });
      }}/>
  </div>)
};
export const LevelPie:React.FC<{chart:Mynote.ApiAggLevelPieChart}>=({chart})=> {
  const [data, setData] = useState(chart.data);
  const [crumbs, setCrumbs] = useState(['root']);
  const handleClick=(params)=> {
    if (params.children) {
      setData(params.children);
      setCrumbs(pre=>[...pre, params.label]);
    }
  }
  const getDataByCrumbs=(pathes:string[])=>{
    let d=[...chart.data]
    for(let i=1;i<pathes.length;++i){
      d=[...d.find(v=>v.label==pathes[i]).children]
    }
    return d
  }
  const handleCrumbClick=(index)=> {
    if(index==crumbs.length-1) return
    setData(getDataByCrumbs(crumbs.slice(0, index+1)));
    setCrumbs(pre=>pre.slice(0, index+1));
  }

  const config = {
    appendPadding: 10,
    data: data.map(item => ({ ...item, type: item.label })),
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    // innerRadius: 0.64,
    label: { type: 'inner', offset: '-50%', content: '{value}', style: { textAlign: 'center' }},
    interactions: [{ type: 'pie-legend-active' }, { type: 'element-active' }],
    statistic: { title: false, content: false },
    onReady(plot){
      plot.on('element:click',(event)=>{
        handleClick(event.data.data);
      })
    }
  };
  return (
    <div>
      {crumbs.map((crumb, index) => (
        <span style={{marginRight:5}} key={index} onClick={() => handleCrumbClick(index)}>
          <a>{crumb}</a> {index==crumbs.length-1?"":"|"}
        </span>
      ))}
      <Pie {...config} />
    </div>
  );
}
export const PieChart: React.FC<{ chart: Mynote.ApiAggPieChart }> = ({ chart }) => {
  const data = chart.data.map((pie) => {
    return {
      ...pie,
      type: pie.label,
      value: pie.value,
    };
  });

  const config: PieConfig = {
    appendPadding: 10,
    data: data,
    angleField: 'value',
    colorField: 'type',
    ...(chart.data.filter((pie) => pie.color !== undefined).length == chart.data.length && {
      color: chart.data.map((pie) => pie.color as string),
    }),
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    interactions: [{ type: 'pie-legend-active' }, { type: 'element-active' }],
  };

  return <Pie {...config} onReady={(plot)=>{
    plot.on('element:click',(v)=>{
      if(chart.external?.clickType=="link"){
        v.data.data.url && window.open(v.data.data.url,"_blank")
      }
    })
  }}/>;
};

export const DividerChart: React.FC<{ chart: Mynote.ApiAggDividerChart }> = ({ chart }) => {
  return <Divider orientation={chart.orientation}>{chart.title}</Divider> 
};

//将长字符串折行显示
export function splitStr(str:string,len:number){
  let strArr = str.split("")
  let strLen = strArr.length
  let strArr2 = []
  let str2 = ""
  for(let i=0;i<strLen;i++){
    if(i%len==0&&i!=0){
      strArr2.push(str2)
      str2=""
    }
    str2+=strArr[i]
  }
  strArr2.push(str2)
  return strArr2.join("\n")
}
export const BarChart: React.FC<{ chart: Mynote.ApiAggBarChart,options:{isHorizontal:boolean} ,isMerged:boolean}> = ({ chart,options,isMerged }) => {
  if(options.isHorizontal){
    const data = chart.data.map((bar) => {
      const v= { 
        type: bar.label, 
        value: bar.value,
        mergedIdx:isMerged?bar.type:undefined ,
      };
      if(bar.stackField) v.stackField=bar.stackField
      return v
    });
    // isMerged=true
    // chart.external={isStack:true}
    const _config = {
      data,
      // data: [...(data.map((v,idx)=>({...v,stackField:"g1"}))),...(data.map((v,idx)=>({...v,stackField:"g2"})))],
      xField: 'value', yField: 'type',
      // seriesField: isMerged?'mergedIdx':"type",
      legend: { position: 'top-left' },
      // color:isMerged?undefined:chart.data[0]?.color,//老写法，只读了第一个的颜色，原因未知
      // yAxis: { label: { formatter: (v) => splitStr(v,20) } },
      xAxis: { title: { text: chart.x_label }, 
        label:{
          rotate:chart.external?.xLabel?.rotate || 0,
          offsetX:chart.external?.xLabel?.offsetX || 0,
          offsetY:chart.external?.xLabel?.offsetY || 0,
        }
      },
      yAxis: { title: { text: chart.y_label },
        label:{
          rotate:chart.external?.yLabel?.rotate || 0,
          offsetX:chart.external?.yLabel?.offsetX || 0,
          offsetY:chart.external?.yLabel?.offsetY || 0,
        }
      },
      axis:{position:"top",title:{text:"aaa",position:"start"}},
      barStyle:{ cursor: 'pointer', height:20, },
      // isGroup:isMerged?true:undefined,
      height:data.length*20<200?200:data.length*20,
    };
    if(isMerged){
      _config.isGroup=true;
      if(chart.external?.isStack){
        _config.isStack=true;
        _config.groupField="mergedIdx"
        _config.seriesField="stackField"
      }else{
        _config.seriesField="mergedIdx"
      }
    }else{
      if(chart.external?.isStack){
        _config.isStack=true;
      }else{
        if(chart.data?.[0]?.color) _config.color=chart.data?.map(v=>v?.color)//230331,改成数组？为啥原来只读了第一个的颜色？
      }
      if(chart.external?.isStack && !chart.data?.[0]?.color){
        _config.seriesField="stackField"
      } 
      if(chart.external?.isStack){
        if(!chart.data?.[0]?.color) _config.seriesField="stackField"
      }
      else if(chart.data?.[0].stackField)
        _config.seriesField="stackField"
    }
    // console.log(_config);
    
    return <div><Bar {..._config} /></div>
  }
  const data = chart.data.map((bar) => {
    return {
      type: bar.label,
      value: bar.value,
      mergedIdx:isMerged?bar.type:undefined,
      stackField:bar.stackField,
    };
  });

  const config: ColumnConfig = {
    data: data,
    // data: [...(data.map((v,idx)=>({...v,stackField:"g1"}))),...(data.map((v,idx)=>({...v,stackField:"g2"})))],
    xField: 'type',
    yField: 'value',
    xAxis: { title: { text: chart.x_label, }, },
    yAxis: { 
      title: { text: chart.y_label }, 
      min: isNumber(chart.external?.yMin)?chart.external.yMin:undefined,
      max: isNumber(chart.external?.yMax)?chart.external.yMax:undefined,
      // label: { formatter: (v) => splitStr(v,20) } , // 前面的label，分行显示,原理就是将长字符串拆成\n拼接的字符串，即可实现换行
      
    },
    ...(chart.data.filter((bar) => bar.color !== undefined).length == chart.data.length && {
      color: isMerged?undefined:chart.data.map((bar) => bar.color as string),
    }),

    columnStyle: { radius: [8, 8, 0, 0], }, //圆角柱子
    padding:[20,10,20,40] //整个柱形图的图像部分(canvas)的边距，
    //如果上面的label里position是top那么可能会出现文字超过边界，从而展示不全。这是就需要调整padding
    ,
    scrollbar: {
      type: 'horizontal',
    },
  };
  // isMerged=true
  // chart.external={isStack:true}
  if(isMerged){
    config.isGroup=true;
    if(chart.external?.isStack){
      config.isStack=true;
      config.groupField="mergedIdx"
      config.seriesField="stackField"
    }else{
      config.seriesField="mergedIdx"
    }
  }else{
    if(chart.external?.isStack){
      config.isStack=true;
    }
    config.seriesField=data?.[0]?.stackField?"stackField":undefined
  }

  if(chart?.external?.xDate){//用这个值来判断调用者来自cloudBI
    config.xAxis.label.formatter=(v)=>timestampToDateString(Number(v))
  }
  return <Column {...config} />;
};

const SinglImage: React.FC<{ url:string} >= ({ url }) => {
  const [realUrl,setRealUrl] = useState<string>()
  const getRealPath=async (url:string)=>{
    try {
      const result=(url)
      setRealUrl(result)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(()=>{ getRealPath(url) },[])
  return realUrl?<Image width={300} height={300}
    src={realUrl}
    fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="
  />:<></>
}
export const MmtImage: React.FC<{ tableResult: Mynote.ApiAggImageResult} > 
= ({ tableResult }) => {
  return <div>
      {tableResult.file_path_list.map((v,idx)=>(<SinglImage key={idx} url={v}/>))}
  </div>
}

export const AntBox: React.FC<{result:Mynote.ApiAggBoxChart }> = ({result}) => {
  return (
      <Collapse defaultActiveKey={'1'}><Collapse.Panel header="" key='1'><div style={{width:"100%",overflow:"scroll"}}>
        <Box {...result.data}/>
      </div></Collapse.Panel></Collapse>
  )
};

export const CompareChart:React.FC<{result:{results:Mynote.ApiAggResult[]}}> = ({result}) => {
  const colSpan=24/result.results.length
  return (
      <Collapse defaultActiveKey={'1'}><Collapse.Panel header="" key='1'><div style={{width:"100%",overflow:"scroll"}}>
        <Row>
          {result.results?.map((cResult, index) => {
            return <Col span={colSpan} key={index}>
              {/* {[].includes(cResult.type) ? <ChartCard result={cResult} key={cResult.title+index} />:
              <Fragment key={cResult.title+index}/>} */}
            </Col>
          })}
        </Row>
      </div></Collapse.Panel></Collapse>
  )
};

export const ScatterChart: React.FC= ({ tableResult}) => {
  const data=tableResult.data
  const tips=data.tips || ['x','y','label','t'] 
  // const [scale,setScale] = useState(1);
  // const [startDrag,setStartDrag] = useState(false);
  // const [startPos,setStartPos] = useState<{x:number,y:number}>()
  const [clickLink,setClickLink] = useState<string>("")
  // const dragDiv = React.useRef<HTMLDivElement | null>(null);

  const config = {
    appendPadding: 10,
    data:data.points,
    xField: 'x', yField: 'y',
    size: 2,
    colorField: 'label', // 部分图表使用 seriesField
    color: ({ label }) => data.colors[label],
    yAxis: { nice: true, line: { style: { stroke: '#aaa', }, }, title:{text:tableResult.y_label} ,
      label:{style: { opacity: 0.6, },rotate:0,formatter:v=>(v)},
      // 下一句是设置y的取值范围，不设置的话，y的取值范围是自动计算的。自动计算有个问题是，x和y的比例会失真，比如相同的长度，x表示1-50，y可能表示1-100
      // 导致与原来的比例不一致，所以要设置一个范围，保证x和y的最大减最小是相等的
      // ...(data.min_y==undefined?{}:{min:data.min_y,max:data.min_y+data.width,minLimit:data.min_y,maxLimit:data.min_y+data.width})
    },
    xAxis: {
      grid: {
        line: {
          style: { stroke: '#eee', },
        },
      },
      line: { style: {  stroke: '#aaa', }, },
      title:{text:tableResult.x_label},
      // ...(data.min_x==undefined?{}:{min:data.min_x,max:data.min_x+data.width,minLimit:data.min_x,maxLimit:data.min_x+data.width}),
      label:{ style: { opacity: 0.6, },rotate:0,
        formatter:v=>(v)
      }
    },
    meta: {
      [tableResult.x_label]: { type: 'linear' },
      [tableResult.y_label]: { type: 'linear' },
    },
    tooltip:{
      fields:tips,
      domStyles:{"g2-tooltip-value":{width:"400px",overflow:"hidden"}}, //注意：这里的width不能直接写400，而应该“400px",否则不生效
    },

    // brush:{enabled:true},
    interactions: [
      {type: 'view-zoom',},{type:"view-drag"},//本行为第一种放大方案，监听鼠标滚动和拖动。用了本方案就不能同时设置minx,maxx,miny,maxy了
      // {type:"brush",enabled:true},//第二种方案：将圈出来的区域放大，但是不能拖动（注意要打开上面的brush:{enabled:true}）。同样用了本方案就不能同时设置minx,maxx,miny,maxy了。
    ],
    // interactions: [{ type: 'tooltip', enable: false }]  
  };
  // const onmousedown=(e)=>{
  //   setStartDrag(true)
  //   setStartPos({x:e.clientX+dragDiv.current.scrollLeft,y:e.clientY+dragDiv.current.scrollTop})
  // }
  // const onmousemove=(e)=>{
  //   if(startDrag){
  //     dragDiv.current.scrollTop=startPos.y-e.clientY
  //     dragDiv.current.scrollLeft=startPos.x-e.clientX
  //   }
  // }
  // const onmouseup=(e)=>{setStartDrag(false)}
  // const onwheel=(e)=>{
  //   if(!e.shiftKey) {
  //     // e.stopPropagation()
  //     return 
  //   }
  //   let delta=e.deltaX
  //   if(navigator.userAgent.indexOf("Mac OS X")==-1) delta=e.deltaY
  //   if(delta<0){
  //     if(scale<5 && dragDiv && dragDiv.current) {
  //       setScale(scale+0.5)
  //     }
  //   }else{
  //     if(scale>0.5 && dragDiv && dragDiv.current) {
  //       setScale(scale-0.5)
  //     }
  //   }
  //   e.stopPropagation()
  // }
  const onReadyColumn = (plot: any) => {
    plot.on('element:mousedown', (...args: any) => {
      const data = args[0].data?.data
      console.log(data);
      setClickLink(data.link)
    });
  };
  // registerInteraction('view-zoom', {
  //   start: [
  //     {
  //       trigger: 'plot:mousewheel',
  //       isEnable(context) {
  //         return aisWheelDown(context.event);
  //       },
  //       action: 'scale-zoom:zoomIn',
  //       throttle: { wait: 20, leading: true, trailing: false },
  //     },
  //     {
  //       trigger: 'plot:mousewheel',
  //       isEnable(context) {
  //         return !aisWheelDown(context.event);
  //       },
  //       action: 'scale-zoom:zoomOut',
  //       throttle: { wait: 20, leading: true, trailing: false },
  //     },
  //   ],
  //   rollback: [{ trigger: 'dblclick', action: ['scale-zoom:reset'] }],
  // });
  // registerInteraction('view-drag', {
  //   start:[
  //     {trigger: 'plot:mousedown',
  //       action:"scale-translate:start"
  //     },
  //   ],
  //   processing: [{
  //     trigger: 'plot:mousemove',
  //     action:"scale-translate:translate"
  //   }],
  //   end: [{
  //     trigger: 'plot:mouseup',
  //     action:"scale-translate:end"
  //   }],
  //   rollback: [{ trigger: 'dblclick', action: ['scale-translate:reset'] }],
  // });
  registerInteraction('brush', { //选择时刷新
    showEnable: [
      { trigger: 'plot:mouseenter', action: 'cursor:crosshair' },
      { trigger: 'plot:mouseleave', action: 'cursor:default' },
    ],
    start: [
      {
        trigger: 'plot:mousedown',
        action: ['brush:start', 'rect-mask:start', 'rect-mask:show'],
      },
    ],
    processing: [
      {
        trigger: 'plot:mousemove',
        action: ['rect-mask:resize'],
      },
    ],
    end: [
      {
        trigger: 'plot:mouseup',
        action: ['brush:filter', 'brush:end', 'rect-mask:end', 'rect-mask:hide'],
      },
    ],
    rollback: [{ trigger: 'dblclick', action: ['brush:reset'] }],
  });
  return (
    <div className="page-home">
      adsfas
      {/* <Row>
        <Col span={2}> <div style={{bottom:-5,position:"relative"}}>{getTransStr("缩放")}： {scale}</div> </Col>
        <Col span={22}> <Slider min={0} max={5} defaultValue={1} value={scale} step={0.5} onChange={(v)=>{ setScale(v)}}/> </Col>
      </Row> */}
      {clickLink && <div>CLICKED LINK:<a href={clickLink} target="_blank">{clickLink}</a></div>}
      <div style={{width:700,height:700 ,overflow:"scroll"}} 
      // className={"chart-show-hand"} ref={dragDiv}
        // onMouseDown={onmousedown} onMouseMove={onmousemove} onMouseUp={onmouseup} //自己写的放大缩小和拖动，问题：放大缩小永远都只以（0,0）为锚点，TODO：需要计算坐标。因改用其他方案没做
        onMouseEnter={(e)=>{ document.body.style["overflow"]="hidden"}}
        onMouseLeave={(e)=>{
          document.body.style["overflow"]="auto"
          // onmouseup()
        }}
        // onWheel={onwheel} 
        >
        <Scatter {...config} onReady={onReadyColumn} //本句作用：给点击加监听
        // style={{width:`${scale*100}%`,height:`${scale*100}%`}}  //第一版实现，通过控制style的width和height来实现缩放，
        // 问题是：这么放大后，坐标轴的刻度和位置会跟着放大而消失。
        // 如果想保持刻度，就必须使用组件提供的rect-mask交互事件，但是这么做也有问题，就是不能同时配置minx,maxx,miny,maxy。否则交互react会失效
         />
      </div>
    </div>
  )
};

// 测试apa格式数据的格式是否正确的页面
const TestCharts:React.FC=()=>{
    const [mesStr,setMesStr]=useState("")
    const [TestMesObjData,setData]=useState()
    useEffect(()=>{
      safeReq(async()=>{
        return await request("http://localhost:5000/chart_data")
      },res=>{
        setData(res)
      })
    },[])
    const getJson=(v:string)=>{
        try{
            const result=JSON.parse(v)
            return result
        }catch(e){
            return null
        }
    }
    return <div>
        ObjTest 示例:(数据来源于后端express项目，请先启动项目)
        <ReactJson src={TestMesObjData} name={false} collapsed={true} />
        <Input.TextArea value={mesStr} onChange={(v)=>setMesStr(v.target.value)} rows={5}/> 
        {mesStr && <GetChartCards category={null} resultData={getJson(mesStr)}/>}

    </div>
}
export default TestCharts
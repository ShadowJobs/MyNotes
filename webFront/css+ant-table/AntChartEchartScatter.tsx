
import { getMousePosInElement } from '@/utils/utils';
import { Col, Row, Slider } from 'antd';
import { Line, Pie, Column, Scatter } from '@ant-design/charts';
import ReactEcharts from 'echarts-for-react';
import 'echarts-gl'; //使用scattergl必须引入

export function strTofixed(num:string,n:number=2){ //保留2位小数
  return num.slice(0,num.indexOf(".")+n+1);
}
export function getMousePosInElement(e:any,element:any){ //获取鼠标在某个元素内的相对位置
  let rect = element.getBoundingClientRect()
  let x = e.clientX - rect.left
  let y = e.clientY - rect.top
  return {x,y}
}
export const ScatterChart: React.FC<{ tableResult:any; }> 
= ({ dd }) => {
  const [scale,setScale] = React.useState(1);
  const [startDrag,setStartDrag] = React.useState(false);
  const [startPos,setStartPos] = React.useState<{x:number,y:number}>()
  const [offsetPos,setOffsetPos] = React.useState<{x:number,y:number}>({x:0,y:0})
  const dragDiv = React.useRef<HTMLDivElement | null>(null);
  const tableResult={
    "category": null,
    "x_label": "x轴的标注", //展示在
    "y_label": "y轴的标注",
    "data":{
        "colors":{
            "label1":"green",
            "label2":"#00ff00"
        },
        "points": [
            {
                "label":"label1",
                "x": 39,
                "y": -0.4
            },
            {
                "label":"label2",
                "x": 319,
                "y": 6
            }
        ]
    },
    "title": "顶部标题",
    "type": "scatter",
    label:{ //每个点上展示的文字
      style: {
        fill: 'red',
        opacity: 0.6,
        fontSize: 24
      },
      rotate: true
    },
    legend: { //这个是点的分类，不展示可以直接传false
      layout: 'horizontal',
      position: 'right'//在右侧展示
    },
}
const data=tableResult.data
  const config = {
    appendPadding: 10,
    data:data.points,
    xField: 'x', yField: 'y',
    shape: 'square',size: 2,//点的大小形状
    colorField: 'label', // 部分图表使用 seriesField
    color: ({ label }) => data.colors[label],//定制颜色，只能针对一类一类的点
    yAxis: { nice: true, line: { style: { stroke: '#aaa', }, }, title:{text:tableResult.y_label} ,  //title:"x轴的标注", 展示x轴的下方
      label:{style: { opacity: 0.6, },rotate:0,formatter:v=>(v+"1")} //轴上标尺展示形式
    },
    height:800,
    xAxis: {
      grid: {
        line: {
          style: {
            stroke: '#eee', //中间的网格线的颜色
          },
        },
      },
      line: { style: {  stroke: '#aaa', }, },
      title:{text:tableResult.x_label},
      label:{style: { opacity: 0.6, },rotate:0,formatter:v=>strTofixed(v)}
    },
    meta: {
      [tableResult.x_label]: { type: 'linear' },
      [tableResult.y_label]: { type: 'linear' },
    },
    interactions: [{ type: 'tooltip', enable: false }] //关闭tooltip，可以提升性能

  };

  const onmousedown=(e)=>{
    setStartDrag(true)
    setStartPos({x:e.clientX+dragDiv.current.scrollLeft,y:e.clientY+dragDiv.current.scrollTop})
  }
  const onmousemove=(e)=>{
    if(startDrag){
      dragDiv.current.scrollTop=startPos.y-e.clientY
      dragDiv.current.scrollLeft=startPos.x-e.clientX
    }
  }
  const onmouseup=(e)=>{setStartDrag(false)}
  const onwheel=(e)=>{
    let delta=e.deltaY
    if(navigator.userAgent.indexOf("Mac OS X")==-1) delta=e.deltaY //系统兼容: 按住shift后mac下是deltaX，windows，linux是deltaY
    if(e.deltaY<0){
      if(scale<5 && dragDiv && dragDiv.current) {
        // let pos=getMousePosInElement(e,dragDiv.current)
        // console.log(pos);
        
        // pos.x+=dragDiv.current.scrollLeft
        // pos.y+=dragDiv.current.scrollTop
        // console.log(pos);
        
        // let yOffset=pos.y*(scale+0.5)/scale-pos.y
        // let xOffset=pos.x*(scale+0.5)/scale-pos.x

        // console.log(yOffset,xOffset);
        
        setScale(scale+0.5)
        // dragDiv.current.scrollTop += yOffset
        // dragDiv.current.scrollLeft +=  xOffset
      }
    }else{
      if(scale>0.5 && dragDiv && dragDiv.current) {
        setScale(scale-0.5)
      }
    }
  }
  return (
    <div className="page-home">
      <Row>
        <Col span={2}> <div style={{bottom:-5,position:"relative"}}>缩放：{scale}</div> </Col>
        <Col span={22}> <Slider min={0} max={5} defaultValue={1} value={scale} step={0.5} onChange={(v)=>{ setScale(v)}}/> </Col>
      </Row>
      <div style={{width:700,height:700 ,overflow:"scroll"}} ref={dragDiv} id={"llyy"}
        onMouseDown={onmousedown} onMouseMove={onmousemove} onMouseUp={onmouseup} //鼠标拖动移动div
        onWheel={onwheel} //滚动放大缩小
      >
        antcharts的散点图：
        <Scatter {...config} style={{width:`${scale*100}%`,height:`${scale*100}%`}}/>
        
        echarts的散点图： 
        在react中使用 npm i echarts  echarts-for-react 
        如果使用webgl散点图，npm i echarts-gl
        优势：1 ECharts的性能处理的较好，不卡，是逐步绘制的，一次绘制一部分点，瞬时吃内存也不明显
        2，ECharts可以使用scatterGL，用webgl的方式绘制，一次性提交，使用GPU计算。完全不卡，缺点是有些交互会失效
        注意ReactEcharts必须依赖echarts包，echarts-gl也是
        使用scattergl则必须引入import 'echarts-gl'; 
        <ReactEcharts style={{width:`${scale*100}%`,height:`${scale*100}%`}} 
          option = {{
            tooltip:{position:[10,10,]},
            xAxis: {min:min(config.data.map(d => d.x)),max:max(config.data.map(d => d.x))}, //x轴显示范围
            yAxis: {min:min(config.data.map(d => d.y)),max:max(config.data.map(d => d.y))}, //y轴显示范围
            color:["#00ff00","#ff0000"],
            series:uniq(config.data.map(d => d.label)).map(label => ({
                colorBy: 'series',
                symbolSize: 4,
                data: config.data.filter(v=>v.label==label).map(d => [d.x, d.y]),
                type: 'scatter',  //用webgl的方式：scatterGL，前提：import 'echarts-gl'; 效果：性能会提升几百倍，但是tooltip会失效
            }))
            
          }} 
        ></ReactEcharts>
      </div>
    </div>
  )
};

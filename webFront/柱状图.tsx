import React from 'react';
import { StatisticCard } from '@ant-design/pro-card';
import { Skeleton } from 'antd';
import { Column } from '@ant-design/charts';

const { Statistic } = StatisticCard;

const MyCard: React.FC<{ data?: any[]; title:string;unit:string;danwei:string;formater?:Function;color:string }> = 
  ({ data, title, unit, danwei,formater,color}) => {
  const now = new Date();
  const len=data?.length || 0
  const data1=data?.map((v,index)=>{
    const last = new Date(now.getTime() - (len - index) * 24 * 60 * 60 * 1000);
    const date = last.getMonth() + 1 + '月' + last.getDate() + '日';
    return {date:date,value:v.value}
  })

  const config = {
    height:150,
    data:data1,
    xField: 'date', yField: 'value', //x轴和y轴读取的字段
    color: color,
    // intervalPadding:15,//柱子的间隔
    columnWidthRatio: 0.5,//柱子的间隔
    label: {
      position: 'top',//柱子上的文字展示位置
      offsetY: 10,
      style: { fill: color }, //文字颜色
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: { 
      value: {
        alias: title,
        formatter:formater //值如何展示
      },
    },
    columnStyle: { radius: [8, 8, 0, 0], }, //圆角柱子
    padding:[20,10,20,40] //整个柱形图的图像部分(canvas)的边距，
    //如果上面的label里position是top那么可能会出现文字超过边界，从而展示不全。这是就需要调整padding
  };
  return data ? (
    <StatisticCard title={title}
      chart={<Column {...config} />}
      style={{ height: '100%', borderRadius: 16 }}
      footer={<Statistic value={unit} title={danwei} layout="horizontal" />}
      hoverable
    />
  ) : (
    <StatisticCard style={{ borderRadius: 16 }}>
      <Skeleton active />
    </StatisticCard>
  );
};

export default MyCard;

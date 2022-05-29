
import { Component } from 'react'
import { Button } from 'antd';
import ProList from '@ant-design/pro-list';
export type TableListItem = {
  key: number;
  name: string;
  creator: string;
  createdAt: number;
  age:number;
  firstName:string;
};

import React from 'react';
import { Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable, { TableDropdown } from '@ant-design/pro-table';
import moment from 'moment';
const tableListDataSource: TableListItem[] = [];

const creators = ['付小小', '曲丽丽', '林东东', '陈帅帅', '兼某某'];
for (let i = 0; i < 5; i += 1) {
  tableListDataSource.push({
    key: i,
    name: 'AppName',
    firstName:i+"1",
    creator: creators[Math.floor(Math.random() * creators.length)],
    createdAt: Date.now() - Math.floor(Math.random() * 100000),
    age: Math.floor(Math.random() * 100),
  });
}
tableListDataSource[2].colSpan={name:2,firstName:0}
tableListDataSource[3].rowSpan={name:2}
tableListDataSource[4].rowSpan={name:0}
console.log(tableListDataSource);


const columns: ProColumns<TableListItem>[] = [
  {
    title: '应用名称',
    dataIndex: 'name',
    render: (_) => <a>{_}</a>,
    formItemProps: {
      lightProps: {
        labelFormatter: (value) => `app-${value}`,
      },
    },
    children: [{ //表头的合并使用children，
      title: 'name',
      dataIndex: 'name',
      key: 'name',
      //单元格的合并使用onCell和rowSpan,colSpan
      onCell: (row, index) => ({ rowSpan: row.rowSpan?.name==undefined?1:row.rowSpan?.name,colSpan:row.colSpan?.name || 1}),
    }, {
      title: 'dod',
      dataIndex: 'firstName',
      key: 'firstName',    
      onCell: (row, index) => ({ colSpan:row.colSpan?.firstName==undefined? 1 : row.colSpan?.firstName}),

    }],
  },
  {
    title: '日期范围',
    dataIndex: 'startTime',
    valueType: 'dateRange',
    hideInTable: true,
    initialValue: [moment(), moment().add(1, 'day')],
  },
  {
    title: '创建者',
    dataIndex: 'creator',
    valueType: 'select',
    valueEnum: {
      all: { text: '全部' },
      付小小: { text: '付小小' },
      曲丽丽: { text: '曲丽丽' },
      林东东: { text: '林东东' },
      陈帅帅: { text: '陈帅帅' },
      兼某某: { text: '兼某某' },
    },
  },
  {
    title: (
      <>
        创建时间
        <Tooltip placement="top" title="这是一段描述">
          <QuestionCircleOutlined style={{ marginLeft: 4 }} />
        </Tooltip>
      </>
    ),
    key: 'since',
    dataIndex: 'createdAt',
    valueType: 'date',
    sorter: (a, b) => a.createdAt - b.createdAt,
  },
  {
    title: 'age',
    dataIndex: 'age',
  }
];


export class MergeAntTable extends Component {
  render() {
    return (
      <ProTable<TableListItem>
        columns={columns} 
        // cardBordered
         bordered
        request={(params, sorter, filter) => {
          // 表单搜索项会从 params 传入，传递给后端接口。
          console.log(params, sorter, filter);
          return Promise.resolve({
            data: tableListDataSource,
            success: true,
          });
        }}
        rowKey="key"
        pagination={{ showQuickJumper: true, }}
        search={{ filterType: 'light', }}
        dateFormatter="string"
      />
    );
  }
}


export default MergeAntTable

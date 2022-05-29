



import { Component } from 'react'
import { Table } from 'antd';
import "./antTable.css"
export class AntTable1 extends Component {
    state = { data:[], table_loading:false, };
    getList=async ()=>{
          const result={code:0, data:[ {
                    eventName:"错误的时间1",
                    versions:[ {   version:"0.1.11 | 2022-03-06" , date:"2022-03-06" , 
                            "records":[ {myvtype:"car1",myv1:"76%",myv2:"76%"},
                                {myvtype:"Car2",myv1:"76%",myv2:"76%"},
                            ],
                        }
                    ],
                }
            ]}
          if(result.code==0) {
            let arr:any=[]
            let key=0;
            let eventStartRow=0
            result.data.map((v1,eventI)=>{
                v1.versions.map((v2,versionI)=>{
                    let versionRow=v2.records.length
                    v2.records.map((v3,carI)=>{
                        if(carI!=0) versionRow=0
                        ++key;
                        arr.push({ id:key,       eventName:v1.eventName,
                            version:v2.version,  myvtype:v3.myvtype,  myv1:v3.myv1,
                            myv2:v3.myv2,        versionRow:versionRow,
                            eventRow:0  //eventRow表示第一列合并多少行，会传给下面的rowSpan
                            // 只有合并的第一行是大于0,被合并的行必须等于0，所以如果合并的3行，那么这三行的rowSpan分别为3,0,0
                        })
                    })
                })
                arr[eventStartRow].eventRow=key-eventStartRow
                eventStartRow=key
            })
            //将上面的数据转化为纯数组，key在这里就要指定了，下面的table中的id用这个key，因为本例中没有唯一的id
            this.setState({data:arr})
          }
    }

    async componentDidMount() {
        this.getList()
    }
    
    render() {
        const { table_loading, data } = this.state;
        const columns = [ { 
        //通过className+css来控制表头和首行，css里tableHead的定义是th.tableHead，表示只对头生效，而firstColumn则会对正列生效
          title: 'Event 问题', dataIndex: 'eventName', key: 'eventName', width: '10%',className:"tableHead firstColumn",
          onCell: (row, index) => ({ rowSpan: row.eventRow, })//这个onCell主要是用来计算单元格是否合并，见上
        //坑：合并单元格，antd旧版(4.18以前)写法是放到render里， 如下
        //   render:(value,row,index)=>{
        //     const obj={children:value,props:{}}
        //     obj.props.rowSpan=index%2==0?2:0
        //     return obj
        //   },
        },{
            // 单元格颜色通过normal-column来控制
          title: '版本', dataIndex: 'version', width: '10%',key:"version",className:"tableHead normal-column",
          onCell: (row, index) => ({ rowSpan: row.versionRow,colSpan:index==3?2:1 }),
        },{
            title: '类型', dataIndex: 'myvtype', width: '10%', key:"myvtype",className:"tableHead normal-column",
            render:(d,row,idx)=>{/*d是dataIndex指定的值，row是整个行的obj,idx是索引*/},
            onCell: (row, index) => ({className:row.mpd=="+∞"?"unitColor":null}) //修改某一个单元格的背景色，通过onCell设置className+css来控制
        },{
            title: 'Good', dataIndex: 'myv1', width: '10%', key:"myv1",className:"tableHead normal-column",
        }];
        return (
            <div className="page-home">
                <div className="ant-table-me"> 
                {/* ant-table-me对整体表格生效，这里主要是控制文字大小，必须加!important否则还是会用ant的默认大小 */}
                    <Table columns={columns} dataSource={data} pagination={false} bordered
                        rowKey="id" loading={table_loading} 
                        rowClassName={(record,index)=>{ return index%2==0?"meRed":"meBlue" }}/>
                        {/* 隔行变色，通过变化rowClassName来控制 */}
                </div>
            </div>
        )
    }
}

export default AntTable1



import { Component } from 'react'
import _ from "lodash"
import ProTable from '@ant-design/pro-table';
export class antProtable extends Component {
    state = {
        data: [],
        oriData: [],
        table_loading: false,
        productFilters:  {},
        groupFilters: {},
        eventFilters: {},
        eventNames:[],
    };

    refreshSelectOptions=(data:any)=>{

        let eventFilters: any = {all:{text:"全部"}};
        let productFilters: any = {all:{text:"全部"}};
        let groupFilters: any =  {all:{text:"全部"}};
        let eventNames:any=[];
        data.map((v: any) => {
            eventFilters[v.event_type]={text:v.event_type}
            productFilters[v.product]={text:v.product}
            groupFilters[v.group]={text:v.group}
            eventNames.push(v.event_name)
        })
        eventNames=_.uniq(eventNames)
        this.setState({productFilters,eventFilters,groupFilters,eventNames})
    }
    refreshFilters = (params: any) => {
        let data = this.state.oriData
        if (params.event_name) {
            let ename = params.event_name.trim().toLowerCase();
            if (ename) data = data.filter(v => v.event_name.toLowerCase().indexOf(ename) != -1)
        }
        if (params.event_type && params.event_type != 'all') data = data.filter(v => v.event_type == params.event_type)
        this.setState({ data })
    }
    getList = async () => {
        const result = {
            "code": 0,
            "data": []
        }
        let arr = result.data.map((v: any) => {
            return {
                event_name: v.event_name,
                event_type: v.event_type,
                id: v.id
            }
        }
        )
        this.setState({ data: arr })
        this.setState({ oriData: arr })

        let eventFilters: any = { all: { text: "全部" } };
        this.state.oriData.map((v: any) => {
            eventFilters[v.event_type] = { text: v.event_type }
        })
        this.setState({ eventFilters, }) //筛选项需要先计算好，然后valueEnum里才有值
    }

    async componentDidMount() {
        this.getList()
    }
    plus(v: number) {
        return v < 0 ? Math.abs(v) + "- " : v + "+ "
    }
    getColor(v: number) {
        return v < 0 ? "#ff0000" : "#52c41a"
    }
    getDNode = (v) => {
        return v && (
            <div>{v[0]}
                <sup style={{ color: this.getColor(v[1]) }}>{this.plus(v[1])}</sup>
                | {" " + v[2]}
                <sup style={{ color: this.getColor(v[3]) }}>{this.plus(v[3])}</sup>
            </div>)
    }
    columnClass = "tableHead3 event33-normal-column3"
    render() {
        const proColumns = [
            { title: 'Event 问题', width: 80, dataIndex: 'event_name', className: this.columnClass, },
            {
                title: 'Event 类型', width: 50, dataIndex: 'event_type', className: this.columnClass, valueType: 'select',
                valueEnum: this.state.eventFilters
            },
        ]
        return (
            <div className="table3">
                <ProTable rowKey="id" columns={proColumns} dataSource={this.state.data}
                    request={async (params: any) => {
                        this.refreshFilters(params)
                        return { data: this.state.data, success: true }
                    }}
                    pagination={false} /////去掉分页
                    search={{ labelWidth: 'auto', filterType: 'light' }}
                    scroll={{ x: 1000 }} >
                </ProTable>
            </div>
        )
    }
}

export default antProtable

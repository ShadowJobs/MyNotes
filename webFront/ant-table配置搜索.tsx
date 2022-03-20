

import { Component } from 'react'
import { Table, Button, Input, Drawer, Space, Popconfirm, message } from 'antd';
import { formatDate } from '@/utils/utils';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { deleteReport, reportList } from '@/services/mes/report';
import { tableToExcel } from '@/utils/reportUtil';

// tableToExcel的内容：
// export var tableToExcel = function () {
//     var uri = 'data:application/vnd.ms-excel;base64,',
//         template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
//         base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) },
//         format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) };
//     return function (table:any, name:string, filename:string) {
//         if (!table.nodeType) table = document.getElementById(table)
//         var ctx = { worksheet: name || 'Worksheet', table: table.innerHTML }
//         document.getElementById("dlink").href = uri + base64(format(template, ctx));
//         document.getElementById("dlink").download = filename;
//         document.getElementById("dlink").click();
//     }
//   }()
//   window.tableToExcel=tableToExcel


export class ReportList extends Component {
    state = {
        data:[],
        table_loading:false,
        searchText: '',
        searchedColumn: '',
        selectRow:{}
    };

    getList=async ()=>{
          const result = await reportList();
          if(result.code==0) this.setState({data:result.data})
    }

    async componentDidMount() { this.getList() }

    handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        this.setState({
            searchText: selectedKeys[0],
            searchedColumn: dataIndex,
        });
    };

    handleReset = clearFilters => {
        clearFilters();
        this.setState({ searchText: '' });
    };
    getColumnSearchProps = dataIndex => ({ //通过这个方法返回一个搜索的下拉框
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
          <div style={{ padding: 8 }}>
            <Input ref={node => { this.searchInput = node; }}
              placeholder={`Search ${dataIndex}`}
              value={selectedKeys[0]}
              onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
              onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
              style={{ marginBottom: 8, display: 'block' }}
            />
            <Space>
              <Button type="primary"
                onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                icon={<SearchOutlined />} size="small" style={{ width: 90 }}
              >
                Search
              </Button>
              <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                Reset
              </Button>
              <Button type="link" size="small"
                onClick={() => {
                  confirm({ closeDropdown: false });
                  this.setState({
                    searchText: selectedKeys[0],
                    searchedColumn: dataIndex,
                  });
                }}
              >
                Filter
              </Button>
            </Space>
          </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) =>
          record[dataIndex]
            ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
            : '',
        onFilterDropdownVisibleChange: visible => {
          if (visible) {
            setTimeout(() => this.searchInput.select(), 100);
          }
        },
        render: text =>
          this.state.searchedColumn === dataIndex ? ( 
            <Highlighter
              highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
              searchWords={[this.state.searchText]}
              autoEscape
              textToHighlight={text ? text.toString() : ''}
            />
          ) : ( text ),
      });
    render() {
        const { table_loading, data } = this.state;
        const columns = [ {
            title: 'ID', dataIndex: 'id', key: 'id', width: '5%', ellipsis: true
        },{
          title: 'name', dataIndex: 'display_name', width: '5%', ...this.getColumnSearchProps('display_name')
        },{
          title: '用户', dataIndex: 'user', width: '5%', ...this.getColumnSearchProps('user')
        },{
          title: '日期',
          dataIndex: 'date_time',
          width: '10%',
          sorter: (a, b) => (new Date(a.date_time).getTime()) - (new Date(b.date_time).getTime()),
          defaultSortOrder: 'descend',
          render: d => {
              return <> {formatDate(new Date(d),"yyyy-MM-dd hh:mm:ss")} </>
          }
        },
        {
            title: 'OPERATION',
            dataIndex: 'name',
            width: '10%',
            render: (filename,row) => {
            return ( <div>
                <Button onClick={()=>this.setState({drawerVisible:true,selectRow:row})} type="link">
                    查看
                </Button> </div>)
          }
        } ];
        return (
            <div className="page-home">
                <span ><Button onClick={this.getList} style={{float: 'right', marginTop: 20,marginBottom:20 }}>刷新</Button></span>
                <Table columns={columns} dataSource={data} pagination={false}
                    rowKey="id" loading={table_loading} />
                <div id='pcd' dangerouslySetInnerHTML= {{__html: this.state.selectRow.content}}></div>
                <Button onClick={()=>tableToExcel('tables', 'name', this.state.selectRow.display_name+".xls")} type="primary" >下载报表</Button>
            </div>
        )
    }
}

export default ReportList
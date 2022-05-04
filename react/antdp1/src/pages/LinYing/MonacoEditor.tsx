//注意的点，见下注释
//特别提示，monaco和plugin的
import React from 'react';
import { Card, Row, Col,Space, Button, Select } from 'antd';
import * as _ from 'lodash'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';
import 'monaco-editor/esm/vs/basic-languages/python/python.contribution'; // 1,语法高亮，这么import可以使生成的时候引用的代码只有python的包
let getTransStr=function(v){return v}
class MonacoEditor extends React.Component {
  state = {
    loadings: [false,],
    code: "",
    file: "a.py",
    valid: true,
    timerId: 1,
    codes: [{code:`
    import cv2
    def draw(img, img_info):
        img = cv2.rectangle(img, (10, 10), (100, 100), (0, 0, 255), cv2.LINE_4, 2)
        print("11d1")
        return img
    `,file_name:"a.py"},],
    select_index: 0,
  }
  monacoInstance=null
  editorParentRef: any = React.createRef();
  handleSubmitRun = async () => { 
    const value = this.monacoInstance.getValue(); //2，如何获取编辑器的值
    console.log(value);
  }

  clearTimer = () => {
    if (this.state.timerId) clearTimeout(this.state.timerId)
    this.state.timerId = 0
  }
  handleChange = () => { //每3秒保存1次，防止每次修改都保存
    this.clearTimer(true)
    this.state.timerId = setTimeout(() => {
      const value = this.monacoInstance.getValue(); //
      this.setState({ code: value });
      this.state.timerId = 0
    }, 3000);
  }

  componentDidMount() {
    const fetchCodeList = async () => {
      this.setState({ code: this.state.codes[0].code, select_index: 0 })
      const monacoInstance = monaco.editor.create(this.editorParentRef.current,{
        language:"python", theme:"vs-dark",
        width:"100%", height:"400px",
        value:this.state.codes[0].code, options:{ selectOnLineNumbers: true },
      })
      monacoInstance.onDidChangeModelContent(() => { //3, 监听变化，这么写
        this.handleChange()
      })
      this.monacoInstance=monacoInstance //4，对于不变化的值，可以不放到state里
    }
    fetchCodeList()
  }
  componentWillUnmount(){
    this.monacoInstance.dispose() //5 一定要销毁
    this.clearTimer()
  }
  render() {
    const {codes } = this.state
    return (
        <Row>
          <Col span={12}>
            <Card>
               //6, 注意monaco版本不能是0.33.0，不然编译会报错 ,这部分改动有3处
                1，在package.json中添加
                  "monaco-editor": "^0.26.0",
                  "monaco-editor-webpack-plugin": "^4.0.1"   注意这2个库的版本必须配对好，在网上查一下对应的版本表，不对应的话会报错
                2，在config.ts里配置MonacoWebpackPlugin和chainWebpack
              <br/>
              <Space>
                <Button style={{ marginBottom: 3 }} type="primary" onClick={() => { this.handleSubmitRun() }} loading={this.state.loadings[0]}>{getTransStr("运行")}</Button>
                <Select showSearch placeholder={getTransStr("选择模板")} optionFilterProp="children" value={this.state.select_index}
                  style={{ width: '350px', paddingLeft: "10px", bottom: 3 }}
                  onChange={index => { 
                    this.monacoInstance.setValue(codes[index].code) //7，在外部如何修改编辑器的值
                    this.setState({ code: this.state.codes[index].code, select_index: index, file: this.state.codes[index].file_name })}
                  }
                  filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {codes.map((v: any, idx) => {
                    return <Select.Option value={idx} key={v.file_name}>{v.file_name}</Select.Option>
                  })}
                </Select>
              </Space>
              <div ref={this.editorParentRef} style={{width:"100%",height:500}}/>
            </Card>
          </Col>
        </Row>
    )
  }
}

export default MonacoEditor
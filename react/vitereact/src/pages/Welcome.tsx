import { Divider, Form, Input } from "antd"
import React, { useState } from "react"
import { Button, FormSaver } from "react-comps"
const Welcome: React.FC<{}> = ({ }) => {
  const isLocalhost = window.location.hostname === "localhost"
  const [form] = Form.useForm()
  const [curFormValues, setCurFormValues] = useState<any>()
  return <>
    <div>
      <Button>
        来自自研组件库的按钮
      </Button>
    </div>
    <Divider />
    <FormSaver form={form} dbName="form" curFormValues={{ user: "sdlin", age: 18 }} />
    <Form form={form}
      onFieldsChange={(changedFields: any, allFields: any) => { setCurFormValues(allFields) }}>
      <Form.Item label='user' name='user'><Input /></Form.Item>
      <Form.Item label='age' name='age'><Input /></Form.Item>
    </Form>
    <Divider />
    <div style={{ display: 'flex' }}>
      <div style={{ flexGrow: 1 }}>
        <div><a href={isLocalhost ? "http://localhost:6003" : "/sub"} target="_blank">非qiankun的 react 子项目</a></div>
        <iframe src={isLocalhost ? "http://localhost:6003" : "/sub"} style={{ width: "100%", height: '500px' }}></iframe>
      </div>
      <div style={{ flexGrow: 1 }}>
        <div><a href={isLocalhost ? "http://localhost:6004" : "/vue3"} target="_blank">非qiankun的 Vue3 子项目</a></div>
        <iframe src={isLocalhost ? "http://localhost:6004" : "/vue3"} style={{ width: "100%", height: '500px' }}></iframe>
      </div>
    </div>
  </>
}
export default Welcome
import React, { useState } from 'react';
import { Form, Button, Input, Select, Checkbox, Row, Col, message } from 'antd';

import JsonEditor from './JSONEditor';

export function removeEnter(str:string){
    return str.replace(/\n/g,"")
}
type formValue = {
  display_name?: string;
  data_name?: string;
  tags?: string[];
  params: { content: {}; valid: boolean };
  level2:boolean,
  data_filter: { content: {}; valid: boolean },
};

const DataLakeJob: React.FC<{req:any}> = ({req}) => {
  const [form] = Form.useForm();
  const [refData,setrefData]=useState<any>();

  const handleSubmit = async (values: formValue) => {
    try {
      const submitValues = {
        display_name: values.display_name,
        data_name: values.data_name,
        tags: values.tags,
        data_filter:JSON.parse(removeEnter(refData.current.getText())), 
        //这里的refData是从Editor里面获取的，不能直接从values里获取。注释见JSONEditor.tsx
        use_data_lake:true,
        multi_layer:values.level2,
      };
      await req({ ...submitValues })
    } catch (error:any) {
      console.log(error);
      message.error(error);
    }
  };
  return (
    <>
      <Form name="datalake" onFinish={handleSubmit} form={form} layout="vertical" >
        <Form.Item name="display_name" label="任务名称" > <Input /> </Form.Item>
        <Form.Item name="data_name" label="Data name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="tags" label="标签" > <Select mode="tags"/> </Form.Item>
        <Row><span style={{marginTop:5}}>存储：</span><Form.Item name="level2"> <Checkbox defaultChecked={false} /> </Form.Item></Row>
        <Row gutter={[10,10]}>
          <Col span={12}>
            data_filter:
            <Form.Item name="data_filter">
              <JsonEditor  setref={setrefData} configProps={{ mode: 'code' }} height={300}/>
            </Form.Item>
          </Col>
        </Row>
        <Form.Item> <Button type="primary" htmlType="submit"> 提交 </Button> </Form.Item>
      </Form>
    </>
  );
};

export default DataLakeJob;

import React, { useState, useEffect } from 'react';
import { Row, Col, message, Divider, Card, Form, Select, Input, Button, InputNumber, Upload, Collapse, Space, Alert } from 'antd';

import { PageContainer } from '@ant-design/pro-layout';
import { ExclamationCircleOutlined, UploadOutlined } from '@ant-design/icons';
import confirm from 'antd/lib/modal/confirm';
import ProTable from '@ant-design/pro-table';
import { request } from 'umi';
import { deepCopy } from '@/utils';
import InputTag from './InputTag';

export async function submitRequ(data: any) {
  return request(
    `/uploadUrl`, {
    method: 'POST',
    data,
    requestType: "form",
    ...({}),
  },
  );
}
const UploadFile: React.FC = () => {
  const [template, setTemplate] = useState<any>({});
  const [fileHash, setFileHash] = useState<any>({});
  const [uploading, setUploading] = useState(false);
  const [labels, setLabels] = useState(["l1"])
  const [form] = Form.useForm()

  const getModelTemplates: any = async (model_name: string) => {
    try {
      const result = await (new Promise((resolve) => {
        resolve({
          "file1": {
            "showType": "other", "data_type": "file",
            "default_value": "", "comment": "others"
          },
          "special_configs": {
            "device_id": {
              "showType": "other", "data_type": "int", "default_value": 8,
            },
            "file2": {
              "showType": "other", "data_type": "file", "default_value": "",
            }
          }
        })
      }))
      setTemplate(result)
    } catch (error) {
      console.log(error);
      message.error('获取数据失败')
    }
  }

  useEffect(() => {
    getModelTemplates()
  }, []);
  const addUserValue = (sbmtObj: any, values: any, file_list: any[]) => {
    for (const [k, v] of Object.entries(values)) {
      if (v === undefined) continue
      const keyArr = k.split('.')
      let targetObj = sbmtObj
      for (let i = 0; i < keyArr.length; i++) {
        if (!targetObj[keyArr[i]]) break
        if (i == keyArr.length - 1) {
          if (v && v.file && v.file instanceof File) {
            const file_name = k + "." + v.file.name;
            file_list[file_name] = v.file;
            v = "file:" + file_name;
          }
          if (v != targetObj[keyArr[i]].default_value)
            targetObj[keyArr[i]].value = v
        } else {
          targetObj = targetObj[keyArr[i]]
        }
      }
    }
  }
  const onSubmit = (values: any) => {
    const formData = new FormData();
    formData.append("name11", values.name11);
    formData.append("experiment_description", values.experiment_description);
    const submit_param_obj = deepCopy(template)
    let file_list = {};
    addUserValue(submit_param_obj, values, file_list);
    formData.append("parameters", JSON.stringify(submit_param_obj));
    for (let file in file_list) {
      formData.append(file, file_list[file]);
    }

    setUploading(true)
    submitRequ(formData).then(result => {
      message.success('uplo1ad successfully.');
      setUploading(false)
    })
  };
  const getFormItem = (k: string, v: any) => {
    const uploadProps = {
      onRemove: (file: string) => {
        setFileHash(preHash => {
          const index = preHash[k].indexOf(file);
          const newFileList = preHash[k].slice();
          newFileList.splice(index, 1);
          return { ...preHash, [k]: [] }
        });
      },
      beforeUpload: (file: string) => {
        return false;
      },
      fileHash: fileHash[k],
    };
    return v.data_type ?
      (
        <Form.Item label={(`${k}:` + (v.comment ? `(${v.comment})` : ""))} name={k} key={k} rules={[{ required: k == 'quantizer_input_blobs' }]}>
          {
            v.data_type == 'file' ? <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>Select File</Button>
            </Upload> :
              v.data_type == 'int' ? <InputNumber defaultValue={parseInt(v.default_value)} /> :
                undefined
          }
        </Form.Item>
      ) : (
        <Collapse activeKey={k} key={k} bordered={false}>
          <Collapse.Panel header={k} key={k}>
            {Object.keys(v).map((key, i) => {
              let v2 = v[key]
              if (v2.showType == 'hide' || v2.showType == 'xmodel') return undefined
              return getFormItem(k + "." + key, v2)
            })}
          </Collapse.Panel>
        </Collapse>)
  }
  const onValuesChange = (changeVs, values) => {
    //Form的值改变时触发，第一个值就是变化的值
    if (Object.keys(changeVs)[0] == 'serialized_model_name')
      console.log(changeVs);
  }
  return (<PageContainer>
    开发中
    <Form name="UploadFile" onFinish={onSubmit} form={form} onValuesChange={onValuesChange}>
      <Form.Item label="Labels" name="tags" rules={[{ required: false }]} initialValue={["l1"]}>
        <InputTag value={labels} onChange={setLabels} />
      </Form.Item>
      <Form.Item name="name11" label={("name11")} initialValue={"初始值被Form.item接管，不能用defaultValue"} rules={[{ required: true }]}><Input /></Form.Item>
      {Object.keys(template).filter(key => key != '__version__').map((key, i) => {
        let v = template[key]
        if (v.showType == 'hide' || v.showType == 'xmodel') return undefined
        return getFormItem(key, v)
      })}
      <br />
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={uploading}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  </PageContainer>
  );
};

export default UploadFile;

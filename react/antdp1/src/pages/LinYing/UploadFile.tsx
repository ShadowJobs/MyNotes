import React, { useState, useEffect } from 'react';
import { message, Form, Input, Button, InputNumber, Upload, Collapse } from 'antd';

import { PageContainer } from '@ant-design/pro-layout';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import { request } from 'umi';
import { deepCopy } from '@/utils';
import InputTag from './InputTag';
import { ExpressUrl } from '@/global';

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

const fanStyle = {
  width: '20px',
  height: '20px',
};

const UploadFile: React.FC = () => {
  const [template, setTemplate] = useState<any>({});
  const [fileHash, setFileHash] = useState<any>({});
  const [uploading, setUploading] = useState(false);
  const [labels, setLabels] = useState(["l1"])
  const [progress, setProgress] = useState(0)
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

  // 使用svg抗锯齿
  // 判断是否需要大弧标志（如果角度大于180度，这个值应该是1）
  const largeArcFlag = progress > 50 ? 1 : 0;
  // 将百分比转换成圆的弧度部分
  const angle = (3.6 * progress) * (Math.PI / 180); // 转换成弧度
  const radius = 10; // 圆的半径
  const circleCenterX = radius; // 圆心X坐标
  const circleCenterY = radius; // 圆心Y坐标

  // 计算扇形终点坐标
  const x = circleCenterX + radius * Math.cos(angle);
  const y = circleCenterY + radius * Math.sin(angle);
  // 构建SVG路径
  const d = `
    M ${circleCenterX},${circleCenterY} 
    L ${circleCenterX + radius},${circleCenterY} 
    A ${radius},${radius} 0 ${largeArcFlag} 1 ${x} ${y} 
    Z
  `;
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
    <Button onClick={() => {
      let a = document.createElement('a');
      a.href = `/compress.zip`;
      a.download = 'compress.zip'; //可以重命名
      a.click();
    }}>下载1 a.click() 浏览器进程下载</Button>

    <>
      {(progress > 0 && progress < 100) ? <>
        <div style={{
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          borderColor: 'gray',
          backgroundImage: `conic-gradient(#fa8c16 ${3.6 * progress}deg, transparent ${3.6 * progress}deg)`, // 使用圆锥渐变制作扇形
          WebkitBackdropFilter: 'blur(1px)', // 对于Safari浏览器添加抗锯齿效果
          backdropFilter: 'blur(1px)' // 添加抗锯齿，对于支持backdrop-filter的浏览器
        }}
        ></div>
        <div style={fanStyle}>
          <svg width="20" height="20" viewBox="0 0 20 20">
            <path d={d} fill="blue" />
          </svg>
        </div>
      </> :
        <Button type="primary" icon={<DownloadOutlined />} onClick={() => {
          let url = `${ExpressUrl}/job/bigfile`
          fetch(url)
            .then(response => {
              // 获取总文件大小
              const contentLength = response.headers.get('Content-Length');
              if (!response.body || !contentLength) {
                console.error('无法获取下载进度信息。');
                return response.blob();
              }
              const total = parseInt(contentLength, 10);
              let loaded = 0;
              // 创建一个新的 reader 来读取数据
              const reader = response.body.getReader();
              const stream = new ReadableStream({
                start(controller) {
                  function read() {
                    reader.read().then(({ done, value }) => {
                      if (done) {
                        controller.close(); // 确保流被正确关闭
                        return;
                      }
                      loaded += value.byteLength;
                      console.log(`下载进度：${((loaded / total) * 100).toFixed(2)}%`);
                      setProgress((loaded / total) * 100)
                      controller.enqueue(value); // 将数据段传递到流中
                      read();
                    }).catch(error => {
                      console.error('下载过程中发生错误:', error);
                      controller.error(error);
                    });
                  }
                  read();
                }
              });
              return new Response(stream).blob();
            })
            .then(blob => {
              // 使用Blob创建下载链接，并模拟点击以开始下载
              const blobUrl = window.URL.createObjectURL(blob);
              let a = document.createElement('a');
              a.style.display = 'none';
              a.href = blobUrl;
              a.download = 'a.json'; // 设置下载文件的名称,如果不设置，则不会弹出文件保存框，而是直接在浏览器中打开，可能还是乱码
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              window.URL.revokeObjectURL(blobUrl);
            })
            .catch(error => console.error('下载失败:', error));
        }}>下载2, fetch自行控制下载</Button>}
    </>

  </PageContainer>
  );
};

export default UploadFile;

import { Button, Card, Checkbox, Col, Input, Modal, Row, Select, Tag, Tooltip } from "antd"
const { Option } = Select;
import React, { useEffect, useRef, useState } from 'react';
import { Form } from 'antd';
import './Common.css';
import { Box, Column, Pie } from "@ant-design/charts";
import ReactEcharts from 'echarts-for-react';
import DebounceSelect from "./DebounceSelect";
import MonacoEditor from 'react-monaco-editor';



//props={value,onChange,initOps} //value和onChange是配合Form使用用的,value要绑定到Select上，onChange在改变value时使用，initOps是初始可选择项
class MySelect extends React.Component {
    state = {
        options: [...this.props.initOps],
        tempOptions: [...this.props.initOps]//临时值，只有当用户输入时，才会改变。但是用户逐个输入时，会产生很多临时值，所以这里会在用户选择某一条后，将options里的值覆盖tempOptions
    };

    handleChange = (value) => {//这里是用户点击选择后，触发的函数。触发后，将新的值天假到options，并将options覆盖tempOptions，保证没有无效的值
        console.log(`选择了: ${value}`);
        if (!this.state.options.find(v => v.value == value)) {
            this.state.options.push({ value })
            this.setState({ tempOptions: [...this.state.options] })
        }
        this.props.onChange?.(value) //调用外部的onChange
    };

    handleSearch = (value) => {
        const { tempOptions } = this.state;
        if (!tempOptions.some((option) => option.value === value)) {
            tempOptions.push({ value });//输入一个字符就会产生一条，等于会产生很多无效的值
            this.setState({ tempOptions });
        }
    };
    handleBlur = (value) => {//失去交点式，清理tempOptions
        this.setState({ tempOptions: [...this.state.options] })
    };

    render() {
        const { tempOptions } = this.state;
        return (
            <Select
                style={{ width: "100%" }}
                placeholder="请选择一个选项"
                value={this.props.value} // props.value在这里用，保证内外的同步
                onChange={this.handleChange}
                showSearch
                onSearch={this.handleSearch}
                onBlur={this.handleBlur}
            >
                {tempOptions.map((option) => (
                    <Option key={option.value} value={option.value}>
                        {option.value}
                    </Option>
                ))}
            </Select>
        );
    }
}
// CustomRadioGroup.tsx

interface CustomRadioGroupProps {
    value?: string | string[];
    onChange?: (value: string | null) => void;
    mode?: 'single' | 'multi'
}

const options = ['all', 'success', 'MPD', 'MPI'];
export const CustomRadioGroup: React.FC<CustomRadioGroupProps> = ({ value, onChange, mode = 'single' }) => {
    const [selected, setSelected] = useState<string | string[]>(value || (mode === 'multi' ? [] : ''));

    const handleClick = (option: string) => {
        if (mode === 'single') {
            // 单选模式
            if (selected === option) {
                setSelected('');
                onChange && onChange(null);
            } else {
                setSelected(option);
                onChange && onChange(option);
            }
        } else {
            // 多选模式
            if ((selected as string[]).includes(option)) {
                const newSelected = (selected as string[]).filter((item) => item !== option);
                setSelected(newSelected);
                onChange && onChange(newSelected);
            } else {
                const newSelected = [...(selected as string[]), option];
                setSelected(newSelected);
                onChange && onChange(newSelected);
            }
        }
    };

    return (
        <div>
            {options.map((option) => (
                <Tag.CheckableTag
                    key={option}
                    // className={`custom-button${mode === 'single' ? (selected === option ? ' selected' : '') : ((selected as string[]).includes(option) ? ' selected' : '')}`}
                    checked={mode == 'single' ? (selected === option) : (selected as string[]).includes(option)}
                    onClick={() => handleClick(option)}
                >
                    {option}
                </Tag.CheckableTag>
            ))}
        </div>
    );
};

export const FormCheckbox = (props) => {
    const { value, onChange, ...rest } = props;
    const handleChange = (e) => {
        if (onChange) {
            onChange(e.target.checked);
        }
    };
    return <Checkbox checked={value} onChange={handleChange} {...rest} />
};


export const LevelPie:React.FC<{chart:MesAPI.AggLevelPieChart}>=({chart})=> {
    const [data, setData] = useState(chart.data);
    const [crumbs, setCrumbs] = useState(['root']);
    const handleClick=(params)=> {
      if (params.children) {
        setData(params.children);
        setCrumbs(pre=>[...pre, params.label]);
      }
    }
    const getDataByCrumbs=(pathes:string[])=>{
      let d=[...chart.data]
      for(let i=1;i<pathes.length;++i){
        d=[...d.find(v=>v.label==pathes[i]).children]
      }
      return d
    }
    const handleCrumbClick=(index)=> {
      if(index==crumbs.length-1) return
      setData(getDataByCrumbs(crumbs.slice(0, index+1)));
      setCrumbs(pre=>pre.slice(0, index+1));
    }
  
    const config = {
      appendPadding: 10,
      data: data.map(item => ({ ...item, type: item.label })),
      angleField: 'value',
      colorField: 'type',
      radius: 0.8,
      // innerRadius: 0.64,
      label: { type: 'inner', offset: '-50%', content: '{value}', style: { textAlign: 'center' }},
      interactions: [{ type: 'pie-legend-active' }, { type: 'element-active' }],
      statistic: { title: false, content: false },
      onReady(plot){
        plot.on('element:click',(event)=>{
          handleClick(event.data.data);
        })
      }
    };
    return (
      <div>
        {crumbs.map((crumb, index) => (
          <span style={{marginRight:5}} key={index} onClick={() => handleCrumbClick(index)}>
            <a>{crumb}</a> {index==crumbs.length-1?"":"|"}
          </span>
        ))}
        <Pie {...config} />
      </div>
    );
  }

export const JerkNegMinHistogram = ({ data, mkey }) => {
    const [chartData, setChartData] = useState([]);
    const [xLabels, setXLabels] = useState('-10,-5,-1,0,2,4');

    const handleInputChange = (e) => {
        setXLabels(e.target.value);
    };

    useEffect(() => {
        countValues(data, xLabels);
    }, [data, xLabels]);

    const validateXLabels = (labelsStr) => {
        const pattern = /^(-?\d+(\.\d+)?)(,\s*-?\d+(\.\d+)?)*$/;
        if (!pattern.test(labelsStr)) {
            return false;
        }
        const labelArray = labelsStr.split(',').map((num) => parseFloat(num));
        for (let i = 0; i < labelArray.length - 1; i++) {
            if (labelArray[i] >= labelArray[i + 1]) {
                return false;
            }
        }
        return true;
    };

    const countValues = (data, xLabels) => {
        if (!validateXLabels(xLabels)) {
            setChartData([]);
            return;
        }
        const labels = processXLabels(xLabels);
        let counts = labels.map((label) => [
            { category: label, metricType: 'BaseMetric', count: 0 },
            { category: label, metricType: 'YourMetric', count: 0 }
        ]).flat();
        data.forEach(item => {
            const baseValue = item.baseMetric[mkey];
            const yourValue = item.yourMetric[mkey];
            counts = countHelper(baseValue, 'BaseMetric', counts, xLabels);
            counts = countHelper(yourValue, 'YourMetric', counts, xLabels);
        });
        setChartData(counts);
    };

    const processXLabels = (labelsStr) => {
        const labelArray = labelsStr.split(',');
        const labels = [];

        labels.push(`(-∞, ${parseFloat(labelArray[0])})`); //用parseFloat转换一遍：原因是，如果不转化，02在这儿会被组装成(-∞, 02),而在countHelper()里会被组装成(-∞, 2)，不等了
        for (let i = 0; i < labelArray.length - 1; i++) {
            labels.push(`[${parseFloat(labelArray[i])}, ${parseFloat(labelArray[i + 1])})`);
        }
        labels.push(`[${parseFloat(labelArray[labelArray.length - 1])}, ∞)`);

        return labels;
    };
    const countHelper = (value, metricType, arr, xLabels) => {
        const labelArray = xLabels.split(',').map((num) => parseFloat(num));

        if (value < labelArray[0]) {
            const index = arr.findIndex(item => item.category === `(-∞, ${labelArray[0]})` && item.metricType === metricType);
            arr[index].count++;
        }
        for (let i = 0; i < labelArray.length - 1; i++) {
            if (value >= labelArray[i] && value < labelArray[i + 1]) {
                const index = arr.findIndex(item => item.category === `[${labelArray[i]}, ${labelArray[i + 1]})` && item.metricType === metricType);
                arr[index].count++;
            }
        }
        if (value >= labelArray[labelArray.length - 1]) {
            const index = arr.findIndex(item => item.category === `[${labelArray[labelArray.length - 1]}, ∞)` && item.metricType === metricType);
            arr[index].count++;
        }

        return arr;
    };
    const config = {
        data: chartData,
        xField: 'category',
        yField: 'count',
        isGroup: true,
        seriesField: 'metricType',
        height: 400,
        xAxis: {
            type: 'category',
            label: {
                autoRotate: false,
            },
        },
    };

    return (
        <Card>
            <Input placeholder="Enter comma-separated numbers" value={xLabels} onChange={handleInputChange} />
            <Column {...config} />
        </Card>
    );
};


export const JerkNegMinBoxPlot = ({ data, mkey }) => {
    const average = (arr) => arr.reduce((sum, value) => sum + value, 0) / arr.length;
    const quantile = (arr, q) => {
        const sorted = arr.slice().sort((a, b) => a - b);
        const pos = (sorted.length - 1) * q;
        const base = Math.floor(pos);
        const rest = pos - base;
        if (sorted[base + 1] !== undefined) {
            return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
        } else {
            return sorted[base];
        }
    };
    const prepareData = (data) => {
        const baseMetricValues = data.map((item) => item.baseMetric[mkey]);
        const yourMetricValues = data.map((item) => item.yourMetric[mkey]);
        return [{
            x: "BaseMetric", low: Math.min(...baseMetricValues), q1: quantile(baseMetricValues, 0.25), mid: average(baseMetricValues),
            q3: quantile(baseMetricValues, 0.75), high: Math.max(...baseMetricValues)
        }, {
            x: "YourMetric", low: Math.min(...yourMetricValues), q1: quantile(yourMetricValues, 0.25), mid: average(yourMetricValues),
            q3: quantile(yourMetricValues, 0.75), high: Math.max(...yourMetricValues)
        }];
    };
    const boxData = prepareData(data);
    const config = {
        data: boxData,
        xField: 'x',
        yField: ['low', 'q1', 'mid', 'q3', 'high'],
        outliersStyle: { fill: '#f6f', },
        height: 430
    };

    return <Card><Box {...config} /></Card>
};

export const FreeEchart:React.FC<{result:MesAPI.AggFreeEchart}>=({result})=>{
    const customizeFuncs={
      "customize_adas_1":function (params) {
        const tip = params[0].data.tip;
        return `x: ${params[0].name}<br>${params[0].marker}y: ${params[0].value}<br>提示: ${tip}`;
      }
    }
    return <div>
        echart自定义tooltip函数
        {result.data &&
        <ReactEcharts option = { {...result.data,
            toolbox : {feature:{dataZoom:{show:true}}},
            tooltip : result.data.tooltip?
                {
                ...result.data.tooltip,
                formatter:result.data.tooltip.func?customizeFuncs[result.data.tooltip.func]:undefined
                }:
                {show:true,trigger:'axis'}
            }}
            style={{
                height:result.external?.echartHeight?(result.external.echartHeight):500,
                width:result.external?.echartWidth?(result.external.echartWidth):500,
            }}
        />
    }</div>
  }

  const MonacoTest = () => {
    const [visible, setVisible] = useState(false);
    const [editorCount, setEditorCount] = useState(2);
    const editorRefs = useRef([]); //useRef默认值可以是单个，null，也可以是个数组[],或hash{}
  
    useEffect(() => {
      if (visible) {
        //这里的current就是[]
        editorRefs.current.forEach((editorRef) => {
          if (editorRef) {
            editorRef.layout(); //重新渲染
          }
        });
      }
    }, [visible]);
  
    const onEditorDidMount = (editor, index) => {
      editorRefs.current[index] = editor;
    };
  
    return (
      <div>
        <Button onClick={() => setVisible(true)}>Open Modal</Button>
        <Modal visible={visible} onCancel={() => setVisible(false)} footer={null} width="80%">
          <div>
            {Array.from({ length: editorCount }).map((_, index) => (
              <div key={index} style={{ width: '100%', height: '200px', marginTop: index === 0 ? 0 : 16 }}>
                <MonacoEditor
                  language="json"
                  theme="vs"
                  options={{ selectOnLineNumbers: true }}
                  editorDidMount={(editor) => onEditorDidMount(editor, index)}
                />
              </div>
            ))}
          </div>
        </Modal>
      </div>
    );
  };
const barBoxData=[
    {
        "Bag name": "PLEBW377_event_manual_recording_20230407-102446_0.bag",
        "Base Result": "success",
        "Download Command": "None",
        "Your Result": "success",
        "base_checker_result": [],
        "base_message": "",
        "comments": [],
        "consistent": true,
        "tag": [],
        "your_checker_result": [],
        "your_message": "",
        "baseMetric": {
            "jerk_neg_min": -0.2786413020359496
        },
        "yourMetric": {
            "jerk_neg_min": -0.2786413020359496
        },
        "idx": 39
    },
    {
        "Bag name": "PLEBE733_event_manual_recording_20230406-182601_0.bag",
        "Base Result": "success",
        "Download Command": "None",
        "Your Result": "success",
        "base_checker_result": [],
        "base_message": "",
        "comments": [],
        "consistent": true,
        "tag": [],
        "your_checker_result": [],
        "your_message": "",
        "baseMetric": {
            "jerk_neg_min": -0.7382167611943058
        },
        "yourMetric": {
            "jerk_neg_min": -0.7382167611943058
        },
        "idx": 40
    },
    {
        "Bag name": "PLUA5802_event_manual_recording_20230404-134336_0.bag",
        "Base Result": "success",
        "Download Command": "None",
        "Your Result": "success",
        "base_checker_result": [],
        "base_message": "",
        "comments": [],
        "consistent": true,
        "tag": [],
        "your_checker_result": [],
        "your_message": "",
        "baseMetric": {
            "jerk_neg_min": -1.7216385666347562
        },
        "yourMetric": {
            "jerk_neg_min": -1.4319760105262216
        },
        "idx": 41
    },
    {
        "Bag name": "PLE9X4R7_event_manual_recording_20230203-164545_0.bag",
        "Base Result": "success",
        "Download Command": "None",
        "Your Result": "success",
        "base_checker_result": [],
        "base_message": "",
        "comments": [],
        "consistent": true,
        "tag": [],
        "your_checker_result": [],
        "your_message": "",
        "baseMetric": {
            "jerk_neg_min": -0.4227291562008433
        },
        "yourMetric": {
            "jerk_neg_min": -0.4156026668599247
        },
        "idx": 42
    },
    {
        "Bag name": "PLE9X4R7_event_manual_recording_20230111-102213_0.bag",
        "Base Result": "success",
        "Download Command": "None",
        "Your Result": "success",
        "base_checker_result": [],
        "base_message": "",
        "comments": [],
        "consistent": true,
        "tag": [],
        "your_checker_result": [],
        "your_message": "",
        "baseMetric": {
            "jerk_neg_min": -2.3335658771052192
        },
        "yourMetric": {
            "jerk_neg_min": -2.3335658771052192
        },
        "idx": 43
    }
]
const SmallComps: React.FC = () => {
    const [form] = Form.useForm();
    const [sid,setSid]=useState(1)
    const handleChange = (value: string | null) => {
        console.log(`Selected value: ${value}`);
    };
    return <>
        改造后的Select组件，可以在单选的前提下，同时支持1，由可选的options，2能自己输入新值
        <MySelect initOps={[{ value: 'A' }, { value: 'B' }]} />
        Select如何折行显示,搜索不搜索value，而是搜索label
        <Select style={{ width: 300 }} optionFilterProp="label" showSearch>
            {
                [{ label: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa111111111111111111111111", value: 1 },
                { label: "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb2222222222222222222222222", value: 2 }]
                    .map(v => <Select.Option {...v}>
                        <div style={{ wordBreak: "break-all", whiteSpace: "normal" }}>{v.label}</div>
                    </Select.Option>)
            }
        </Select>
        <Tooltip title={"超长字符串省略+tip写法 啊；发送端发；氨基酸的； 发；三大纠纷；就阿斯；东方今典杀戮空间发牢骚大军阀；了解阿斯蒂芬撒大家；发 "}>
            <h3 style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', maxWidth: 200}}
            >
                超长字符串省略+tip写法 啊；发送端发；氨基酸的； 发；三大纠纷；就阿斯；东方今典杀戮空间发牢骚大军阀；了解阿斯蒂芬撒大家；发 
            </h3>
        </Tooltip>
        <Form form={form} layout="vertical">
            <Form.Item label="Status (Single)" name="statusSingle">
                <CustomRadioGroup mode="single" onChange={handleChange} />
            </Form.Item>
            <Form.Item label="Status (Multi)" name="statusMulti">
                <CustomRadioGroup mode="multi" onChange={handleChange} />
            </Form.Item>
            <Form.Item label="改造后的checkbox，支持配合Form.item使用" name="checkbox" initialValue={true}>
                <FormCheckbox />
            </Form.Item>
        </Form>
        <Row>
            <Col span={12}>
                注意箱体图的5个点：依次为最下到最上
                <JerkNegMinBoxPlot mkey={"jerk_neg_min"} data={barBoxData} />
            </Col>
            <Col span={12}>
                注意输入：用户输入的1,2,3会被转化为x轴的区间坐标
                <JerkNegMinHistogram data={barBoxData} mkey={"jerk_neg_min"}/>
            </Col>
            <FreeEchart result={{
                "category": null,
                "data": {
                    "xAxis": {
                        "type": "category",
                        "data": ["Mon","Tue","Wed","Thu",'Fri']
                    },
                    tooltip:{show:true,trigger:'axis',func:'customize_adas_1'},
                    "yAxis": {"type": "value"},
                    "series": [
                        {
                            "data": [{value:820,tip:"1"},{value:932,tip:"2"},{value:901,tip:"a"},{value:934,tip:"b"},{value:1290,tip:"c"}],
                            "type": "line",
                        }
                    ]
                },
                "external": {"span":12},
                "title": "Test",
                "type": "echart"
            }}/>
            防抖搜索Select，可翻页
            <DebounceSelect value={sid} showSearch
                placeholder="Select onnx"
                fetchOptions={async(params)=>{
                    //请求翻页，params={offset:0,pageSize:10},模拟接口
                    if(params.offset==0)
                        return [{label:1,value:1},{label:2,value:2},{label:3,value:3},{label:4,value:4},{label:5,value:5},{label:6,value:6},{label:7,value:7},{label:8,value:8},
                            {label:9,value:9},{label:10,value:10}]
                    else if(params.offset==10)
                        return [{label:11,value:11},{label:12,value:12},{label:13,value:13},{label:14,value:14},{label:15,value:15},{label:16,value:16},{label:17,value:17}]
                    else return []
                }}
                onChange={async (newValue) => {
                    // const selected = onnxList.find(v => v.id == newValue.value)
                    console.log(newValue);
                    

                }}
                style={{ width: '100%' }}
            />
            在Modal弹框里嵌入MonacoEditor（model lab这儿掉坑里，monaco显示不出来）
            解决方法见MonacoTest
            <MonacoTest/>
            <br/><br/>
            <Col span={24}>
                可层级展开的饼图
                <LevelPie chart={{      
                    "external": {"span":12},
                    "category": null,
                    "data": [
                        {"color": "#FBF8CC","label": "Shanghai","value": 131,children:[
                        {"color": "#E9EDC9","label": "huangpu","value": 30},
                        {"color": "#CFBAF0","label": "jingan","value": 40},
                        {"color": "#98F5E1","label": "hongkou","value": 61,children:[
                            {"color": "#E9EDC9","label": "a","value": 20},
                            {"color": "#CFBAF0","label": "b","value": 41},
                        ]}
                        ]},
                        {"color": "#E9EDC9","label": "Baoding","value": 64},
                        {"color": "#CFBAF0","label": "Shenzhen","value": 7},
                        {"color": "#98F5E1","label": "unknown","value": 66},
                    ],
                    "title": "Distribution: level city",
                    "type": "levelPie"
                }}/>
            </Col>
        </Row>
    </>
}





export default SmallComps

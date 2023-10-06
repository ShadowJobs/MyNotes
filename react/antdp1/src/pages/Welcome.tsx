import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Alert, Typography, Button, Space, Divider } from 'antd';
import { useIntl, FormattedMessage } from 'umi';
import styles from './Welcome.less';
import { eliminateAsyncCall, savePageWithStyles } from '@/utils';
import { useQuery } from 'react-query';
import { fetchReQuery } from '@/services/myExpressApi/express1';
import { ExpressUrl } from '@/global';


const CodePreview: React.FC = ({ children }) => (
  <pre className={styles.pre}>
    <code>
      <Typography.Text copyable>{children}</Typography.Text>
    </code>
  </pre>
);
const getAsyncJobData = async () => {
  const res = await fetch(`${ExpressUrl}/job/objdata`);
  res.json().then(res=>console.log(res));
}
const getJobData=()=>{
  // 非await的fetch重写，见utils.ts
  const result = fetch(`${ExpressUrl}/job/objdata`)
  console.log(result);
}
const Welcome: React.FC = () => {
  const intl = useIntl();
  const { data, status } = useQuery('todos', fetchReQuery,{
    enabled:true, //默认为true，也就是开启了缓存，加载时会请求1次
    staleTime: 1000 * 3, // 数据在3秒后会陈旧
    cacheTime: 1000 * 6, // 缓存在10秒后删除
    retry: 1, // 失败后重试次数
    refetchOnWindowFocus:false,// 窗口聚焦时是否自动刷新
    refetchOnMount: false, // 组件挂载时是否自动刷新
    refetchOnReconnect: false, // 断网重新连接后是否自动刷新
    refetchInterval: false, // 自动刷新的时间间隔
    refetchIntervalInBackground: false, // 页面在后台时是否自动刷新
    // initialData: '初始数据,设置了之后，默认第一次不会请求数据，而是直接使用这个数据，点击强制获取可更新数据', 
  });
  const [fileTxt,setfileTxt]=React.useState<string>('')

  const getBigFile=async ()=>{
    const result =await fetch(`${ExpressUrl}/job/bigfile`) //第一次await只是head部分，第二次await res.json()才是body部分,但是json会等所有的数据都到达才返回
    const reader = result.body?.getReader();
    const decoder = new TextDecoder('utf-8');
    while(true){
      const r = await reader?.read();//这次是read的body部分
      if(r?.done) break;
      const txt = decoder.decode(r?.value);
      // setfileTxt(pre=>pre+txt) //正常情况下数据应该是这种方式获取，因为每次read之后数据就会丢弃
      setfileTxt(txt)//这里只读取最后一次的结果，方便展示的时候看到变化

    }
  }
  
  return (
    <PageContainer>
      画一个圆环
      <div style={{border:"10px solid blue",borderRadius:20,width:40,height:40}}></div>
      <Space>
        <Button onClick={savePageWithStyles}>保存,导出当前页面</Button>
        <a href="/LinYing/JsTest">测试Helmet</a>
        <Button><a href="/responsiveTest">响应式原理</a></Button>
        <Button type="primary" onClick={()=>{
          if(localStorage.getItem('pro-sidebar-collapsed')?.toLocaleLowerCase() === 'true')
            localStorage.setItem('pro-sidebar-collapsed',"false")
          else
            localStorage.setItem('pro-sidebar-collapsed',"true")
          window.location.reload();
        }} >显、隐菜单</Button>
      </Space>
      <div><Space>
        <Button onClick={getAsyncJobData}>异步fetch</Button>
        <Button onClick={()=>eliminateAsyncCall(getJobData)}>非await的fetch</Button>
      </Space></div>
      <div><Space>
        <Button onClick={getBigFile}>字节流请求大文件</Button>
      </Space>
      <div style={{height:100,overflow:"scroll"}}>{fileTxt}</div>
      </div>
      <Divider/>
      <div>
        <div>React query测试</div>
          <div>另一个共享本react-query的页面在LinYing/JsTest里</div>
          <div>status: {status}</div>
          {status==="loading" ? <div>loading...</div>:
          status==="error" ? <div>error</div>:
          <div>
            <div>data: {data?.data}</div>
          </div>}
      </div>
      <Card>
        <Alert
          message={intl.formatMessage({
            id: 'pages.welcome.alertMessage',
            defaultMessage: 'Faster and stronger heavy-duty components have been released.',
          })}
          type="success"
          showIcon
          banner
          style={{
            margin: -12,
            marginBottom: 24,
          }}
        />
        <Typography.Text strong>
          <FormattedMessage id="pages.welcome.advancedComponent" defaultMessage="Advanced Form" />{' '}
          <a
            href="https://procomponents.ant.design/components/table"
            rel="noopener noreferrer"
            target="__blank"
          >
            <FormattedMessage id="pages.welcome.link" defaultMessage="Welcome" />
          </a>
        </Typography.Text>
        <CodePreview>yarn add @ant-design/pro-table</CodePreview>
        <Typography.Text
          strong
          style={{
            marginBottom: 12,
          }}
        >
          <FormattedMessage id="pages.welcome.advancedLayout" defaultMessage="Advanced layout" />{' '}
          <a
            href="https://procomponents.ant.design/components/layout"
            rel="noopener noreferrer"
            target="__blank"
          >
            <FormattedMessage id="pages.welcome.link" defaultMessage="Welcome" />
          </a>
        </Typography.Text>
        <CodePreview>yarn add @ant-design/pro-layout</CodePreview>
      </Card>
    </PageContainer>
  );
};

export default Welcome;

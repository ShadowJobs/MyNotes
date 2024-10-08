import type { Settings as LayoutSettings, MenuDataItem } from '@ant-design/pro-layout';
import { getMenuData, SettingDrawer } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import type { RunTimeLayoutConfig } from 'umi';
import { history, Link, NavLink, request } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import { currentUser as queryCurrentUser } from './services/ant-design-pro/api';
import { BookOutlined, LinkOutlined } from '@ant-design/icons';
import defaultSettings from '../config/defaultSettings';
import React from 'react';
import * as allIcons from '@ant-design/icons';
import { QueryClient, QueryClientProvider } from 'react-query';
import confirm from 'antd/lib/modal/confirm';
import { Button, Tooltip } from 'antd';
import { PythonUrl } from './global';
import routes from '../config/routes';

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

// Notes: 根据字符串获取一个icon，用到React的createElement
const fixMenuItemIcon = (menus: MenuDataItem[], iconType = 'Outlined'): MenuDataItem[] => {
  menus.forEach((item) => {
    const { icon, children } = item
    if (typeof icon === 'string') {
      let fixIconName = icon.slice(0, 1).toLocaleUpperCase() + icon.slice(1) + iconType
      item.icon = React.createElement(allIcons[fixIconName] || allIcons[icon])
    }
    children && children.length > 0 ? item.children = fixMenuItemIcon(children) : null
  });
  return menus
};
/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const msg = await queryCurrentUser();
      return msg.data;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };
  const fetchMenu = async () => {
    const r = await request(`${PythonUrl}/doc/file-list`)
    const { breadcrumb, menuData } = getMenuData(
      routes,
    );
    // const docMenu = {name: "Documents", path: "docs",routes:[]}
    // for (const item of r.data) {
    //   docMenu.routes.push({name: item,path: item,component: "./LinYing/Document",})
    // }
    // console.log("docMenu",docMenu)
    // 往routes的添加，就会添加很多个，这里routes里用:file匹配所有，所以在menu里再添加多个file，实现1个route匹配多一个menuItem
    // routes.find((item) => item.name === '2024').routes?.push(docMenu) 
    const docRoutes = menuData.find(v => v.name == "Documents")
    docRoutes.children = []
    r.data?.map((item: string) => {
      docRoutes.children.push({ name: item, path: item })
    })
    // console.log("menuData",menuData)
    return menuData
  }
  const menuData = await fetchMenu(); //动态菜单可以这样获取，并放到返回值的menuData里
  // 如果是登录页面，不执行
  if (history.location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings,
      menuData: menuData || []
    };
  }
  return {
    fetchUserInfo,
    settings: defaultSettings,
    menuData: menuData || []
  };
}
let _initialState = {
  collapsed: false,
};

if (typeof window !== 'undefined') {
  try {
    const collapsed = localStorage.getItem('pro-sidebar-collapsed')?.toLocaleLowerCase() === 'true';
    _initialState.collapsed = collapsed;
  } catch (error) {
    console.error(error);
  }
}
// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  return {
    collapsed: _initialState.collapsed,
    // onCollapse: (collapsed) => {
    //   localStorage.setItem('pro-sidebar-collapsed', String(collapsed));
    //   // window.location.reload();
    // },
    // menuRender:false,隐藏整个菜单
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: { //水印
      content: initialState?.currentUser?.name,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    links: [<Button type="primary" onClick={() => {
      if (localStorage.getItem('pro-sidebar-collapsed')?.toLocaleLowerCase() === 'true')
        localStorage.setItem('pro-sidebar-collapsed', "false")
      else
        localStorage.setItem('pro-sidebar-collapsed', "true")
      window.location.reload();
    }} >展开/关闭</Button>,
    ...(isDev
      ? [

        <Link to="/umi/plugin/openapi" target="_blank">
          <LinkOutlined />
          <span>OpenAPI 文档</span>
        </Link>,
        <Link to="/~docs">
          <BookOutlined />
          <span>业务组件文档</span>
        </Link>,
      ]
      : [])],
    // 自定义菜单渲染的写法
    // import React from 'react';
    // import { MenuDataItem } from '@ant-design/pro-layout';
    // import * as allIcons from '@ant-design/icons';
    // // FIX从接口获取菜单时icon为string类型
    menuDataRender: () => fixMenuItemIcon(initialState?.menuData),
    //自定义菜单项，
    menuItemRender: (itemProps: MenuDataItem, defaultDom: React.ReactNode, props: BaseMenuProps) => {
      if (itemProps.buttonUrl) {
        return <div >
          <span onClick={() => history.push(itemProps.path!)}>{defaultDom}</span>
          <Tooltip title={("创建新")}>
            <Button type="link" style={{ color: "#eff2f2" }} className="button-scale" icon={<allIcons.PlusOutlined />} onClick={() => history.push(itemProps.buttonUrl)} />
          </Tooltip>
        </div>
      } else
        if (itemProps.target === "_blank") {
          if (itemProps.name == 'Claude 3.5 Sonnet')
            return <>
              {defaultDom} &nbsp;
              <Tooltip title={("代码生成能力相比GPT4o更具优势")} >
                <allIcons.QuestionCircleOutlined />
              </Tooltip>
            </>
          else return defaultDom
        } else
          return <NavLink to={itemProps.path} >{defaultDom}</NavLink>
    },
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children, props) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          {!props.location?.pathname?.includes('/login') && (
            <SettingDrawer
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState) => ({
                  ...preInitialState,
                  settings,
                }));
              }}
            />
          )}
        </>
      );
    },
    ...initialState?.settings,
  };
};

const queryClient = new QueryClient();
export function rootContainer(container) { //Important ， App()的入口处
  return (
    <QueryClientProvider client={queryClient}>
      {container}
    </QueryClientProvider>
  );
}


// 自动检测前端发版
let lastSrcs: any;  //上一次获取到的script地址
let needTip = true; // 默认开启提示
const scriptReg = /<script.*src=["'](?<src>[^"']+)/gm;
const extractNewScripts = async () => {
  let result = [];
  try {
    const html = await fetch('/?_timestamp=' + Date.now()).then((resp) => resp.text());
    scriptReg.lastIndex = 0;
    let match: RegExpExecArray
    while ((match = scriptReg.exec(html) as RegExpExecArray)) {
      result.push(match.groups?.src)
    }
  } catch (error) {
    console.error(error);
  }
  return result;
}

const needUpdate = async () => {
  const newScripts = await extractNewScripts();
  if (!lastSrcs) {
    lastSrcs = newScripts;
    return false;
  }
  let result = false;
  if (lastSrcs.length !== newScripts.length) {
    result = true;
  }
  // 必须检测到脚本里含有/umi.xxx.js才刷新，否则可能是其他脚本的更新
  if (!newScripts.some((src: string) => src.includes('/umi.'))) {
    console.log("没有umj.js，可能正在更新，也可能nginx报错，挂了等")
    return false;
  }
  for (let i = 0; i < lastSrcs.length; i++) {
    if (lastSrcs[i] !== newScripts[i]) {
      result = true;
      break
    }
  }
  lastSrcs = newScripts;
  return result;
}
const DURATION = 30000;
const autoRefresh = () => {
  setTimeout(async () => {
    const willUpdate = await needUpdate();
    if (willUpdate) {
      // 延时更新，防止部署未完成用户就刷新空白
      setTimeout(() => {
        confirm({
          title: '检测到页面有内容更新，为了功能的正常使用，是否立即刷新？',
          icon: <allIcons.ExclamationCircleOutlined />,
          content: '页面有更新',
          onOk() {
            console.log('click reload');
            window.location.reload();
          },
          onCancel() {
            console.log('Cancel');
          },
        })
      }, 300000);
      needTip = false; // 关闭更新提示，防止重复提醒
    }
    if (needTip) {
      autoRefresh();
    }
  }, DURATION)
}
autoRefresh()
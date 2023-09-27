import type { Settings as LayoutSettings, MenuDataItem } from '@ant-design/pro-layout';
import { SettingDrawer } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import type { RunTimeLayoutConfig } from 'umi';
import { history, Link } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import { currentUser as queryCurrentUser } from './services/ant-design-pro/api';
import { BookOutlined, LinkOutlined } from '@ant-design/icons';
import defaultSettings from '../config/defaultSettings';
import React from 'react';
import * as allIcons from '@ant-design/icons';
import { QueryClient, QueryClientProvider } from 'react-query';

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

// Notes: 根据字符串获取一个icon，用到React的createElement
const fixMenuItemIcon = (menus: MenuDataItem[], iconType='Outlined'): MenuDataItem[] => {
  menus.forEach((item) => {
    const {icon, children} = item
    if (typeof icon === 'string') {
      let fixIconName = icon.slice(0,1).toLocaleUpperCase()+icon.slice(1) + iconType
      item.icon = React.createElement(allIcons[fixIconName] || allIcons[icon])
    }
    children && children.length>0 ? item.children = fixMenuItemIcon(children) : null
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
  const menuData = await (async()=>{ return []}); //动态菜单可以这样获取，并放到返回值的menuData里
  // 如果是登录页面，不执行
  if (history.location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings,
    };
  }
  return {
    fetchUserInfo,
    settings: defaultSettings,
    // menuData
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
    waterMarkProps: {
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
    links: isDev
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
      : [],
    // 自定义菜单渲染的写法
    // import React from 'react';
    // import { MenuDataItem } from '@ant-design/pro-layout';
    // import * as allIcons from '@ant-design/icons';
    // // FIX从接口获取菜单时icon为string类型
    // const fixMenuItemIcon = (menus: MenuDataItem[], iconType='Outlined'): MenuDataItem[] => {
    //   menus.forEach((item) => {
    //     const {icon, children} = item
    //     if (typeof icon === 'string') {
    //       let fixIconName = icon.slice(0,1).toLocaleUpperCase()+icon.slice(1) + iconType
    //       item.icon = React.createElement(allIcons[fixIconName] || allIcons[icon])
    //     }
    //     children && children.length>0 ? item.children = fixMenuItemIcon(children) : null
    //   });
    //   return menus
    // };
    // menuDataRender: () => fixMenuItemIcon(initialState?.menuData),
    //自定义菜单项，
    // menuItemRender: (itemProps: MenuDataItem, defaultDom: React.ReactNode, props: BaseMenuProps) => {
    //   if(itemProps.buttonUrl){ //这里创建2个按钮，各自控制点击
    //     return <div >
    //       <span onClick={() => history.push(itemProps.path!)}>{defaultDom}</span> 
    //       <Tooltip title={getTransStr("创建新")+getTransStr(itemProps.tip)}>
    //         <Button type="link" style={{color:"#eff2f2"}} className="button-scale" icon={<PlusOutlined />} onClick={()=>history.push(itemProps.buttonUrl)} /> 
    //       </Tooltip>
    //     </div>
    //   }else
    //     return itemProps.target==="_blank"? 
    //       <a target='_blank' href={itemProps.path}>{defaultDom}</a>:  //注意这里，使用了<a>标签，如果只写onClick不写href，那在右键菜单里就不会有“新标签打开”，必须写href才有这一条
    //       <NavLink to={itemProps.path} >{defaultDom}</NavLink>
    // },
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
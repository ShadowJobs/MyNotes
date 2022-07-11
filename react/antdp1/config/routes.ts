export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    icon: 'dashboard',
    component: './Dashboard/analysis',
  },
  {
    path: '/admin',
    name: 'admin',
    icon: 'contacts',
    access: 'canAdmin',
    component: './Admin',
    routes: [
      {
        path: '/admin/sub-page',
        name: 'sub-page',
        icon: 'smile',
        component: './Welcome',
      },
      {
        component: './404',
      },
    ],
  },
  {
    name: 'list.table-list',
    icon: 'table',
    path: '/list',
    component: './TableList',
  },
  {
    path: '/LinYing',
    name: 'LinYing',
    icon: 'crown',
    routes: [
      {
        name: "log",
        icon: "smile",
        path: "/LinYing/log",
        component: "./LinYing/LogInfo",
      },{
        name:"react json配合form表单",
        icon: "smile",
        path: "/LinYing/react-json-form",
        component: "./LinYing/JsonEditorAndForm",
      },{
        name:"上传文件，函数式确认框",
        icon: "smile",
        path: "/LinYing/updload",
        component: "./LinYing/UploadFile",
      },{
        name:"代码编辑",
        icon: "smile",
        path: "/LinYing/code-editor",
        component: "./LinYing/MonacoEditor",
      },{
        name:"echarts",
        icon: "smile",
        path: "/LinYing/echarts",
        component: "./LinYing/AntChartEchartScatter",
      },{
        name:"tablemerge",
        icon: "smile",
        path: "/LinYing/MergeAntTable",
        component: "./LinYing/MergeAntTable",
      }
    ]
  },
  {
    path: '/Three',
    name: 'Three',
    icon: 'dropbox',
    routes: [
      {
        name:"three",
        path: "/Three/three",
        component: "./Three/Three1",
      },{
        name:"earch",
        path: "/Three/Earth",
        component: "./Three/Earth",
      },{
        name:"city",
        path: "/Three/City",
        component: "./Three/City/CityIndex",
      },{
        name:"carTrajectory",
        path: "/Three/CarTrajectory",
        component: "./Three/CarTrajectory",
      }]
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    component: './404',
  },
];

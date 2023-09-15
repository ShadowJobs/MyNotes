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
      {name: "WorkerTest", path: "/LinYing/WorkerTest", component: "./LinYing/Workers/WorkerTest" },
      {name: "JsTest+helmet", path: "/LinYing/JsTest", component: "./LinYing/JsTest" },
      {name: "Jsondiff+ErrorBoundary", path: "/LinYing/JsonDiff", component: "./LinYing/JsonDiff" },
      {name: "Express+graphql", path: "/LinYing/express-graphql", component: "./LinYing/ExpressGraphql" },
      {name:"地图",path:"map",routes:[
        {name:"高德",path:"/LinYing/map/Gaode",component:"./LinYing/Map/Gaode"},
        {name:"高德热力图",path:"/LinYing/map/GaodeHeatmap",component:"./LinYing/Map/GaodeHeatmap"},
        {name:"GoogleMapReact",path:"/LinYing/map/GoogleMapReact",component:"./LinYing/Map/GoogleMapReact"},
        {name:"GoogleMapReactClusterer",path:"/LinYing/map/GoogleMapReactClusterer",component:"./LinYing/Map/GoogleMapReactClusterer"},
        {name:"GoogleMapOrigin",path:"/LinYing/map/GoogleMapOrigin",component:"./LinYing/Map/GoogleMapOrigin"},
        {name:"GoogleMapUseApi",path:"/LinYing/map/GoogleMapGMApi",component:"./LinYing/Map/GoogleMapGMApi"},
        {name:"GoogleHeatMap",path:"/LinYing/map/GoogleHeatMap",component:"./LinYing/Map/GoogleHeatMap"},
      ]},
      {name: "log+分段加载", path: "/LinYing/log", component: "./LinYing/LogInfo" },
      { name: "小组件", path: "/LinYing/SmallComps", component: "./LinYing/SmallComps" },
      { name: "Zip测试", path: "/LinYing/ZipTest", component: "./LinYing/ZipTest" },
      { name: "图线缩放", path: "/LinYing/ScalePicCanvas", component: "./LinYing/ScalePicCanvas" },
      { name: "BirdView", path: "/LinYing/BirdView", component: "./LinYing/BirdView" },
      { name:"react json配合form表单", path: "/LinYing/react-json-form", component: "./LinYing/JsonEditorAndForm",},
      { name:"上传文件，函数式确认框", path: "/LinYing/updload", component: "./LinYing/UploadFile",},
      { name:"代码编辑", path: "/LinYing/code-editor", component: "./LinYing/MonacoEditor" },
      { name:"echarts", path: "/LinYing/echarts", component: "./LinYing/AntChartEchartScatter" },
      { name:"tablemerge", path: "/LinYing/MergeAntTable", component: "./LinYing/MergeAntTable" },
      { name:"charts", path: "/LinYing/Charts", component: "./LinYing/TestCharts/Charts" },
      { name:"nesting", icon: "smile", path: "/LinYing/NestingForm", component: "./LinYing/NestingForm" },
      { name:"htmlTable", path: "/LinYing/HtmlTable", component: "./LinYing/HtmlTable" },
      { name:"htmlTable2-feishu", path: "/LinYing/HtmlTable2", component: "./LinYing/HtmlTable2" },
      { name:"proformtest", path: "/LinYing/ProFormTest", component: "./LinYing/ProFormListTest" },
      { name:"图文混排", path: "PicAndWord", component: "./LinYing/PicAndWord" },
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
        name:"earth",
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

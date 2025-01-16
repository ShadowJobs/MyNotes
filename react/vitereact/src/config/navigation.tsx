import {
  AppstoreOutlined,
  BarChartOutlined,
  BranchesOutlined,
  QuestionCircleOutlined,
  RobotOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import { MenuProps } from "antd";
import { Link } from "react-router-dom";

type MenuItem = NonNullable<MenuProps["items"]>[0];

export const DEFAULT_ROUTE_PATH = "/welcome";
export const DEFAULT_OPEN_PATH = ["welcome"];
export const DEFAULT_SELECTED_PATH = ["welcome"];

export const LinkTo = ({ name, to, keys, target }: { name: string; to: string; keys?: string[]; target?: string }) => (
  <Link to={to} state={{ keys }} target={target}>
    {name}
  </Link>
);

export const navigation: MenuItem[] = [
  {
    key: "welcome",
    label: <LinkTo name="Welcome" to="/welcome" keys={["welcome"]} />,
    icon: <AppstoreOutlined />,
  },
  {
    key: "qiankun-sub-vue",
    label: <LinkTo name="qiankun-vue" to="/vue" keys={["qiankun-sub-vue"]} />,
    icon: <BarChartOutlined />,
  },
  {
    key: "qiankun-sub-react",
    label: <LinkTo name="qiankun-react" to="/react1" keys={["qiankun-sub-react"]} />,
    icon: <BarChartOutlined />,
  },

  {
    key: "qa-gpt", label: "Task", icon: <QuestionCircleOutlined/>, children: [
      { key: "qa-gpt-robot", label: <LinkTo name="QA GPT" to="https://applink.feishu.cn/TYuSw5gWw" keys={["AI-Bots", "qa-gpt-robot"]} target="_blank" /> },
      { key: "gpt", label: <LinkTo name="Tasks" to="/AI-Apps/AGPT/tasks" keys={["qa-gpt", 'gpt']} /> },
    ]
  },
  {
    key: "lve", label: "Log Insight", icon: <BranchesOutlined />, children: [
      { key: "insight-doc", label: <LinkTo name="Introduction" to="/lve/insight-doc" keys={["lve", "insight-doc"]} /> },
      {
        key: "insight-group", label: "Group", children: [
          { key: "ci-list", label: <LinkTo name="CI" to="/lve/group/ci/list" keys={["lve", "insight-group", "ci", "ci-list"]} /> },
        ]
      }
    ]
  },
];

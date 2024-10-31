import {
  AppstoreOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import { MenuProps } from "antd";
import { Link } from "react-router-dom";

type MenuItem = NonNullable<MenuProps["items"]>[0];

export const DEFAULT_ROUTE_PATH = "/welcome";
export const DEFAULT_OPEN_PATH = ["welcome"];
export const DEFAULT_SELECTED_PATH = ["welcome"];

const LinkTo = ({ name, to, keys }: { name: string; to: string; keys?: string[] }) => (
  <Link to={to} state={{ keys }}>
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
  }
];

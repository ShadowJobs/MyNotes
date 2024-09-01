import {
  AppstoreOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import { MenuProps } from "antd";
import { Link } from "react-router-dom";

type MenuItem = NonNullable<MenuProps["items"]>[0];

export const DEFAULT_ROUTE_PATH = "/product-list";
export const DEFAULT_OPEN_PATH = ["product-list"];
export const DEFAULT_SELECTED_PATH = ["product-list"];

const LinkTo = ({ name, to, keys }: { name: string; to: string; keys?: string[] }) => (
  <Link to={to} state={{ keys }}>
    {name}
  </Link>
);

export const navigation: MenuItem[] = [
  {
    key: "product-list",
    label: <LinkTo name="page1" to="/product-list" keys={["product-list"]} />,
    icon: <AppstoreOutlined />,
  },
  {
    key: "product-efficiency",
    label: <LinkTo name="page2" to="/product-efficiency" keys={["product-efficiency"]} />,
    icon: <BarChartOutlined />,
  }
];

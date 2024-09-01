import useUser from "@/hooks/useUser";
import { LinkOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Breadcrumb, Button, Dropdown, Layout, message, theme } from "antd";
import { useLocation, useNavigate } from "react-router-dom";

export default function Header() {
  const {
    token: { colorBgContainer }
  } = theme.useToken();
  const { pathname } = useLocation();

  const { data: user } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user/info");
    message.info("User logged out!");
    navigate("/user/login");
  };

  return (
    <Layout.Header
      className="flex items-center justify-between"
      style={{
        background: colorBgContainer
      }}
    >
      <Breadcrumb
        items={[
          { title: "home" },
          ...pathname
            .split("/")
            .slice(1)
            .map((item) => ({ title: item }))
        ]}
      />
      <Dropdown
        trigger={["click", "hover"]}
        menu={{
          items: [
            {
              key: "logout",
              label: "Logout",
              icon: <LogoutOutlined />,
              onClick: handleLogout
            }
          ]
        }}
      >
        <Button type="text" className="flex items-center !py-6">
          <Avatar icon={<UserOutlined />} />
          <span className="ml-4">{user?.user_name ?? "anonymous"}</span>
        </Button>
      </Dropdown>
    </Layout.Header>
  );
}

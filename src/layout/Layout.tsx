import React, { useState } from "react";
import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useStore } from "../store/userStore";
import { SiLevelsdotfyi } from "react-icons/si";
import {
  MdMiscellaneousServices,
  MdOutlineAttractions,
  MdOutlineModeOfTravel,
  MdOutlineRateReview,
  MdOutlineTravelExplore,
} from "react-icons/md";
import { LuCalendarDays } from "react-icons/lu";
import { PiArticleNyTimesBold } from "react-icons/pi";
import { TbArticle } from "react-icons/tb";
import { FaHeadset } from "react-icons/fa";
import { BsSun, BsMoon } from "react-icons/bs"; // Sun va Moon iconlar
import { useDarkModeStore } from "../store/darkModeStore";

const { Header, Sider, Content } = Layout;

const RootLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { darkMode, toggleDarkMode } = useDarkModeStore();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const navigate = useNavigate();
  const location = useLocation();
  const { clearUser } = useStore();

  const getSelectedKeys = () => {
    switch (location?.pathname) {
      case "/":
        return ["1"];
      case "/travel-designers":
        return ["2"];
        case "/experience":
        return ["3"];
      case "/travel-types":
        return ["4"];
        case "/sub-travel":
        return ["5"];
      case "/travel":
        return ["6"];
      case "/attractions":
        return ["7"];
      case "/services":
        return ["8"];
      case "/days":
        return ["9"];
      case "/articles":
        return ["10"];
      case "/subarticles":
        return ["11"];
      case "/operators":
        return ["12"];
      case "/travel-ideas":
        return ["14"];
      case "/sub-travel-ideas":
        return ["13"];
        case "/reviews":
        return ["15"];
      default:
        return ["1"];
    }
  };

  const handleLogout = () => {
    navigate("/login");
    clearUser();
  };

  const toggleTheme = () => {
    toggleDarkMode();
  };

  return (
    <Layout style={{ height: "100vh" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme={darkMode ? "dark" : "light"} // 👉 Sider ham o'zgaradi
        style={{ border: !darkMode ? "1px solid #d9d9d9" : "none" }}
      >
        <Link to="/" className="flex justify-center py-5 pb-10">
          <h3 className="text-[30px] text-red-600">
            {collapsed ? <span>L</span> : <span>Logo</span>}
          </h3>
        </Link>
        <Menu
          theme={darkMode ? "dark" : "light"}
          mode="inline"
          selectedKeys={getSelectedKeys()}
          items={[
            {
              key: "1",
              icon: <SiLevelsdotfyi />,
              label: <Link to="/">Daraja</Link>,
            },
            {
              key: "2",
              icon: <MdOutlineModeOfTravel />,
              label: <Link to="/travel-designers">Sayohat dizaynerlari</Link>,
            },
            {
              key: "3",
              icon: <MdOutlineTravelExplore />,
              label: <Link to="/experience">Sayohat ta'surotlari</Link>,
            },
            {
              key: "4",
              icon: <MdOutlineTravelExplore />,
              label: <Link to="/travel-types">Sayohat turi</Link>,
            },
            {
              key: "5",
              icon: <MdOutlineTravelExplore />,
              label: <Link to="/sub-travel">Ichki sayohat</Link>,
            },
            {
              key: "6",
              icon: <MdOutlineTravelExplore />,
              label: <Link to="/travel">Sayohat</Link>,
            },
            {
              key: "7",
              icon: <MdOutlineAttractions />,
              label: <Link to="/attractions">Diqqatga sazovor joylar</Link>,
            },
            {
              key: "8",
              icon: <MdMiscellaneousServices />,
              label: <Link to="/services">Xizmatlar</Link>,
            },
            {
              key: "9",
              icon: <LuCalendarDays />,
              label: <Link to="/days">Kunlar</Link>,
            },
            {
              key: "10",
              icon: <PiArticleNyTimesBold />,
              label: <Link to="/articles">Maqolalar</Link>,
            },
            {
              key: "11",
              icon: <TbArticle />,
              label: <Link to="/subarticles">Kichkina maqolalar</Link>,
            },
            {
              key: "12",
              icon: <FaHeadset />,
              label: <Link to="/operators">Operatorlar</Link>,
            },
            {
              key: "13",
              icon: <MdOutlineTravelExplore />,
              label: <Link to="/sub-travel-ideas">Sayohat g'oyasi</Link>,
            },
            {
              key: "14",
              icon: <MdOutlineTravelExplore />,
              label: <Link to="/travel-ideas">Sayohat g'oyalari</Link>,
            },
            {
              key: "15",
              icon: <MdOutlineRateReview />,
              label: <Link to="/reviews">Izohlar</Link>,
            },
          ]}
        />
      </Sider>
      <Layout style={{ background: !darkMode ? "#fff" : "#002140" }}>
        <Header
          style={{
            padding: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingRight: "20px",
            background: darkMode ? "#001529" : colorBgContainer, // 👉 Header background ham
            border: !darkMode ? "1px solid #d9d9d9" : "none",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
              color: darkMode ? "#fff" : "#000", // 👉 Icon rangi ham moslashadi
            }}
          />
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <Button
              type="text"
              onClick={toggleTheme}
              icon={darkMode ? <BsSun /> : <BsMoon />}
              style={{
                fontSize: "20px",
                color: darkMode ? "#fff" : "#000",
              }}
            />
            <Button
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              style={{
                fontWeight: "600",
                color: darkMode ? "rgba(255, 255, 255, 0.65)" : "#000",
                background: darkMode ? "#001529" : colorBgContainer,
                borderColor: !darkMode ? "#000" : "rgba(255, 255, 255, 0.65)",
              }}
            >
              Chiqish
            </Button>
          </div>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: darkMode ? "#001529" : colorBgContainer, // 👉 Content background
            borderRadius: borderRadiusLG,
            border: !darkMode ? "1px solid #d9d9d9" : "none",
            overflowY: "scroll"
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default RootLayout;

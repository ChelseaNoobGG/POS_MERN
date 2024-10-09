import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Layout, Menu, Badge } from "antd";
import { Link, useNavigate } from "react-router-dom";
import {
  ShopOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LogoutOutlined,
  HomeOutlined,
  CopyOutlined,
  UnorderedListOutlined,
  ShoppingCartOutlined,
  QrcodeOutlined,
} from "@ant-design/icons";
import "../styles/DefaultLayout.css";
import Spinner from "./Spinner";

const { Header, Sider, Content } = Layout;

const DefaultLayout = ({ children }) => {
  const navigate = useNavigate();
  const { cartItems, loading } = useSelector((state) => state.rootReducer);
  const [collapsed, setCollapsed] = useState(false);

  const toggle = () => {
    setCollapsed(!collapsed);
  };

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  return (
    <Layout>
      {loading && <Spinner />}
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo">
          <h1 className="text-center text-light font-weight-bold mt-3">POS</h1>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={window.location.pathname}
          style={{ marginTop: "10px" }}
        >
          <Menu.Item key="/" icon={<HomeOutlined />}>
            <Link to="/">หน้าหลัก</Link>
          </Menu.Item>
          <Menu.Item key="/bills" icon={<CopyOutlined />}>
            <Link to="/bills">ใบเสร็จ</Link>
          </Menu.Item>
          <Menu.Item key="/items" icon={<ShopOutlined />}>
            <Link to="/items">รายการสินค้า</Link>
          </Menu.Item>
          <Menu.Item key="/types" icon={<UnorderedListOutlined />}>
            <Link to="/types">ประเภทสินค้า</Link>
          </Menu.Item>
          <Menu.Item key="/qrcode" icon={<QrcodeOutlined />}>
            <Link to="/qrcode">QR-CODE</Link>
          </Menu.Item>
          <Menu.Item
            key="/logout"
            icon={<LogoutOutlined />}
            onClick={() => {
              localStorage.removeItem("auth");
              navigate("/login");
            }}
          >
            ออกจากระบบ
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background header-layout">
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "trigger",
              onClick: toggle,
            }
          )}
          <div
            className="cart-item d-flex align-items-center"
            onClick={() => navigate("/cart")}
          >
            <Badge count={cartItems.length} offset={[5, 5]} color="#f5222d">
              <ShoppingCartOutlined className="shopping-cart-icon" />
            </Badge>
            <span className="cart-label">ตะกร้าสินค้า</span>
          </div>
        </Header>
        <Content
          className="site-layout-background"
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: "100vh",
            backgroundColor: "#f0f2f5",
            borderRadius: "8px",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default DefaultLayout;

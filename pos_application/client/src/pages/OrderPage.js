import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Button,
  Badge,
  message,
  Divider,
  Typography,
  Drawer,
  List,
  Card,
} from "antd";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ShoppingCartOutlined,
  PlusOutlined,
  MinusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import ItemList from "../components/ItemList";

const { Title } = Typography;

const OrderPage = () => {
  const [itemsData, setItemsData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cartVisible, setCartVisible] = useState(false);
  const { tableId } = useParams();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart || []);

  useEffect(() => {
    const fetchItemsAndCategories = async () => {
      try {
        const itemsResponse = await axios.get("/api/items/get-item");
        setItemsData(itemsResponse.data);

        const typesResponse = await axios.get("/api/types/get-type");
        const typesData = typesResponse.data;
        const uniqueCategories = [
          { name: "ทุกประเภท", value: "all", image: "" },
          ...typesData.map((type) => ({
            name: type.name,
            value: type.name,
            image: type.image,
          })),
        ];
        setCategories(uniqueCategories);
      } catch (error) {
        message.error("ไม่สามารถดึงข้อมูลสินค้าและประเภทได้");
      }
    };

    fetchItemsAndCategories();
  }, []);

  const addToCart = (item) => {
    dispatch({ type: "ADD_TO_CART", payload: { ...item, quantity: 1 } });
    message.success(`เพิ่ม ${item.name} ลงในตะกร้าเรียบร้อยแล้ว!`);
  };

  const increaseQuantity = (item) => {
    dispatch({ type: "INCREASE_QUANTITY", payload: item });
  };

  const decreaseQuantity = (item) => {
    if (item.quantity > 1) {
      dispatch({ type: "DECREASE_QUANTITY", payload: item });
    } else {
      dispatch({ type: "REMOVE_FROM_CART", payload: item });
    }
  };

  const removeItem = (item) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: item });
  };

  const mergedCartItems = cartItems.reduce((acc, item) => {
    const existingItem = acc.find((i) => i._id === item._id);
    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      acc.push({ ...item });
    }
    return acc;
  }, []);

  const filteredItems =
    selectedCategory === "all"
      ? itemsData
      : itemsData.filter((item) => item.category.name === selectedCategory);

  const sendOrderToKitchen = async () => {
    if (mergedCartItems.length === 0) {
      message.warning("กรุณาเพิ่มสินค้าในตะกร้าก่อนส่งออเดอร์");
      return;
    }

    try {
      const orderDetails = {
        tableId,
        items: mergedCartItems,
        total: mergedCartItems
          .reduce((total, item) => total + item.quantity * item.price, 0)
          .toFixed(2),
      };

      await axios.post("/api/orders/send-to-kitchen", orderDetails);
      message.success("ส่งออเดอร์ไปที่ห้องครัวเรียบร้อยแล้ว!");
      setCartVisible(false);
      dispatch({ type: "CLEAR_CART" });
    } catch (error) {
      message.error("การส่งออเดอร์ไปที่ห้องครัวล้มเหลว กรุณาลองใหม่อีกครั้ง");
    }
  };

  return (
    <div style={{ background: "#f0f2f5", minHeight: "100vh" }}>
      <div
        style={{
          padding: "10px 20px",
          backgroundColor: "#fff",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          marginBottom: "20px",
        }}
      >
        <Title level={3} style={{ textAlign: "center", color: "#444", marginBottom: "10px" }}>
          สั่งอาหารสำหรับโต๊ะที่ {tableId}
        </Title>
        <Row gutter={[8, 8]} justify="center">
          {categories.map((category) => (
            <Col key={category.value} xs={8} sm={6} md={4} lg={3} style={{ textAlign: "center" }}>
              <Card
                hoverable
                onClick={() => setSelectedCategory(category.value)}
                style={{
                  borderRadius: "5px",
                  backgroundColor: selectedCategory === category.value ? "#1890ff" : "#fff",
                  boxShadow:
                    selectedCategory === category.value ? "0px 4px 8px rgba(0,0,0,0.15)" : "0px 1px 3px rgba(0,0,0,0.1)",
                  textAlign: "center",
                  padding: "5px",
                }}
              >
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: "50%",
                      marginBottom: "5px",
                    }}
                  />
                ) : (
                  <ShoppingCartOutlined
                    style={{
                      fontSize: "35px",
                      color: selectedCategory === category.value ? "#fff" : "#1890ff",
                      marginBottom: "5px",
                    }}
                  />
                )}
                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: "bold",
                    color: selectedCategory === category.value ? "#fff" : "#333",
                  }}
                >
                  {category.name}
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "0 20px", marginBottom: "20px" }}>
        <Badge count={cartItems.length} offset={[5, 5]} color="#f5222d">
          <Button
            type="primary"
            onClick={() => setCartVisible(true)}
            icon={<ShoppingCartOutlined />}
            style={{
              backgroundColor: "#1890ff",
              borderColor: "#1890ff",
              padding: "8px 15px",
              borderRadius: "5px",
              fontWeight: "bold",
            }}
          >
            ตะกร้าสินค้า
          </Button>
        </Badge>
      </div>
      <Row gutter={[16, 16]} justify="center" style={{ padding: "0 20px" }}>
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <Col xs={24} lg={6} md={8} sm={12} key={item._id}>
              <ItemList item={item} onAddToCart={() => addToCart(item)} />
            </Col>
          ))
        ) : (
          <Col span={24} style={{ textAlign: "center", padding: "20px" }}>
            <h3 style={{ color: "#999" }}>ไม่มีสินค้าในประเภทนี้</h3>
          </Col>
        )}
      </Row>
      <Drawer
        title="รายการในตะกร้า"
        placement="right"
        onClose={() => setCartVisible(false)}
        visible={cartVisible}
        width={400}
      >
        <List
          itemLayout="horizontal"
          dataSource={mergedCartItems}
          renderItem={(item) => (
            <List.Item
              style={{ alignItems: "center" }}
              actions={[
                <Button size="small" icon={<PlusOutlined />} onClick={() => increaseQuantity(item)} />,
                <Button size="small" icon={<MinusOutlined />} onClick={() => decreaseQuantity(item)} />,
                <Button size="small" icon={<DeleteOutlined />} onClick={() => removeItem(item)} />,
              ]}
            >
              <List.Item.Meta
                title={item.name}
                description={`จำนวน: ${item.quantity} ราคา: ${item.price}`}
              />
              <div style={{ fontWeight: "bold" }}>รวม: {item.quantity * item.price} บาท</div>
            </List.Item>
          )}
        />
        <Divider />
        <h3>
          ยอดรวมทั้งหมด:{" "}
          {mergedCartItems.reduce((total, item) => total + item.quantity * item.price, 0).toFixed(2)} บาท
        </h3>
        <Button type="primary" style={{ width: "100%", marginTop: "10px" }} onClick={sendOrderToKitchen}>
          ส่งออเดอร์
        </Button>
      </Drawer>
    </div>
  );
};

export default OrderPage;

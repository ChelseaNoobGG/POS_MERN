import React from "react";
import { Button, Card } from "antd";
import { useDispatch } from "react-redux";
import { ShoppingCartOutlined } from "@ant-design/icons"; // ใช้ไอคอนจาก Ant Design

const ItemList = ({ item }) => {
  const dispatch = useDispatch();

  // update cart handler
  const handleAddTOCart = () => {
    dispatch({
      type: "ADD_TO_CART",
      payload: { ...item, quantity: 1 },
    });
  };

  const { Meta } = Card;

  return (
    <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
      <Card
        hoverable
        style={{
          width: 280,
          borderRadius: "10px",
          overflow: "hidden",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // เพิ่มเงาให้ดูนุ่มขึ้น
          transition: "all 0.3s ease-in-out",
        }}
        cover={
          <img
            alt={item.name}
            src={item.image}
            style={{
              height: 220,
              objectFit: "cover",
              borderBottom: "1px solid #f0f0f0",
              transition: "transform 0.3s ease-in-out",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
        }
      >
        <Meta
          title={<span style={{ fontSize: "18px", fontWeight: "bold" }}>{item.name}</span>}
          description={
            <>
              <p style={{ margin: 0, fontSize: "14px", color: "#555" }}>
                Category:{" "}
                <span style={{ fontWeight: "bold", color: "#1890ff" }}>
                  {typeof item.category === "string"
                    ? item.category
                    : item.category?.name || "N/A"}
                </span>
              </p>
              <p style={{ margin: 0, fontSize: "16px", fontWeight: "bold", color: "#fa8c16" }}>
                Price: ${item.price.toFixed(2)}
              </p>
            </>
          }
        />
        <div className="item-button" style={{ textAlign: "center", marginTop: "15px" }}>
          <Button
            type="primary"
            shape="round"
            icon={<ShoppingCartOutlined />}
            size="large"
            onClick={handleAddTOCart}
            style={{
              backgroundColor: "#1890ff",
              borderColor: "#1890ff",
              fontWeight: "bold",
              transition: "all 0.3s ease-in-out",
              padding: "10px 20px",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#40a9ff")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1890ff")}
          >
            เลือกสินค้า
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ItemList;

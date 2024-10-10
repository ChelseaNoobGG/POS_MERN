import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  DeleteOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import { Table, Button, message, Typography } from "antd";

const { Title } = Typography;

const OrderCartPage = () => {
  const [subTotal, setSubTotal] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tableId } = useParams();
  const { cartItems } = useSelector((state) => state.rootReducer);

  // Handle increment
  const handleIncrement = (record) => {
    dispatch({
      type: "UPDATE_CART",
      payload: { ...record, quantity: record.quantity + 1 },
    });
  };

  // Handle decrement
  const handleDecrement = (record) => {
    if (record.quantity > 1) {
      dispatch({
        type: "UPDATE_CART",
        payload: { ...record, quantity: record.quantity - 1 },
      });
    } else {
      handleDelete(record);
    }
  };

  // Handle delete
  const handleDelete = (record) => {
    dispatch({
      type: "DELETE_FROM_CART",
      payload: record,
    });
    message.info(`ลบ ${record.name} ออกจากตะกร้าเรียบร้อยแล้ว`);
  };

  const columns = [
    { title: "ชื่อ", dataIndex: "name" },
    {
      title: "รูปภาพ",
      dataIndex: "image",
      render: (image, record) => (
        <img src={image} alt={record.name} height="60" width="60" />
      ),
    },
    { title: "ราคา", dataIndex: "price", render: (price) => `${price} บาท` },
    {
      title: "จำนวน",
      dataIndex: "_id",
      render: (id, record) => (
        <div>
          <PlusCircleOutlined
            className="mx-3"
            style={{ cursor: "pointer", color: "#52c41a" }}
            onClick={() => handleIncrement(record)}
          />
          <b>{record.quantity}</b>
          <MinusCircleOutlined
            className="mx-3"
            style={{ cursor: "pointer", color: "#f5222d" }}
            onClick={() => handleDecrement(record)}
          />
        </div>
      ),
    },
    {
      title: "การกระทำ",
      dataIndex: "_id",
      render: (id, record) => (
        <DeleteOutlined
          style={{ cursor: "pointer", color: "#f5222d" }}
          onClick={() => handleDelete(record)}
        />
      ),
    },
  ];

  useEffect(() => {
    let temp = 0;
    cartItems.forEach((item) => (temp += item.price * item.quantity));
    setSubTotal(temp);
  }, [cartItems]);

  // Handle sending the order to the kitchen
  const handleSendToKitchen = async () => {
    try {
      const orderDetails = {
        cartItems,
        subTotal,
        tableId,
      };
      await axios.post("/api/orders/send-to-kitchen", orderDetails);
      message.success("ส่งออเดอร์ไปที่ห้องครัวเรียบร้อยแล้ว!");
      navigate(`/orders/${tableId}`); // Redirect back to the order page after sending to the kitchen
    } catch (error) {
      message.error("การส่งออเดอร์ไปที่ห้องครัวล้มเหลว กรุณาลองใหม่อีกครั้ง");
      console.log(error);
    }
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "#f0f2f5", minHeight: "100vh" }}>
      <Title level={3} style={{ textAlign: "center", marginBottom: "20px" }}>
        ตะกร้าสินค้าสำหรับโต๊ะที่ {tableId}
      </Title>
      <Table columns={columns} dataSource={cartItems} bordered />
      <div className="d-flex flex-column align-items-end" style={{ marginTop: "20px" }}>
        <hr />
        <h3>
          ยอดรวมย่อย: <b>{subTotal} บาท</b>
        </h3>
        <Button type="primary" onClick={handleSendToKitchen}>
          ส่งออเดอร์ไปที่ครัว
        </Button>
        <Button
          type="default"
          style={{ marginTop: "10px" }}
          onClick={() => navigate(`/order/${tableId}`)}
        >
          กลับไปที่หน้าสั่งอาหาร
        </Button>
      </div>
    </div>
  );
};

export default OrderCartPage;

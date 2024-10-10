import React, { useEffect, useState } from "react";
import { Table, Button, Tag, message } from "antd";
import axios from "axios";

const KitchenPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  // ดึงข้อมูลออเดอร์จากเซิร์ฟเวอร์
  const fetchOrders = async () => {
    try {
      const response = await axios.get("/api/orders");
      setOrders(response.data);
    } catch (error) {
      message.error("ไม่สามารถดึงข้อมูลออเดอร์ได้");
    }
  };

  // อัปเดตสถานะของออเดอร์
  const updateOrderStatus = async (orderId, status) => {
    try {
      await axios.put(`/api/orders/${orderId}`, { status });
      message.success("อัปเดตสถานะสำเร็จ");
      fetchOrders(); // รีเฟรชรายการออเดอร์
    } catch (error) {
      message.error("ไม่สามารถอัปเดตสถานะได้");
    }
  };

  const columns = [
    {
      title: "โต๊ะ",
      dataIndex: "tableId",
      key: "tableId",
    },
    {
      title: "รายการอาหาร",
      dataIndex: "items",
      key: "items",
      render: (items) => (
        <ul>
          {items.map((item) => (
            <li key={item.name}>
              {item.name} x {item.quantity}
            </li>
          ))}
        </ul>
      ),
    },
    {
      title: "ยอดรวม (บาท)",
      dataIndex: "total",
      key: "total",
    },
    {
      title: "สถานะ",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = status === "completed" ? "green" : status === "cooking" ? "orange" : "red";
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: "การจัดการ",
      key: "action",
      render: (text, record) => (
        <div>
          {record.status === "pending" && (
            <Button
              type="primary"
              onClick={() => updateOrderStatus(record._id, "cooking")}
            >
              เริ่มทำอาหาร
            </Button>
          )}
          {record.status === "cooking" && (
            <Button
              type="primary"
              onClick={() => updateOrderStatus(record._id, "completed")}
            >
              ทำเสร็จแล้ว
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h1>ห้องครัว - รายการออเดอร์</h1>
      <Table
        columns={columns}
        dataSource={orders}
        rowKey={(record) => record._id}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default KitchenPage;

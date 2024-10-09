import React, { useState, useEffect } from "react";
import DefaultLayout from "../components/DefaultLayout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  DeleteOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import { Table, Button, Modal, message, Form, Input, Select } from "antd";

const CartPage = () => {
  const [subTotal, setSubTotal] = useState(0);
  const [billPopup, setBillPopup] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.rootReducer);

  // handle increment
  const handleIncreament = (record) => {
    dispatch({
      type: "UPDATE_CART",
      payload: { ...record, quantity: record.quantity + 1 },
    });
  };

  const handleDecreament = (record) => {
    if (record.quantity !== 1) {
      dispatch({
        type: "UPDATE_CART",
        payload: { ...record, quantity: record.quantity - 1 },
      });
    }
  };

  const columns = [
    { title: "ชื่อสินค้า", dataIndex: "name", align: "center" },
    {
      title: "ภาพสินค้า",
      dataIndex: "image",
      align: "center",
      render: (image, record) => (
        <img
          src={image}
          alt={record.name}
          height="60"
          width="60"
          style={{ borderRadius: "8px", objectFit: "cover" }}
        />
      ),
    },
    { title: "ราคา", dataIndex: "price", align: "center" },
    {
      title: "จำนวน",
      dataIndex: "_id",
      align: "center",
      render: (id, record) => (
        <div>
          <PlusCircleOutlined
            className="mx-3"
            style={{ cursor: "pointer", color: "#4CAF50" }}
            onClick={() => handleIncreament(record)}
          />
          <b>{record.quantity}</b>
          <MinusCircleOutlined
            className="mx-3"
            style={{ cursor: "pointer", color: "#f44336" }}
            onClick={() => handleDecreament(record)}
          />
        </div>
      ),
    },
    {
      title: "ลบรายการ",
      dataIndex: "_id",
      align: "center",
      render: (id, record) => (
        <DeleteOutlined
          style={{ cursor: "pointer", color: "#ff4d4f" }}
          onClick={() =>
            dispatch({
              type: "DELETE_FROM_CART",
              payload: record,
            })
          }
        />
      ),
    },
  ];

  useEffect(() => {
    let temp = 0;
    cartItems.forEach((item) => (temp += item.price * item.quantity));
    setSubTotal(temp);
  }, [cartItems]);

  // handleSubmit
  const handleSubmit = async (value) => {
    try {
      const newObject = {
        ...value,
        cartItems,
        subTotal,
        tax: Number(((subTotal / 100) * 10).toFixed(2)),
        totalAmount: Number(
          Number(subTotal) + Number(((subTotal / 100) * 10).toFixed(2))
        ),
        userId: JSON.parse(localStorage.getItem("auth"))._id,
      };
      await axios.post("/api/bills/add-bills", newObject);
      message.success("ใบเสร็จถูกสร้างแล้ว");

      // Reset cart items
      dispatch({ type: "RESET_CART" });

      navigate("/bills");
    } catch (error) {
      message.error("เกิดข้อผิดพลาด");
      console.log(error);
    }
  };

  return (
    <DefaultLayout>
      <h1 style={{ textAlign: "center", marginBottom: "20px", fontSize: "24px" }}>ตระกร้าสินค้า</h1>
      <Table
        columns={columns}
        dataSource={cartItems}
        bordered
        pagination={false}
        style={{ marginBottom: "20px" }}
      />
      <div className="d-flex flex-column align-items-end">
        <hr style={{ width: "100%" }} />
        <h3 style={{ fontSize: "20px" }}>
          ยอดรวม: <b>{subTotal.toFixed(2)}</b> /-
        </h3>
        <Button
          type="primary"
          size="large"
          onClick={() => setBillPopup(true)}
          style={{
            backgroundColor: "#1890ff",
            borderColor: "#1890ff",
            borderRadius: "8px",
            marginTop: "10px",
          }}
        >
          จ่ายเงิน
        </Button>
      </div>
      <Modal
        title="ออกใบเสร็จ"
        visible={billPopup}
        onCancel={() => setBillPopup(false)}
        footer={null}
        centered
      >
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="customerName"
            label="ชื่อลูกค้า"
            rules={[{ required: true, message: "กรุณากรอกชื่อลูกค้า" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="customerNumber"
            label="เบอร์โทรศัพท์"
            rules={[{ required: true, message: "กรุณากรอกเบอร์โทรศัพท์" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="paymentMode"
            label="วิธีการชำระเงิน"
            rules={[{ required: true, message: "กรุณาเลือกวิธีการชำระเงิน" }]}
          >
            <Select>
              <Select.Option value="cash">เงินสด</Select.Option>
              <Select.Option value="card">บัตรเครดิต</Select.Option>
              <Select.Option value="card">ติดไว้ก่อน</Select.Option>
            </Select>
          </Form.Item>
          <div className="bill-it" style={{ marginBottom: "20px" }}>
            <h5>
              ยอดรวม: <b>{subTotal.toFixed(2)}</b>
            </h5>
            <h4>
              ภาษี: <b>{((subTotal / 100) * 10).toFixed(2)}</b>
            </h4>
            <h3>
              ยอดรวมสุทธิ:{" "}
              <b>{(subTotal + (subTotal / 100) * 10).toFixed(2)}</b>
            </h3>
          </div>
          <div className="d-flex justify-content-end">
            <Button
              type="primary"
              htmlType="submit"
              style={{
                backgroundColor: "#4CAF50",
                borderColor: "#4CAF50",
                borderRadius: "8px",
              }}
            >
              ออกใบเสร็จ
            </Button>
          </div>
        </Form>
      </Modal>
    </DefaultLayout>
  );
};

export default CartPage;

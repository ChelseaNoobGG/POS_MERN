import React, { useEffect, useState } from "react";
import DefaultLayout from "../components/DefaultLayout";
import { useDispatch } from "react-redux";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import axios from "axios";
import { Modal, Button, Table, Form, Input, Select, message } from "antd";

const ItemPage = () => {
  const dispatch = useDispatch();
  const [itemsData, setItemsData] = useState([]);
  const [popupModal, setPopupModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [typesData, setTypesData] = useState([]); // state สำหรับ types

  // ฟังก์ชันสำหรับดึงข้อมูลสินค้า
  const getAllItems = async () => {
    try {
      dispatch({ type: "SHOW_LOADING" });
      const { data } = await axios.get("/api/items/get-item");
      setItemsData(data);
      dispatch({ type: "HIDE_LOADING" });
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      console.log(error);
    }
  };

  // ฟังก์ชันสำหรับดึงข้อมูลประเภทสินค้า
  const getAllTypes = async () => {
    try {
      const { data } = await axios.get("/api/types/get-type");
      setTypesData(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllItems();
    getAllTypes(); // เรียกใช้ getAllTypes เพื่อดึงประเภทสินค้า
  }, []);

  // ฟังก์ชันสำหรับลบสินค้า
  const handleDelete = async (record) => {
    try {
      dispatch({ type: "SHOW_LOADING" });
      await axios.post("/api/items/delete-item", { itemId: record._id });
      message.success("ลบสินค้าเรียบร้อยแล้ว");
      getAllItems();
      dispatch({ type: "HIDE_LOADING" });
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      message.error("เกิดข้อผิดพลาด");
    }
  };

  // column สำหรับ Table
  const columns = [
    { title: "ชื่อสินค้า", dataIndex: "name" },
    {
      title: "รูปภาพ",
      dataIndex: "image",
      render: (image, record) => (
        <img src={image} alt={record.name} height="60" width="60" />
      ),
    },
    { title: "ราคา", dataIndex: "price" },
    { title: "ประเภทสินค้า", dataIndex: "category", render: (category) => category?.name }, // แสดงชื่อของ category
    {
      title: "การกระทำ",
      dataIndex: "_id",
      render: (id, record) => (
        <div>
          <EditOutlined
            style={{ cursor: "pointer", marginRight: "10px", color: "#1890ff" }}
            onClick={() => {
              setEditItem(record);
              setPopupModal(true);
            }}
          />
          <DeleteOutlined
            style={{ cursor: "pointer", color: "#ff4d4f" }}
            onClick={() => handleDelete(record)}
          />
        </div>
      ),
    },
  ];

  // ฟังก์ชันสำหรับจัดการฟอร์ม
  const handleSubmit = async (value) => {
    if (!editItem) {
      try {
        dispatch({ type: "SHOW_LOADING" });
        await axios.post("/api/items/add-item", value);
        message.success("เพิ่มสินค้าเรียบร้อยแล้ว");
        getAllItems();
        setPopupModal(false);
        dispatch({ type: "HIDE_LOADING" });
      } catch (error) {
        dispatch({ type: "HIDE_LOADING" });
        message.error("เกิดข้อผิดพลาด");
      }
    } else {
      try {
        dispatch({ type: "SHOW_LOADING" });
        await axios.put("/api/items/edit-item", {
          ...value,
          itemId: editItem._id,
        });
        message.success("แก้ไขสินค้าเรียบร้อยแล้ว");
        getAllItems();
        setPopupModal(false);
        dispatch({ type: "HIDE_LOADING" });
      } catch (error) {
        dispatch({ type: "HIDE_LOADING" });
        message.error("เกิดข้อผิดพลาด");
      }
    }
  };

  return (
    <DefaultLayout>
      <div className="d-flex justify-content-between mb-4">
        <h1>รายการสินค้า</h1>
        <Button
          type="primary"
          onClick={() => {
            setEditItem(null);
            setPopupModal(true);
          }}
        >
          เพิ่มสินค้า
        </Button>
      </div>

      <Table columns={columns} dataSource={itemsData} bordered rowKey="_id" />

      {popupModal && (
        <Modal
          title={`${editItem ? "แก้ไขสินค้า" : "เพิ่มสินค้า"}`}
          visible={popupModal}
          onCancel={() => {
            setEditItem(null);
            setPopupModal(false);
          }}
          footer={null}
        >
          <Form
            layout="vertical"
            initialValues={editItem}
            onFinish={handleSubmit}
          >
            <Form.Item
              name="name"
              label="ชื่อสินค้า"
              rules={[{ required: true, message: "กรุณากรอกชื่อสินค้า" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="price"
              label="ราคา"
              rules={[{ required: true, message: "กรุณากรอกราคา" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="image"
              label="URL รูปภาพ"
              rules={[{ required: true, message: "กรุณากรอก URL รูปภาพ" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="category"
              label="ประเภทสินค้า"
              rules={[{ required: true, message: "กรุณาเลือกประเภทสินค้า" }]}
            >
              <Select>
                {typesData.map((type) => (
                  <Select.Option key={type._id} value={type._id}>
                    {type.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <div className="d-flex justify-content-end">
              <Button type="primary" htmlType="submit">
                บันทึก
              </Button>
            </div>
          </Form>
        </Modal>
      )}
    </DefaultLayout>
  );
};

export default ItemPage;

import React, { useEffect, useState } from "react";
import DefaultLayout from "../components/DefaultLayout";
import { useDispatch } from "react-redux";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import axios from "axios";
import { Modal, Button, Table, Form, Input, message } from "antd";

const TypePage = () => {
  const dispatch = useDispatch();
  const [typesData, setTypesData] = useState([]);
  const [popupModal, setPopupModal] = useState(false);
  const [editType, setEditType] = useState(null);

  // ฟังก์ชันสำหรับดึงข้อมูลประเภทสินค้า
  const getAllTypes = async () => {
    try {
      dispatch({ type: "SHOW_LOADING" });
      const { data } = await axios.get("/api/types/get-type");
      setTypesData(data);
      dispatch({ type: "HIDE_LOADING" });
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      console.log(error);
    }
  };

  useEffect(() => {
    getAllTypes();
  }, []);

  // ฟังก์ชันสำหรับลบประเภทสินค้า
  const handleDelete = async (record) => {
    try {
      dispatch({ type: "SHOW_LOADING" });
      await axios.post("/api/types/delete-type", { typeId: record._id });
      message.success("ลบประเภทสินค้าสำเร็จ");
      getAllTypes();
      setPopupModal(false);
      dispatch({ type: "HIDE_LOADING" });
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      message.error("เกิดข้อผิดพลาด");
    }
  };

  // คอลัมน์สำหรับ Table
  const columns = [
    { title: "ชื่อประเภท", dataIndex: "name" },
    {
      title: "รูปภาพ",
      dataIndex: "image",
      render: (image, record) => (
        <img src={image} alt={record.name} height="60" width="60" />
      ),
    },
    {
      title: "การกระทำ",
      dataIndex: "_id",
      render: (id, record) => (
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <EditOutlined
            style={{ cursor: "pointer", color: "#1890ff" }}
            onClick={() => {
              setEditType(record);
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
    if (!editType) {
      // เพิ่มประเภทใหม่
      try {
        dispatch({ type: "SHOW_LOADING" });
        await axios.post("/api/types/add-type", value);
        message.success("เพิ่มประเภทสินค้าเรียบร้อยแล้ว");
        getAllTypes();
        setPopupModal(false);
        dispatch({ type: "HIDE_LOADING" });
      } catch (error) {
        dispatch({ type: "HIDE_LOADING" });
        message.error("เกิดข้อผิดพลาด");
      }
    } else {
      // แก้ไขประเภทสินค้า
      try {
        dispatch({ type: "SHOW_LOADING" });
        await axios.put("/api/types/edit-type", {
          ...value,
          typeId: editType._id,
        });
        message.success("แก้ไขประเภทสินค้าเรียบร้อยแล้ว");
        getAllTypes();
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
      <div className="d-flex justify-content-between">
        <h1>รายการประเภทสินค้า</h1>
        <Button
          type="primary"
          onClick={() => {
            setEditType(null);
            setPopupModal(true);
          }}
        >
          เพิ่มประเภทสินค้า
        </Button>
      </div>

      <Table columns={columns} dataSource={typesData} bordered rowKey="_id" />

      {popupModal && (
        <Modal
          title={`${editType ? "แก้ไขประเภทสินค้า" : "เพิ่มประเภทสินค้า"}`}
          visible={popupModal}
          onCancel={() => {
            setEditType(null);
            setPopupModal(false);
          }}
          footer={null}
        >
          <Form
            layout="vertical"
            initialValues={editType}
            onFinish={handleSubmit}
          >
            <Form.Item
              name="name"
              label="ชื่อประเภทสินค้า"
              rules={[{ required: true, message: "กรุณากรอกชื่อประเภทสินค้า" }]}
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

export default TypePage;

import React, { useEffect, useState, useRef } from "react";
import DefaultLayout from "../components/DefaultLayout";
import { useDispatch } from "react-redux";
import { EyeOutlined } from "@ant-design/icons";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
import { Modal, Button, Table } from "antd";
import "../styles/InvoiceStyles.css";

const BillsPage = () => {
  const componentRef = useRef();
  const dispatch = useDispatch();
  const [billsData, setBillsData] = useState([]);
  const [popupModal, setPopupModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);

  // ฟังก์ชันสำหรับดึงข้อมูลใบเสร็จ
  const getAllBills = async () => {
    try {
      dispatch({ type: "SHOW_LOADING" });
      const { data } = await axios.get("/api/bills/get-bills");
      setBillsData(data);
      dispatch({ type: "HIDE_LOADING" });
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      console.log(error);
    }
  };

  // ฟังก์ชันพิมพ์ใบเสร็จ
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  useEffect(() => {
    getAllBills();
  }, []);

  // column สำหรับ Table
  const columns = [
    { title: "ID", dataIndex: "_id" },
    { title: "ชื่อลูกค้า", dataIndex: "customerName" },
    { title: "เบอร์โทร", dataIndex: "customerNumber" },
    { title: "ยอดรวม", dataIndex: "subTotal" },
    { title: "ภาษี", dataIndex: "tax" },
    { title: "ยอดรวมสุทธิ", dataIndex: "totalAmount" },
    {
      title: "การกระทำ",
      dataIndex: "_id",
      render: (id, record) => (
        <div>
          <EyeOutlined
            style={{ cursor: "pointer", color: "#1890ff" }}
            onClick={() => {
              setSelectedBill(record);
              setPopupModal(true);
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <DefaultLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>รายการใบเสร็จ</h1>
      </div>

      <Table
        columns={columns}
        dataSource={billsData}
        bordered
        rowKey="_id"
        style={{ marginBottom: "20px" }}
      />

      {popupModal && (
        <Modal
          width={800}
          title="ใบเสร็จ"
          visible={popupModal}
          onCancel={() => {
            setPopupModal(false);
          }}
          footer={null}
        >
          <div id="invoice" ref={componentRef}>
            <div className="invoice-header">
              <center>
                <h2>ร้านครัวสามแยกหวานปาก</h2>
              </center>
            </div>

            <div className="invoice-customer-info mt-4">
              <p>
                ชื่อลูกค้า: <strong>{selectedBill.customerName}</strong>
                <br />
                เบอร์โทรติดต่อ: <strong>{selectedBill.customerNumber}</strong>
                <br />
                วันที่:{" "}
                <strong>
                  {selectedBill.date
                    ? selectedBill.date.toString().substring(0, 10)
                    : "N/A"}
                </strong>
              </p>
              <hr />
            </div>

            <div className="invoice-table mt-4">
              <table>
                <thead>
                  <tr className="tabletitle">
                    <th className="item">
                      <h3>รายการสินค้า</h3>
                    </th>
                    <th className="Hours">
                      <h3>จำนวน</h3>
                    </th>
                    <th className="Rate">
                      <h3>ราคา</h3>
                    </th>
                    <th className="Rate">
                      <h3>รวม</h3>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedBill.cartItems.map((item) => (
                    <tr className="service" key={item._id}>
                      <td className="tableitem">
                        <p className="itemtext">{item.name}</p>
                      </td>
                      <td className="tableitem">
                        <p className="itemtext">{item.quantity}</p>
                      </td>
                      <td className="tableitem">
                        <p className="itemtext">฿{item.price.toFixed(2)}</p>
                      </td>
                      <td className="tableitem">
                        <p className="itemtext">
                          ฿{(item.quantity * item.price).toFixed(2)}
                        </p>
                      </td>
                    </tr>
                  ))}

                  <tr className="tabletitle">
                    <td />
                    <td />
                    <td className="Rate">
                      <h3>ภาษี</h3>
                    </td>
                    <td className="payment">
                      <h3>฿{selectedBill.tax.toFixed(2)}</h3>
                    </td>
                  </tr>
                  <tr className="tabletitle">
                    <td />
                    <td />
                    <td className="Rate">
                      <h3>ยอดรวมสุทธิ</h3>
                    </td>
                    <td className="payment">
                      <h3>
                        <strong>฿{selectedBill.totalAmount.toFixed(2)}</strong>
                      </h3>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="invoice-footer mt-4">
              <p>
                <strong>ขอบคุณที่ใช้บริการนะครับ</strong>
                <br />
                <b>อย่าลืมกลับมาใช้บริการใหม่อีกครั้งนะครับ</b>
              </p>
            </div>
          </div>

          <div className="d-flex justify-content-end mt-4">
            <Button type="primary" onClick={handlePrint}>
              พิมพ์ใบเสร็จ
            </Button>
          </div>
        </Modal>
      )}
    </DefaultLayout>
  );
};

export default BillsPage;

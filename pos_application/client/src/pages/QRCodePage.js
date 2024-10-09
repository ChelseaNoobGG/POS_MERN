import React, { useState, useRef } from "react";
import DefaultLayout from "../components/DefaultLayout";
import { QRCodeCanvas } from "qrcode.react";
import { Input, Button, Typography, Card } from "antd";

const QRCodePage = () => {
  const [url, setUrl] = useState("https://your-default-url.com");
  const [numTables, setNumTables] = useState(1);
  const qrRef = useRef();

  const handleGenerate = () => {
    if (!url) {
      alert("กรุณาใส่ลิงก์สำหรับสร้าง QR Code");
      return;
    }
    handlePrint();
  };

  const handlePrint = () => {
    const printWindow = window.open("", "", "width=800,height=800");
    printWindow.document.write(`
      <html>
        <head>
          <title>Print QR Codes</title>
          <style>
            body {
              text-align: center;
              padding: 20px;
              font-family: Arial, sans-serif;
            }
            .qr-container {
              display: flex;
              flex-wrap: wrap;
              justify-content: center;
              gap: 20px;
            }
            .qr-item {
              text-align: center;
              margin-bottom: 20px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              border-radius: 8px;
              padding: 10px;
              background-color: #ffffff;
            }
            .qr-item h3 {
              margin-bottom: 10px;
              font-size: 18px;
              color: #333;
            }
            img {
              max-width: 100%;
              height: auto;
              border-radius: 8px;
            }
          </style>
        </head>
        <body>
          ${qrRef.current.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return (
    <DefaultLayout>
      <div style={{ textAlign: "center", padding: "40px 20px", backgroundColor: "#f4f4f4", minHeight: "100vh" }}>
        <Typography.Title level={2} style={{ marginBottom: "30px", color: "#1890ff" }}>
          สร้าง QR Code สำหรับสั่งอาหาร
        </Typography.Title>
        <Input
          style={{ width: "400px", marginBottom: "20px" }}
          placeholder="กรุณาใส่ URL ที่ต้องการ"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <Input
          type="number"
          min={1}
          value={numTables}
          onChange={(e) => setNumTables(e.target.value)}
          placeholder="จำนวนโต๊ะ"
          style={{ width: "400px", marginBottom: "20px" }}
        />
        <div ref={qrRef} className="qr-container" style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap" }}>
          {Array.from({ length: numTables }, (_, index) => (
            <Card
              key={index}
              className="qr-item"
              style={{ width: 200 }}
              hoverable
              bordered={false}
            >
              <Typography.Text style={{ display: "block", marginBottom: "10px", fontWeight: "bold" }}>
                โต๊ะที่ {index + 1}
              </Typography.Text>
              <QRCodeCanvas
                value={`${url}/table/${index + 1}`}
                size={150}
                includeMargin={true}
              />
            </Card>
          ))}
        </div>
        <Button
          type="primary"
          size="large"
          style={{ marginTop: "20px", borderRadius: "8px", padding: "10px 20px" }}
          onClick={handleGenerate}
        >
          พิมพ์
        </Button>
      </div>
    </DefaultLayout>
  );
};

export default QRCodePage;

import React, { useEffect } from "react";
import { Form, Input, Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { message } from "antd";
import axios from "axios";
import { useDispatch } from "react-redux";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (value) => {
    try {
      dispatch({
        type: "SHOW_LOADING",
      });
      await axios.post("/api/users/register", value);
      message.success("ลงทะเบียนสำเร็จ");
      navigate("/login");
      dispatch({ type: "HIDE_LOADING" });
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      message.error("เกิดข้อผิดพลาด");
      console.log(error);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("auth")) {
      navigate("/");
    }
  }, [navigate]);

  // Inline styles
  const containerStyle = {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, rgba(255, 107, 107, 1) 0%, rgba(255, 0, 13, 1) 100%)",
    backgroundSize: "300% 300%",
    animation: "gradientShift 10s ease infinite",
    padding: "20px",
    overflow: "hidden",
  };

  const boxStyle = {
    backgroundColor: "#fff",
    padding: "50px 40px",
    borderRadius: "20px",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
    maxWidth: "400px",
    width: "100%",
    textAlign: "center",
    animation: "slideIn 1s ease-out, fadeIn 1.2s ease-out",
    transform: "rotate(0deg) scale(1)",
    transition: "transform 0.5s ease-in-out, box-shadow 0.5s ease-in-out",
  };

  const titleStyle = {
    fontSize: "36px",
    marginBottom: "20px",
    fontWeight: "bold",
    color: "#FF6B6B",
    animation: "textFade 2s ease-out",
  };

  const subtitleStyle = {
    marginBottom: "30px",
    color: "#555",
    fontSize: "18px",
    animation: "textFade 2.5s ease-out",
  };

  const inputStyle = {
    borderRadius: "12px",
    height: "50px",
    paddingLeft: "15px",
    fontSize: "16px",
    border: "1px solid #d9d9d9",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    transition: "box-shadow 0.3s ease, transform 0.3s ease",
  };

  const inputFocusStyle = {
    boxShadow: "0 5px 10px rgba(255, 107, 107, 0.2)",
    transform: "scale(1.02)",
  };

  const actionsStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "30px",
  };

  const buttonStyle = {
    borderRadius: "12px",
    backgroundColor: "#FF6B6B",
    borderColor: "#FF6B6B",
    padding: "0 30px",
    height: "50px",
    fontSize: "16px",
    fontWeight: "bold",
    boxShadow: "0 5px 10px rgba(0, 0, 0, 0.1)",
    transition: "background-color 0.3s ease, transform 0.2s ease",
  };

  const buttonHoverStyle = {
    backgroundColor: "#E64545",
    transform: "scale(1.1) rotate(2deg)",
    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.3)",
  };

  const linkStyle = {
    marginBottom: 0,
    fontSize: "14px",
    color: "#555",
  };

  return (
    <div style={containerStyle}>
      <div style={boxStyle}>
        <h1 style={titleStyle}>ระบบขายสินค้า</h1>
        <h3 style={subtitleStyle}>หน้าลงทะเบียน</h3>
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="ชื่อ-สกุล"
            rules={[{ required: true, message: "กรุณากรอกชื่อ-สกุล" }]}
          >
            <Input
              style={inputStyle}
              placeholder="กรอกชื่อ-สกุล"
              onFocus={(e) => e.currentTarget.style = { ...inputStyle, ...inputFocusStyle }}
              onBlur={(e) => e.currentTarget.style = inputStyle}
            />
          </Form.Item>
          <Form.Item
            name="userId"
            label="ชื่อผู้ใช้งาน"
            rules={[{ required: true, message: "กรุณากรอกชื่อผู้ใช้งาน" }]}
          >
            <Input
              style={inputStyle}
              placeholder="กรอกชื่อผู้ใช้งาน"
              onFocus={(e) => e.currentTarget.style = { ...inputStyle, ...inputFocusStyle }}
              onBlur={(e) => e.currentTarget.style = inputStyle}
            />
          </Form.Item>
          <Form.Item
            name="password"
            label="รหัสผ่าน"
            rules={[{ required: true, message: "กรุณากรอกรหัสผ่าน" }]}
          >
            <Input
              type="password"
              style={inputStyle}
              placeholder="กรอกรหัสผ่าน"
              onFocus={(e) => e.currentTarget.style = { ...inputStyle, ...inputFocusStyle }}
              onBlur={(e) => e.currentTarget.style = inputStyle}
            />
          </Form.Item>

          <div style={actionsStyle}>
            <p style={linkStyle}>
              มีบัญชีแล้วหรอ?
              <Link to="/login" style={{ color: "#FF6B6B", fontWeight: "bold" }}>
                {" "}
                ไปล็อคอินกันเลย!!!
              </Link>
            </p>
            <Button
              type="primary"
              htmlType="submit"
              style={buttonStyle}
              onMouseEnter={(e) => e.currentTarget.style = { ...buttonStyle, ...buttonHoverStyle }}
              onMouseLeave={(e) => e.currentTarget.style = buttonStyle}
            >
              ลงทะเบียน
            </Button>
          </div>
        </Form>
      </div>

      <style>
        {`
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          @keyframes slideIn {
            0% {
              transform: translateY(50px) scale(0.8);
              opacity: 0;
            }
            100% {
              transform: translateY(0) scale(1);
              opacity: 1;
            }
          }

          @keyframes fadeIn {
            0% {
              opacity: 0;
            }
            100% {
              opacity: 1;
            }
          }

          @keyframes textFade {
            0% {
              opacity: 0;
              transform: translateY(30px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
};

export default Register;

import "antd/dist/antd.min.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CartPage from "./pages/CartPage";
import Homepage from "./pages/Homepage";
import ItemPage from "./pages/ItemPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BillsPage from "./pages/BillsPage";
import TypePage from "./pages/TypePage";
import QRCodePage from "./pages/QRCodePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Homepage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/items"
          element={
            <ProtectedRoute>
              <ItemPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bills"
          element={
            <ProtectedRoute>
              <BillsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/types"
          element={
            <ProtectedRoute>
              <TypePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/qrcode"
          element={
            <ProtectedRoute>
              <QRCodePage />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Route สำหรับการเข้าจาก QR Code */}
        <Route path="/order/:tableId" element={<OrderRoute />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

// Route เฉพาะสำหรับผู้ใช้ที่เข้ามาจากการสแกน QR Code
export function OrderRoute() {
  return (
    <div>
      <Homepage />
      <CartPage />
    </div>
  );
}

// ProtectedRoute เดิม สำหรับผู้ใช้ที่ต้องล็อกอิน
export function ProtectedRoute({ children }) {
  if (localStorage.getItem("auth")) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
}

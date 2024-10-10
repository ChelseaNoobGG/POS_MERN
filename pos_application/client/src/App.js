import "antd/dist/antd.min.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Homepage from "./pages/Homepage";
import ItemPage from "./pages/ItemPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BillsPage from "./pages/BillsPage";
import TypePage from "./pages/TypePage";
import QRCodePage from "./pages/QRCodePage";
import OrderPage from "./pages/OrderPage";
import CartPage from "./pages/CartPage"; // Ensure this path points to your CartPage component
import KitchenPage from "./pages/KitchenPage";
import OrderCartPage from "./pages/OrderCartPage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Protected Routes that require login */}
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

        {/* Route for order page after scanning QR code */}
        <Route path="/order/:tableId" element={<OrderPage />} />
        <Route path="/kitchen" element={<KitchenPage />} />
        <Route path="/orders/:tableId/cart" element={<OrderCartPage />} />
        <Route path="/orders/cart/:tableId" element={<OrderCartPage />} />


        {/* Routes for login and registration */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

// Component for protecting routes (ProtectedRoute) that require login
export function ProtectedRoute({ children }) {
  if (localStorage.getItem("auth")) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
}

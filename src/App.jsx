import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import NewDelivery from "./pages/NewDelivery";
import MyDeliveries from "./pages/MyDeliveries";
import Notifications from "./pages/Notifications";
import DeliveryDetails from "./pages/DeliveryDetails";
import Products from "./pages/Products";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

function ShopHome() {
  window.location.replace("/shop.html");
  return null;
}

function ProtectedRetailerLayout() {
  const isAuthenticated = localStorage.getItem("reflexAuthenticated") === "true";
  const user = JSON.parse(localStorage.getItem("reflexUser") || "null");

  if (!isAuthenticated || user?.role !== "retailer") {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Sidebar />
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path="new-delivery" element={<NewDelivery />} />
        <Route path="my-deliveries" element={<MyDeliveries />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="delivery/:id" element={<DeliveryDetails />} />
        <Route path="products" element={<Products />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/retailer" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ShopHome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/retailer/*" element={<ProtectedRetailerLayout />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

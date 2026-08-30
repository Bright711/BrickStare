import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import NewDelivery from "./pages/NewDelivery";
import MyDeliveries from "./pages/MyDeliveries";
import Notifications from "./pages/Notifications";
import DeliveryDetails from "./pages/DeliveryDetails";
import Products from "./pages/Products";
import Settings from "./pages/Settings";
import Login from "./pages/Login";

function ProtectedLayout() {
  const isAuthenticated =
    localStorage.getItem("reflexAuthenticated") === "true";

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Sidebar />

      <Routes>
        <Route path="/" element={<Dashboard />} />

        <Route
          path="/new-delivery"
          element={<NewDelivery />}
        />

        <Route
          path="/my-deliveries"
          element={<MyDeliveries />}
        />

        <Route
          path="/notifications"
          element={<Notifications />}
        />

        <Route
          path="/delivery/:id"
          element={<DeliveryDetails />}
        />

        <Route
          path="/products"
          element={<Products />}
        />

        <Route
          path="/settings"
          element={<Settings />}
        />

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN PAGE */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* PROTECTED RETAILER PORTAL */}
        <Route
          path="/*"
          element={<ProtectedLayout />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
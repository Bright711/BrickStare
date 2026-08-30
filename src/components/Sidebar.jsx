import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Plus,
  Truck,
  Bell,
  Package,
  Settings,
  LogOut,
} from "lucide-react";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmed = window.confirm(
      "Are you sure you want to log out?"
    );

    if (confirmed) {
      localStorage.removeItem("reflexAuthenticated");
      localStorage.removeItem("reflexUserEmail");
      localStorage.removeItem("reflexUser");

      navigate("/login", { replace: true });
    }
  };

  return (
    <aside className="sidebar">

      {/* LOGO */}
      <div className="logo">
        <div className="logo-mark">B</div>

        <div>
          <h2>BrickStare</h2>
          <span>Retailer Portal</span>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="navigation">

        <NavLink
          to="/retailer"
          end
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          <LayoutDashboard
            size={20}
            strokeWidth={2}
          />

          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/retailer/new-delivery"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          <Plus
            size={20}
            strokeWidth={2}
          />

          <span>New Delivery</span>
        </NavLink>

        <NavLink
          to="/retailer/my-deliveries"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          <Truck
            size={20}
            strokeWidth={2}
          />

          <span>My Deliveries</span>
        </NavLink>

        <NavLink
          to="/retailer/products"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          <Package
            size={20}
            strokeWidth={2}
          />

          <span>Inventory</span>
        </NavLink>

        <NavLink
          to="/retailer/notifications"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          <Bell
            size={20}
            strokeWidth={2}
          />

          <span>Notifications</span>
        </NavLink>

      </nav>

      {/* BOTTOM */}
      <div className="sidebar-bottom">

        <NavLink
          to="/retailer/settings"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          <Settings
            size={20}
            strokeWidth={2}
          />

          <span>Settings</span>
        </NavLink>

        <button
          type="button"
          className="nav-item logout-button"
          onClick={handleLogout}
        >
          <LogOut
            size={20}
            strokeWidth={2}
          />

          <span>Log Out</span>
        </button>

      </div>
    </aside>
  );
}

export default Sidebar;
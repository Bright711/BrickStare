import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
Bell,
Plus,
Package,
Clock,
Truck,
CheckCircle,
} from "lucide-react";

function Dashboard() {
const [deliveries, setDeliveries] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

const navigate = useNavigate();

const fetchDeliveries = useCallback(async () => {
try {
setError("");


  const response = await fetch(
    "http://localhost:5000/api/deliveries"
  );

  if (!response.ok) {
    throw new Error("Failed to load deliveries");
  }

  const data = await response.json();

  if (data.success) {
    setDeliveries(
      Array.isArray(data.deliveries)
        ? data.deliveries
        : []
    );
  } else {
    throw new Error(
      data.message || "Failed to load deliveries"
    );
  }
} catch (err) {
  console.error("Failed to fetch deliveries:", err);
  setError(
    "Unable to load deliveries. Please check that the backend is running."
  );
} finally {
  setLoading(false);
}


}, []);

useEffect(() => {
fetchDeliveries();


const handleFocus = () => {
  fetchDeliveries();
};

window.addEventListener("focus", handleFocus);

return () => {
  window.removeEventListener("focus", handleFocus);
};


}, [fetchDeliveries]);

const totalDeliveries = deliveries.length;

const pendingDeliveries = deliveries.filter(
(delivery) => delivery.status === "Pending"
).length;

const inProgressDeliveries = deliveries.filter(
(delivery) =>
delivery.status === "Assigned" ||
delivery.status === "Picked Up"
).length;

const deliveredDeliveries = deliveries.filter(
(delivery) => delivery.status === "Delivered"
).length;

const recentDeliveries = [...deliveries]
.sort(
(a, b) =>
new Date(b.createdAt || 0) -
new Date(a.createdAt || 0)
)
.slice(0, 4);

return ( <main className="main-content"> <header className="top-header"> <div> <h1>Dashboard</h1> <p>Manage and track your deliveries</p> </div>


    <div className="header-actions">
      <button
        className="notification-button"
        onClick={() => navigate("/notifications")}
        aria-label="Notifications"
      >
        <Bell size={20} strokeWidth={2} />
      </button>

      <div className="profile">
        <div className="avatar">R</div>

        <div>
          <strong>Retailer</strong>
          <span>Store Manager</span>
        </div>
      </div>
    </div>
  </header>

  <section className="welcome-section">
    <div>
      <h2>Good morning, Retailer</h2>
      <p>
        Here's what's happening with your deliveries today.
      </p>
    </div>

    <button
      className="primary-button"
      onClick={() => navigate("/new-delivery")}
    >
      <Plus size={18} strokeWidth={2} />
      <span>New Delivery</span>
    </button>
  </section>

  <section className="stats-grid">
    <div className="stat-card">
      <div className="stat-icon">
        <Package size={24} strokeWidth={2} />
      </div>

      <div>
        <span>Total Deliveries</span>
        <h3>{loading ? "..." : totalDeliveries}</h3>
      </div>
    </div>

    <div className="stat-card">
      <div className="stat-icon">
        <Clock size={24} strokeWidth={2} />
      </div>

      <div>
        <span>Pending</span>
        <h3>{loading ? "..." : pendingDeliveries}</h3>
      </div>
    </div>

    <div className="stat-card">
      <div className="stat-icon">
        <Truck size={24} strokeWidth={2} />
      </div>

      <div>
        <span>In Progress</span>
        <h3>{loading ? "..." : inProgressDeliveries}</h3>
      </div>
    </div>

    <div className="stat-card">
      <div className="stat-icon">
        <CheckCircle size={24} strokeWidth={2} />
      </div>

      <div>
        <span>Delivered</span>
        <h3>{loading ? "..." : deliveredDeliveries}</h3>
      </div>
    </div>
  </section>

  {error && (
    <div className="form-error">
      {error}
    </div>
  )}

  <section className="deliveries-section">
    <div className="section-header">
      <div>
        <h2>Recent Deliveries</h2>
        <p>Track your latest delivery requests</p>
      </div>

      <button
        className="view-all-button"
        onClick={() => navigate("/my-deliveries")}
      >
        View All
      </button>
    </div>

    <div className="delivery-table">
      <div className="table-header">
        <span>Delivery ID</span>
        <span>Customer</span>
        <span>Destination</span>
        <span>Status</span>
        <span>Action</span>
      </div>

      {loading ? (
        <div className="delivery-row">
          <span>Loading deliveries...</span>
        </div>
      ) : recentDeliveries.length === 0 ? (
        <div className="delivery-row">
          <span>No deliveries yet</span>
        </div>
      ) : (
        recentDeliveries.map((delivery) => (
          <div
            className="delivery-row"
            key={delivery.id}
          >
            <span>{delivery.id}</span>

            <span>
              {delivery.customerName}
            </span>

            <span>
              {delivery.destination}
            </span>

            <span
              className={`status ${
                delivery.status === "Pending"
                  ? "pending"
                  : delivery.status === "Assigned"
                  ? "assigned"
                  : delivery.status === "Picked Up"
                  ? "picked-up"
                  : delivery.status === "Delivered"
                  ? "delivered"
                  : ""
              }`}
            >
              {delivery.status}
            </span>

            <button
              className="details-button"
              onClick={() =>
                navigate(
                  `/delivery/${delivery.id}`
                )
              }
            >
              View
            </button>
          </div>
        ))
      )}
    </div>
  </section>
</main>


);
}

export default Dashboard;

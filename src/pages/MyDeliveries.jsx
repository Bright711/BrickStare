import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function MyDeliveries() {
const [deliveries, setDeliveries] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

const navigate = useNavigate();

const fetchDeliveries = useCallback(async () => {
try {
setError("");


  const response = await fetch(
    `http://localhost:5000/api/deliveries?retailerEmail=${encodeURIComponent(localStorage.getItem("reflexUserEmail") || "retailer001@gmail.com")}`
  );

  if (!response.ok) {
    throw new Error("Failed to load deliveries");
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(
      data.message || "Failed to load deliveries"
    );
  }

  setDeliveries(
    Array.isArray(data.deliveries)
      ? data.deliveries
      : []
  );
} catch (err) {
  console.error("Failed to fetch deliveries:", err);

  setError(
    "Unable to load deliveries. Please make sure the backend is running."
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
const intervalId = window.setInterval(fetchDeliveries, 5000);

return () => {
  window.removeEventListener("focus", handleFocus);
  window.clearInterval(intervalId);
};


}, [fetchDeliveries]);

const getStatusClass = (status) => {
switch (status) {
case "Pending":
return "pending";


  case "Assigned":
    return "assigned";

  case "Picked Up":
    return "picked-up";

  case "Delivered":
    return "delivered";

  default:
    return "";
}


};

const handleViewDelivery = (delivery) => {
navigate(`/retailer/delivery/${delivery.id}`, {
state: { delivery },
});
};

return ( <main className="main-content"> <header className="top-header"> <div> <h1>My Deliveries</h1> <p>
View and track all your delivery requests </p> </div> </header>


  <section className="welcome-section">
    <div>
      <h2>All Deliveries</h2>
      <p>
        Keep track of your current and completed
        deliveries.
      </p>
    </div>
  </section>

  {error && (
    <div className="form-error">
      {error}
    </div>
  )}

  <section className="deliveries-section">
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
      ) : deliveries.length === 0 ? (
        <div className="delivery-row">
          <span>No deliveries yet</span>
        </div>
      ) : (
        [...deliveries]
          .sort(
            (a, b) =>
              new Date(b.createdAt || 0) -
              new Date(a.createdAt || 0)
          )
          .map((delivery) => (
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
                className={`status ${getStatusClass(
                  delivery.status
                )}`}
              >
                {delivery.status}
              </span>

              <button
                className="details-button"
                onClick={() =>
                  handleViewDelivery(delivery)
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

export default MyDeliveries;

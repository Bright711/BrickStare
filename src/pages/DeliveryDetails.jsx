import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
Package,
User,
MapPin,
Calendar,
Clock,
FileText,
ArrowLeft,
} from "lucide-react";

function DeliveryDetails() {
const location = useLocation();
const navigate = useNavigate();
const { id } = useParams();

const originalDelivery = location.state?.delivery;

const [delivery, setDelivery] = useState(originalDelivery || null);
const [loading, setLoading] = useState(!originalDelivery);
const [error, setError] = useState("");

// =====================================================
// FETCH DELIVERY
// =====================================================

const fetchDelivery = useCallback(async () => {
const deliveryId = originalDelivery?.id || id;
if (!deliveryId) {
  setLoading(false);
  return;
}


try {
  setError("");

  const response = await fetch(
    `http://localhost:5000/api/deliveries/${deliveryId}`
  );

  if (!response.ok) {
    throw new Error("Failed to load delivery details.");
  }

  const data = await response.json();

  if (!data.success || !data.delivery) {
    throw new Error(
      data.message || "Delivery information could not be found."
    );
  }

  setDelivery(data.delivery);
} catch (err) {
  console.error("Failed to fetch delivery:", err);

  setError(
    err.message || "Unable to load the latest delivery information."
  );
} finally {
  setLoading(false);
}


}, [originalDelivery, id]);

// =====================================================
// LOAD DELIVERY WHEN PAGE OPENS
// =====================================================

useEffect(() => {
fetchDelivery();


const handleFocus = () => {
  fetchDelivery();
};

window.addEventListener("focus", handleFocus);
const intervalId = window.setInterval(fetchDelivery, 5000);

return () => {
  window.removeEventListener("focus", handleFocus);
  window.clearInterval(intervalId);
};


}, [fetchDelivery]);

// =====================================================
// STATUS CSS CLASS
// =====================================================

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

// =====================================================
// LOADING STATE
// =====================================================

if (loading) {
return ( <main className="main-content"> <section className="welcome-section"> <div> <h2>Loading Delivery...</h2> <p>
Please wait while we load the delivery information. </p> </div> </section> </main>
);
}

// =====================================================
// DELIVERY NOT FOUND
// =====================================================

if (!delivery) {
return ( <main className="main-content"> <section className="welcome-section"> <div> <h2>Delivery Not Found</h2> <p>
No delivery information was provided. </p> </div>


      <button
        className="primary-button"
        onClick={() => navigate("/retailer/my-deliveries")}
      >
        <ArrowLeft size={18} />
        Back to My Deliveries
      </button>
    </section>
  </main>
);


}

// =====================================================
// MAIN PAGE
// =====================================================

return ( <main className="main-content"> <header className="top-header"> <div> <h1>Delivery Details</h1> <p>
View and manage this delivery request </p> </div> </header>


  {/* DELIVERY HEADER */}

  <section className="welcome-section">
    <div>
      <h2>{delivery.id}</h2>
      <p>Delivery information</p>
    </div>

    <span
      className={`status ${getStatusClass(delivery.status)}`}
    >
      {delivery.status}
    </span>
  </section>

  {/* ERROR MESSAGE */}

  {error && (
    <section className="deliveries-section">
      <div className="form-error">
        {error}
      </div>
    </section>
  )}

  {/* =====================================================
      PRODUCT INFORMATION
  ===================================================== */}

  <section className="deliveries-section">
    <div className="section-header">
      <div>
        <h2>Product Information</h2>
        <p>
          Product selected for this delivery.
        </p>
      </div>
    </div>

    <div className="delivery-form">
      <div>
        <Package size={20} />

        <label>Product</label>

        <p>
          {delivery.productName ||
            "Product information unavailable"}
        </p>
      </div>

      <div>
        <label>Product ID</label>

        <p>
          {delivery.productId || "Not provided"}
        </p>
      </div>

      <div>
        <label>Price</label>

        <p>
          {delivery.productPrice !== undefined
            ? `KSh ${Number(
                delivery.productPrice
              ).toLocaleString()}`
            : "Not provided"}
        </p>
      </div>
    </div>
  </section>

  {/* =====================================================
      CUSTOMER INFORMATION
  ===================================================== */}

  <section className="deliveries-section">
    <div className="section-header">
      <div>
        <h2>Customer Information</h2>
        <p>
          Information provided when the delivery was created.
        </p>
      </div>
    </div>

    <div className="delivery-form">
      <div>
        <User size={20} />

        <label>Customer Name</label>

        <p>
          {delivery.customerName || "Not provided"}
        </p>
      </div>

      <div>
        <MapPin size={20} />

        <label>Destination</label>

        <p>
          {delivery.destination || "Not provided"}
        </p>
      </div>

      <div>
        <Calendar size={20} />

        <label>Delivery Date</label>

        <p>
          {delivery.deliveryDate || "Not provided"}
        </p>
      </div>

      <div>
        <Clock size={20} />

        <label>Delivery Time</label>

        <p>
          {delivery.deliveryTime || "Not provided"}
        </p>
      </div>

      <div>
        <FileText size={20} />

        <label>Delivery Notes</label>

        <p>
          {delivery.notes ||
            delivery.deliveryNotes ||
            "No delivery notes provided."}
        </p>
      </div>
    </div>
  </section>

  <section className="deliveries-section">
    <div className="section-header"><div><h2>Delivery Progress</h2><p>The delivery status is updated by the assigned rider.</p></div></div>
    <div className="delivery-form">
      {(delivery.statusHistory || [{status: delivery.status, timestamp: delivery.updatedAt || delivery.createdAt}]).map((entry, index) => <div key={`${entry.status}-${index}`}><label>{entry.status}</label><p>{entry.timestamp ? new Date(entry.timestamp).toLocaleString() : ""}</p></div>)}
    </div>
  </section>

  {/* BACK BUTTON */}

  <button
    className="primary-button"
    onClick={() => navigate("/retailer/my-deliveries")}
  >
    <ArrowLeft size={18} />
    Back to My Deliveries
  </button>
</main>


);
}

export default DeliveryDetails;

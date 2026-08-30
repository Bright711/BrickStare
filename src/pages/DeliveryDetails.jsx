import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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

const originalDelivery = location.state?.delivery;

const [delivery, setDelivery] = useState(originalDelivery || null);
const [loading, setLoading] = useState(!originalDelivery);
const [updatingStatus, setUpdatingStatus] = useState(false);
const [error, setError] = useState("");

// =====================================================
// FETCH DELIVERY
// =====================================================

const fetchDelivery = useCallback(async () => {
if (!originalDelivery?.id) {
setLoading(false);
return;
}


try {
  setError("");

  const response = await fetch(
    `http://localhost:5000/api/deliveries/${originalDelivery.id}`
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


}, [originalDelivery]);

// =====================================================
// LOAD DELIVERY WHEN PAGE OPENS
// =====================================================

useEffect(() => {
fetchDelivery();


const handleFocus = () => {
  fetchDelivery();
};

window.addEventListener("focus", handleFocus);

return () => {
  window.removeEventListener("focus", handleFocus);
};


}, [fetchDelivery]);

// =====================================================
// UPDATE DELIVERY STATUS
// =====================================================

const handleStatusChange = async (event) => {
const newStatus = event.target.value;


if (!delivery?.id) {
  return;
}

setUpdatingStatus(true);
setError("");

try {
  const response = await fetch(
    `http://localhost:5000/api/deliveries/${delivery.id}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: newStatus,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(
      data.message || "Failed to update delivery status."
    );
  }

  // Update the delivery displayed on the page
  setDelivery(data.delivery);

  // If a notification was created, log it for testing
  if (data.notification) {
    console.log("Notification created:", data.notification);
  }
} catch (err) {
  console.error("Failed to update delivery status:", err);

  setError(
    err.message || "Unable to update delivery status."
  );
} finally {
  setUpdatingStatus(false);
}


};

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
        onClick={() => navigate("/my-deliveries")}
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

  {/* =====================================================
      DELIVERY STATUS
  ===================================================== */}

  <section className="deliveries-section">
    <div className="section-header">
      <div>
        <h2>Update Delivery Status</h2>
        <p>
          Change the current status of this delivery.
        </p>
      </div>
    </div>

    <div className="delivery-form">
      <div>
        <label htmlFor="deliveryStatus">
          Delivery Status
        </label>

        <select
          id="deliveryStatus"
          value={delivery.status}
          onChange={handleStatusChange}
          disabled={updatingStatus}
        >
          <option value="Pending">
            Pending
          </option>

          <option value="Assigned">
            Assigned
          </option>

          <option value="Picked Up">
            Picked Up
          </option>

          <option value="Delivered">
            Delivered
          </option>
        </select>

        {updatingStatus && (
          <p>
            Updating delivery status...
          </p>
        )}
      </div>
    </div>
  </section>

  {/* BACK BUTTON */}

  <button
    className="primary-button"
    onClick={() => navigate("/my-deliveries")}
  >
    <ArrowLeft size={18} />
    Back to My Deliveries
  </button>
</main>


);
}

export default DeliveryDetails;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Send, PackageCheck } from "lucide-react";

function NewDelivery() {
const navigate = useNavigate();

const [orders, setOrders] = useState([]);
const [loadingOrders, setLoadingOrders] = useState(true);

const [formData, setFormData] = useState({
orderId: "",
customerName: "",
customerPhone: "",
destination: "",
itemDescription: "",
deliveryDate: "",
deliveryTime: "",
notes: "",
});

const [isSubmitting, setIsSubmitting] = useState(false);
const [error, setError] = useState("");

useEffect(() => {
  const fetchOrders = async () => {
    try {
      const email = localStorage.getItem("reflexUserEmail") || "retailer001@gmail.com";
      const response = await fetch(`http://localhost:5000/api/orders`);
      const data = await response.json();
      setOrders(Array.isArray(data.orders) ? data.orders.filter((o) => o.status === "New") : []);
    } catch (err) {
      console.error("Order loading error:", err);
    } finally {
      setLoadingOrders(false);
    }
  };
  fetchOrders();
}, []);

const handleChange = (e) => {
const { name, value } = e.target;

setFormData((previousData) => ({
  ...previousData,
  [name]: value,
}));


};

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  setError("");
  try {
    if (!formData.customerName || !formData.customerPhone || !formData.destination || !formData.itemDescription) {
      throw new Error("Please complete the customer and item details.");
    }
    const response = await fetch("http://localhost:5000/api/deliveries", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, retailerEmail: localStorage.getItem("reflexUserEmail") || "retailer001@gmail.com" })
    });
    const data = await response.json();
    if (!response.ok || !data.success) throw new Error(data.message || "Failed to create delivery");
    navigate("/retailer/my-deliveries");
  } catch (err) { setError(err.message || "Unable to create delivery."); } finally { setIsSubmitting(false); }
};

return ( <main className="main-content"> <header className="top-header"> <div> <h1>New Delivery</h1> <p>Create a new delivery request</p> </div> </header>


  <section className="welcome-section">
    <div>
      <h2>Delivery Details</h2>
      <p>
        Enter the information required for this delivery.
      </p>
    </div>

    <PackageCheck
      size={42}
      strokeWidth={1.5}
    />
  </section>

  <section className="delivery-form-section">
    <form
      onSubmit={handleSubmit}
      className="delivery-form"
    >
      <div className="form-group">
  <label htmlFor="orderId">Customer Order (optional)</label>
  <select id="orderId" name="orderId" value={formData.orderId} onChange={(e) => {
    const order = orders.find((o) => o.id === e.target.value);
    setFormData((prev) => ({ ...prev, orderId: e.target.value, customerName: order?.customerName || prev.customerName, customerPhone: order?.phone || prev.customerPhone, destination: order?.address || prev.destination, itemDescription: order?.items?.map((i) => `${i.productName} x${i.quantity}`).join(", ") || prev.itemDescription }));
  }} disabled={loadingOrders || isSubmitting}>
    <option value="">Select an order or enter details below</option>
    {orders.map((order) => <option key={order.id} value={order.id}>{order.id} · {order.customerName}</option>)}
  </select>
</div>
<div className="form-group"><label htmlFor="customerName">Customer Name</label><input id="customerName" name="customerName" value={formData.customerName} onChange={handleChange} required disabled={isSubmitting}/></div>
<div className="form-group"><label htmlFor="customerPhone">Customer Phone</label><input id="customerPhone" name="customerPhone" value={formData.customerPhone} onChange={handleChange} placeholder="07XX XXX XXX" required disabled={isSubmitting}/></div>
<div className="form-group"><label htmlFor="destination">Delivery Address</label><input id="destination" name="destination" value={formData.destination} onChange={handleChange} placeholder="e.g. Westlands, Nairobi" required disabled={isSubmitting}/></div>
<div className="form-group"><label htmlFor="itemDescription">Item Description</label><textarea id="itemDescription" name="itemDescription" value={formData.itemDescription} onChange={handleChange} placeholder="e.g. LED TV x1" rows="3" required disabled={isSubmitting}/></div>
<div className="form-group"><label htmlFor="deliveryDate">Delivery Date</label><input id="deliveryDate" name="deliveryDate" type="date" value={formData.deliveryDate} onChange={handleChange} required disabled={isSubmitting}/></div>
<div className="form-group"><label htmlFor="deliveryTime">Delivery Time</label><input id="deliveryTime" name="deliveryTime" type="time" value={formData.deliveryTime} onChange={handleChange} required disabled={isSubmitting}/></div>

{/* Error */}
      {error && (
        <div className="form-error">
          {error}
        </div>
      )}

      {/* Buttons */}
      <div className="form-actions">
        <button
          type="button"
          onClick={() => navigate("/retailer")}
          className="cancel-button"
          disabled={isSubmitting}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="submit-button"
          disabled={
            isSubmitting ||
            loadingOrders
          }
        >
          <Send size={18} />

          {isSubmitting
            ? "Creating Delivery..."
            : "Create and Notify Dispatcher"}
        </button>
      </div>
    </form>
  </section>
</main>


);
}

export default NewDelivery;

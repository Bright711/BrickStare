import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Send, PackageCheck } from "lucide-react";

function NewDelivery() {
const navigate = useNavigate();

const [products, setProducts] = useState([]);
const [loadingProducts, setLoadingProducts] = useState(true);

const [formData, setFormData] = useState({
productId: "",
customerName: "",
destination: "",
deliveryDate: "",
deliveryTime: "",
notes: "",
});

const [isSubmitting, setIsSubmitting] = useState(false);
const [error, setError] = useState("");

useEffect(() => {
const fetchProducts = async () => {
try {
const response = await fetch(
"http://localhost:5000/api/products"
);


    if (!response.ok) {
      throw new Error("Failed to load products");
    }

    const data = await response.json();

    console.log("Products API response:", data);

    const productList = Array.isArray(data)
      ? data
      : Array.isArray(data.products)
      ? data.products
      : [];

    setProducts(productList);

    if (productList.length === 0) {
      setError("No products are currently available.");
    }
  } catch (err) {
    console.error("Product loading error:", err);

    setError(
      "Unable to load products. Please make sure the backend is running."
    );
  } finally {
    setLoadingProducts(false);
  }
};

fetchProducts();


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
  if (!formData.productId) {
    throw new Error("Please select a product.");
  }

  const selectedProduct = products.find(
    (product) =>
      String(product.id) ===
      String(formData.productId)
  );

  if (!selectedProduct) {
    throw new Error(
      "Selected product could not be found."
    );
  }

  const deliveryData = {
    ...formData,

    productId: selectedProduct.id,

    productName:
      selectedProduct.name ||
      "Unknown Product",

    productPrice:
      Number(selectedProduct.price) || 0,
  };

  console.log(
    "Creating delivery:",
    deliveryData
  );

  const response = await fetch(
    "http://localhost:5000/api/deliveries",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(deliveryData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to create delivery"
    );
  }

  navigate("/my-deliveries");
} catch (err) {
  console.error(
    "Delivery creation error:",
    err
  );

  setError(
    err.message ||
      "Unable to create delivery. Please try again."
  );
} finally {
  setIsSubmitting(false);
}


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
      {/* Product */}
      <div className="form-group">
        <label htmlFor="productId">
          Product
        </label>

        <select
          id="productId"
          name="productId"
          value={formData.productId}
          onChange={handleChange}
          required
          disabled={
            loadingProducts ||
            isSubmitting
          }
        >
          <option value="">
            {loadingProducts
              ? "Loading products..."
              : products.length === 0
              ? "No products available"
              : "Select a product"}
          </option>

          {products.map((product) => {
            const productId = product.id;

            const productName =
              product.name ||
              "Unnamed Product";

            const price =
              Number(product.price) || 0;

            const stock =
              product.stockCount ??
              product.stock ??
              product.quantity ??
              0;

            return (
              <option
                key={productId}
                value={productId}
                disabled={Number(stock) <= 0}
              >
                {productName} — KSh{" "}
                {price.toLocaleString()} —{" "}
                {stock} available
              </option>
            );
          })}
        </select>
      </div>

      {/* Customer */}
      <div className="form-group">
        <label htmlFor="customerName">
          Customer Name
        </label>

        <input
          id="customerName"
          name="customerName"
          type="text"
          value={formData.customerName}
          onChange={handleChange}
          placeholder="Enter customer name"
          required
          disabled={isSubmitting}
        />
      </div>

      {/* Destination */}
      <div className="form-group">
        <label htmlFor="destination">
          Destination
        </label>

        <input
          id="destination"
          name="destination"
          type="text"
          value={formData.destination}
          onChange={handleChange}
          placeholder="Enter delivery destination"
          required
          disabled={isSubmitting}
        />
      </div>

      {/* Date */}
      <div className="form-group">
        <label htmlFor="deliveryDate">
          Delivery Date
        </label>

        <input
          id="deliveryDate"
          name="deliveryDate"
          type="date"
          value={formData.deliveryDate}
          onChange={handleChange}
          required
          disabled={isSubmitting}
        />
      </div>

      {/* Time */}
      <div className="form-group">
        <label htmlFor="deliveryTime">
          Delivery Time
        </label>

        <input
          id="deliveryTime"
          name="deliveryTime"
          type="time"
          value={formData.deliveryTime}
          onChange={handleChange}
          required
          disabled={isSubmitting}
        />
      </div>

      {/* Notes */}
      <div className="form-group">
        <label htmlFor="notes">
          Additional Notes
        </label>

        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Add any additional delivery instructions"
          rows="4"
          disabled={isSubmitting}
        />
      </div>

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
          onClick={() => navigate("/")}
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
            loadingProducts ||
            products.length === 0
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

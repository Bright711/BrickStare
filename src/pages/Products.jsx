import { useCallback, useEffect, useState } from "react";

function Products() {
const [products, setProducts] = useState([]);
const [showForm, setShowForm] = useState(false);
const [searchTerm, setSearchTerm] = useState("");
const [error, setError] = useState("");
const [isSubmitting, setIsSubmitting] = useState(false);
const [loading, setLoading] = useState(true);

const [formData, setFormData] = useState({
name: "",
price: "",
quantity: "",
description: "",
});

const fetchProducts = useCallback(async () => {
try {
setError("");


  const response = await fetch(
    "http://localhost:5000/api/products"
  );

  if (!response.ok) {
    throw new Error("Failed to load products");
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(
      data.message || "Unable to load products"
    );
  }

  setProducts(
    Array.isArray(data.products)
      ? data.products
      : []
  );
} catch (err) {
  console.error(
    "Failed to fetch products:",
    err
  );

  setError(
    "Unable to connect to the product server. Please make sure the backend is running."
  );
} finally {
  setLoading(false);
}


}, []);

useEffect(() => {
fetchProducts();


const handleFocus = () => {
  fetchProducts();
};

window.addEventListener("focus", handleFocus);

return () => {
  window.removeEventListener(
    "focus",
    handleFocus
  );
};


}, [fetchProducts]);

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
  const name = formData.name.trim();
  const price = Number(formData.price);
  const quantity = Number(formData.quantity);

  if (!name) {
    throw new Error(
      "Please enter a product name."
    );
  }

  if (
    Number.isNaN(price) ||
    price < 0
  ) {
    throw new Error(
      "Please enter a valid product price."
    );
  }

  if (
    Number.isNaN(quantity) ||
    quantity < 0
  ) {
    throw new Error(
      "Please enter a valid stock quantity."
    );
  }

  const response = await fetch(
    "http://localhost:5000/api/products",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        price,
        quantity,
        description:
          formData.description.trim(),
      }),
    }
  );

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(
      data.message ||
        "Failed to add product."
    );
  }

  setFormData({
    name: "",
    price: "",
    quantity: "",
    description: "",
  });

  setShowForm(false);

  await fetchProducts();
} catch (err) {
  console.error(
    "Product creation error:",
    err
  );

  setError(
    err.message ||
      "Unable to add product. Please try again."
  );
} finally {
  setIsSubmitting(false);
}


};

const getStockStatus = (quantity) => {
const numericQuantity = Number(
quantity || 0
);


if (numericQuantity <= 0) {
  return {
    text: "Out of Stock",
    className: "out-of-stock",
  };
}

if (numericQuantity <= 5) {
  return {
    text: "Low Stock",
    className: "low-stock",
  };
}

return {
  text: "In Stock",
  className: "in-stock",
};


};

const filteredProducts = products.filter(
(product) =>
String(product.name || "")
.toLowerCase()
.includes(searchTerm.toLowerCase())
);

return ( <main className="main-content"> <header className="top-header"> <div> <h1>Products</h1> <p>
Manage your products and inventory </p> </div>


    <button
      className="primary-button"
      onClick={() => {
        setError("");
        setShowForm(true);
      }}
    >
      <span>+</span>
      <span>Add Product</span>
    </button>
  </header>

  <section className="welcome-section">
    <div>
      <h2>Product Inventory</h2>
      <p>
        Add products and keep track of your
        available stock.
      </p>
    </div>

    <div>
      <strong>
        {products.length}
      </strong>
      <span> Products</span>
    </div>
  </section>

  {error && (
    <section className="deliveries-section">
      <div className="form-error">
        {error}
      </div>
    </section>
  )}

  <section className="products-section">
    <div className="products-toolbar">
      <div className="search-box">
        <span>Search</span>

        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
        />
      </div>
    </div>

    {loading ? (
      <div className="empty-products">
        <h3>Loading products...</h3>
        <p>
          Please wait while we load your
          inventory.
        </p>
      </div>
    ) : filteredProducts.length === 0 ? (
      <div className="empty-products">
        <div>
          <span>Products</span>
        </div>

        <h3>No products found</h3>

        <p>
          {searchTerm
            ? "No products match your search."
            : "Add a product to start managing your inventory."}
        </p>

        {!searchTerm && (
          <button
            className="primary-button"
            onClick={() => {
              setError("");
              setShowForm(true);
            }}
          >
            <span>+</span>
            <span>Add Product</span>
          </button>
        )}
      </div>
    ) : (
      <div className="products-grid">
        {filteredProducts.map((product) => {
          const quantity = Number(
            product.quantity ?? 0
          );

          const price = Number(
            product.price ?? 0
          );

          const stockStatus =
            getStockStatus(quantity);

          return (
            <div
              className="product-card"
              key={product.id}
            >
              <div className="product-icon">
                <span>Product</span>
              </div>

              <div className="product-info">
                <h3>
                  {product.name}
                </h3>

                <p className="product-description">
                  {product.description ||
                    "No description provided."}
                </p>
              </div>

              <div className="product-footer">
                <div>
                  <strong>
                    KSh{" "}
                    {price.toLocaleString()}
                  </strong>

                  <span>
                    {quantity} available
                  </span>
                </div>

                <span
                  className={
                    "stock-status " +
                    stockStatus.className
                  }
                >
                  {stockStatus.text}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    )}
  </section>

  {showForm && (
    <div className="modal-overlay">
      <div className="product-modal">
        <div className="modal-header">
          <div>
            <h2>Add New Product</h2>

            <p>
              Enter the details of the new
              product.
            </p>
          </div>

          <button
            type="button"
            className="close-button"
            onClick={() =>
              setShowForm(false)
            }
            disabled={isSubmitting}
            aria-label="Close"
          >
            X
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="product-form"
        >
          <div className="form-group">
            <label htmlFor="name">
              Product Name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">
                Price (KSh)
              </label>

              <input
                id="price"
                name="price"
                type="number"
                min="0"
                step="1"
                value={formData.price}
                onChange={handleChange}
                placeholder="0"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="quantity">
                Initial Stock
              </label>

              <input
                id="quantity"
                name="quantity"
                type="number"
                min="0"
                step="1"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="0"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">
              Description
            </label>

            <textarea
              id="description"
              name="description"
              value={
                formData.description
              }
              onChange={handleChange}
              placeholder="Describe the product"
              rows="4"
              disabled={isSubmitting}
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={() =>
                setShowForm(false)
              }
              disabled={isSubmitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Adding Product..."
                : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )}
</main>


);
}

export default Products;

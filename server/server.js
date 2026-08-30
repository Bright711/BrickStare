import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const now = () => new Date().toISOString();

// Demo accounts used by the prototype. Password is intentionally simple for the demo.
const users = [
  ...Array.from({ length: 5 }, (_, i) => ({ email: `retailer00${i + 1}@gmail.com`, password: "1234", role: "retailer", name: `Retailer 00${i + 1}` })),
  ...Array.from({ length: 5 }, (_, i) => ({ email: `dispatcher00${i + 1}@gmail.com`, password: "1234", role: "dispatcher", name: `Dispatcher 00${i + 1}` })),
  ...Array.from({ length: 5 }, (_, i) => ({ email: `rider00${i + 1}@gmail.com`, password: "1234", role: "rider", name: `Rider 00${i + 1}` })),
  { email: "customer001@gmail.com", password: "1234", role: "customer", name: "Customer 001" },
];

const riders = Array.from({ length: 5 }, (_, i) => ({
  id: `RIDER-00${i + 1}`,
  email: `rider00${i + 1}@gmail.com`,
  name: `Rider 00${i + 1}`,
  status: "Available",
}));

let products = [
  { id: "PROD-EL-001", name: "LED Smart TV 43-inch", category: "Electronics", description: "43-inch LED smart television", price: 32999, quantity: 8, image: "images/product-1.png", createdAt: now() },
  { id: "PROD-EL-002", name: "Wireless Bluetooth Speaker", category: "Electronics", description: "Portable Bluetooth speaker", price: 3499, quantity: 15, image: "images/product-2.png", createdAt: now() },
  { id: "PROD-PH-001", name: "Digital Thermometer", category: "Pharmacy", description: "Digital thermometer for home use", price: 850, quantity: 20, image: "images/product-3.png", createdAt: now() },
  { id: "PROD-PH-002", name: "First Aid Kit", category: "Pharmacy", description: "Basic first aid supplies for home and shop use", price: 1800, quantity: 12, image: "images/support.svg", createdAt: now() },
  { id: "PROD-HW-001", name: "Claw Hammer", category: "Hardware", description: "Steel claw hammer for general repairs", price: 950, quantity: 18, image: "images/Hammer.png", createdAt: now() },
  { id: "PROD-HW-002", name: "Adjustable Spanner", category: "Hardware", description: "Adjustable spanner for household repairs", price: 1250, quantity: 16, image: "images/spanner.png", createdAt: now() },
  { id: "PROD-HW-003", name: "Measuring Tape 5m", category: "Hardware", description: "5 metre measuring tape", price: 650, quantity: 25, image: "images/Tapemeasure.png", createdAt: now() },
];

let orders = [];
let deliveries = [];
let notifications = [];

app.get("/api/health", (_req, res) => res.json({ success: true, message: "Reflex backend is running" }));

app.post("/api/auth/login", (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");
  const user = users.find((item) => item.email === email && item.password === password);
  if (!user) return res.status(401).json({ success: false, message: "Invalid email or password" });
  return res.json({ success: true, user: { email: user.email, role: user.role, name: user.name } });
});

app.post("/api/auth/register", (req, res) => {
  const name = String(req.body.name || "").trim();
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");

  if (!name || !email || password.length < 4) {
    return res.status(400).json({ success: false, message: "Name, email and a password of at least 4 characters are required" });
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ success: false, message: "Enter a valid email address" });
  }
  if (users.some((user) => user.email === email)) {
    return res.status(409).json({ success: false, message: "An account with this email already exists" });
  }

  const user = { email, password, role: "customer", name };
  users.push(user);
  return res.status(201).json({ success: true, user: { email, role: "customer", name } });
});

app.get("/api/users/riders", (_req, res) => res.json({ success: true, riders }));

app.get("/api/products", (_req, res) => res.json({ success: true, products }));

app.post("/api/orders", (req, res) => {
  const { customerEmail, customerName, phone, address, items, retailerEmail } = req.body;
  if (!customerEmail || !customerName || !phone || !address || !Array.isArray(items) || !items.length) {
    return res.status(400).json({ success: false, message: "Customer details and at least one cart item are required" });
  }

  const orderItems = [];
  for (const cartItem of items) {
    const product = products.find((p) => p.id === cartItem.productId);
    const quantity = Number(cartItem.quantity || 0);
    if (!product || quantity < 1) return res.status(400).json({ success: false, message: "Invalid cart item" });
    if (product.quantity < quantity) return res.status(400).json({ success: false, message: `${product.name} does not have enough stock` });
    orderItems.push({ productId: product.id, productName: product.name, quantity, price: product.price, image: product.image });
  }

  orderItems.forEach((item) => {
    const product = products.find((p) => p.id === item.productId);
    product.quantity -= item.quantity;
  });

  const order = {
    id: `ORD-${Date.now()}`,
    customerEmail,
    retailerEmail: retailerEmail || "retailer001@gmail.com",
    customerName,
    phone,
    address,
    items: orderItems,
    total: orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    status: "New",
    createdAt: now(),
  };
  orders.push(order);
  notifications.push({ id: `NOTIF-${Date.now()}`, recipient: "retailer", type: "NEW_ORDER", orderId: order.id, title: "New customer order", message: `${order.id} is ready for delivery processing.`, status: "Unread", createdAt: now() });
  return res.status(201).json({ success: true, order });
});

app.get("/api/orders", (req, res) => {
  const email = req.query.customerEmail;
  const retailerEmail = req.query.retailerEmail;
  const filtered = retailerEmail ? orders.filter((order) => order.retailerEmail === retailerEmail) : (email ? orders.filter((order) => order.customerEmail === email) : orders);
  res.json({ success: true, orders: filtered });
});

app.get("/api/deliveries", (req, res) => {
  let result = [...deliveries];
  if (req.query.riderId) result = result.filter((d) => d.riderId === req.query.riderId);
  if (req.query.retailerEmail) result = result.filter((d) => d.retailerEmail === req.query.retailerEmail);
  if (req.query.status) result = result.filter((d) => d.status === req.query.status);
  res.json({ success: true, deliveries: result });
});

app.get("/api/deliveries/:id", (req, res) => {
  const delivery = deliveries.find((item) => item.id === req.params.id);
  if (!delivery) return res.status(404).json({ success: false, message: "Delivery not found" });
  res.json({ success: true, delivery });
});

app.post("/api/deliveries", (req, res) => {
  const { orderId, retailerEmail, customerName, customerPhone, destination, itemDescription, productId, productName, quantity, notes } = req.body;
  if (!customerName || !customerPhone || !destination || !itemDescription) {
    return res.status(400).json({ success: false, message: "Customer name, phone, address and item description are required" });
  }

  const order = orderId ? orders.find((item) => item.id === orderId) : null;
  const delivery = {
    id: `DEL-${Date.now()}`,
    orderId: order?.id || null,
    retailerEmail: retailerEmail || "retailer001@gmail.com",
    customerName,
    customerPhone,
    destination,
    itemDescription,
    productId: productId || order?.items?.[0]?.productId || null,
    productName: productName || order?.items?.map((i) => `${i.productName} x${i.quantity}`).join(", ") || itemDescription,
    quantity: Number(quantity || 1),
    notes: notes || "",
    status: "Pending",
    dispatchStatus: "Awaiting Dispatcher",
    riderId: null,
    riderName: null,
    packageVerified: false,
    createdAt: now(),
    updatedAt: now(),
    statusHistory: [{ status: "Pending", timestamp: now() }],
  };
  deliveries.push(delivery);
  if (order) order.status = "Delivery Requested";
  const notification = { id: `NOTIF-${Date.now()}`, recipient: "dispatcher", type: "AVAILABLE_DELIVERY", deliveryId: delivery.id, title: "New delivery request", message: `${delivery.id} is ready for assignment.`, status: "Unread", createdAt: now() };
  notifications.push(notification);
  res.status(201).json({ success: true, message: "Delivery created successfully", delivery, notification });
});

app.patch("/api/deliveries/:id/assign", (req, res) => {
  const { riderId } = req.body;
  const delivery = deliveries.find((item) => item.id === req.params.id);
  const rider = riders.find((item) => item.id === riderId);
  if (!delivery) return res.status(404).json({ success: false, message: "Delivery not found" });
  if (!rider) return res.status(404).json({ success: false, message: "Rider not found" });
  if (rider.status !== "Available") return res.status(409).json({ success: false, message: "This rider already has an active delivery" });
  if (delivery.status !== "Pending") return res.status(400).json({ success: false, message: "Only pending deliveries can be assigned" });
  delivery.riderId = rider.id;
  delivery.riderName = rider.name;
  delivery.status = "Assigned";
  delivery.dispatchStatus = "Assigned";
  delivery.updatedAt = now();
  delivery.statusHistory.push({ status: "Assigned", timestamp: delivery.updatedAt });
  rider.status = "Assigned";
  res.json({ success: true, message: `Delivery assigned to ${rider.name}`, delivery });
});

app.patch("/api/deliveries/:id/status", (req, res) => {
  const { status } = req.body;
  const allowed = ["Pending", "Assigned", "Picked Up", "Delivered"];
  const delivery = deliveries.find((item) => item.id === req.params.id);
  if (!delivery) return res.status(404).json({ success: false, message: "Delivery not found" });
  if (!allowed.includes(status)) return res.status(400).json({ success: false, message: "Invalid delivery status" });
  const nextStatus = { "Pending": "Assigned", "Assigned": "Picked Up", "Picked Up": "Delivered" };
  if (status !== delivery.status && nextStatus[delivery.status] !== status) {
    return res.status(400).json({ success: false, message: `Delivery must move from ${delivery.status} to ${nextStatus[delivery.status] || "completion"}` });
  }
  if (status === "Assigned" && !delivery.riderId) return res.status(400).json({ success: false, message: "Assign a rider first" });
  if (status === "Delivered" && !delivery.packageVerified) return res.status(400).json({ success: false, message: "Package must be verified before delivery can be completed" });
  delivery.status = status;
  delivery.updatedAt = now();
  delivery.statusHistory.push({ status, timestamp: delivery.updatedAt });
  if (status === "Delivered") {
    const rider = riders.find((item) => item.id === delivery.riderId);
    if (rider) rider.status = "Available";
    if (delivery.orderId) {
      const linkedOrder = orders.find((item) => item.id === delivery.orderId);
      if (linkedOrder) linkedOrder.status = "Delivered";
    }
    notifications.push({ id: `NOTIF-${Date.now()}`, recipient: "retailer", type: "DELIVERY_COMPLETED", deliveryId: delivery.id, title: "Delivery completed", message: `${delivery.id} has been delivered.`, status: "Unread", createdAt: now() });
  }
  res.json({ success: true, delivery });
});

app.post("/api/deliveries/:id/verify", (req, res) => {
  const { packageId, method } = req.body;
  const delivery = deliveries.find((item) => item.id === req.params.id);
  if (!delivery) return res.status(404).json({ success: false, message: "Delivery not found" });
  if (delivery.status !== "Picked Up") return res.status(400).json({ success: false, message: "Package verification is available after pickup" });
  const supplied = String(packageId || "").trim().toUpperCase();
  const valid = supplied === delivery.id.toUpperCase() || supplied === String(delivery.orderId || "").toUpperCase();
  if (!valid) return res.status(400).json({ success: false, verified: false, message: "Package ID does not match this delivery" });
  delivery.packageVerified = true;
  delivery.verificationMethod = method || "manual";
  delivery.verifiedAt = now();
  delivery.updatedAt = delivery.verifiedAt;
  res.json({ success: true, verified: true, message: "Package verified", delivery });
});

app.get("/api/notifications/:recipient", (req, res) => {
  res.json({ success: true, notifications: notifications.filter((n) => n.recipient === req.params.recipient) });
});

app.listen(PORT, () => console.log(`Reflex backend running on http://localhost:${PORT}`));

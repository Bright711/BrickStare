import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// =====================================================
// TEMPORARY IN-MEMORY DATA
// =====================================================

let deliveries = [];

let products = [
{
id: "PROD-1788057776179",
name: "Test Product",
description: "Test product for Reflex",
price: 1500,
quantity: 10,
createdAt: new Date().toISOString(),
},
];

let notifications = [];

// =====================================================
// HEALTH CHECK
// =====================================================

app.get("/api/health", (req, res) => {
res.json({
success: true,
message: "Reflex backend is running",
});
});

// =====================================================
// DELIVERIES
// =====================================================

// Get all deliveries
app.get("/api/deliveries", (req, res) => {
res.json({
success: true,
deliveries,
});
});

// Get one delivery
app.get("/api/deliveries/:id", (req, res) => {
const delivery = deliveries.find(
(item) => item.id === req.params.id
);

if (!delivery) {
return res.status(404).json({
success: false,
message: "Delivery not found",
});
}

return res.json({
success: true,
delivery,
});
});

// =====================================================
// CREATE DELIVERY
// =====================================================

app.post("/api/deliveries", (req, res) => {
const {
productId,
customerName,
destination,
deliveryDate,
deliveryTime,
notes,
} = req.body;

if (
!productId ||
!customerName ||
!destination ||
!deliveryDate ||
!deliveryTime
) {
return res.status(400).json({
success: false,
message:
"Please provide product, customer name, destination, delivery date and delivery time",
});
}

const product = products.find(
(item) => item.id === productId
);

if (!product) {
return res.status(404).json({
success: false,
message: "Selected product not found",
});
}

if (Number(product.quantity) <= 0) {
return res.status(400).json({
success: false,
message: "Selected product is out of stock",
});
}

product.quantity = Number(product.quantity) - 1;

const delivery = {
id: "DEL-" + Date.now(),
productId: product.id,
productName: product.name,
productPrice: product.price,
customerName,
destination,
deliveryDate,
deliveryTime,
notes: notes || "",
status: "Pending",
dispatchStatus: "Awaiting Dispatcher",
createdAt: new Date().toISOString(),
};

deliveries.push(delivery);

const dispatcherNotification = {
id: "NOTIF-" + Date.now(),
type: "AVAILABLE_DELIVERY",
recipient: "dispatcher",
deliveryId: delivery.id,
title: "New Delivery Available",
message:
"Delivery " +
delivery.id +
" is ready for dispatch.",
status: "Unread",
createdAt: new Date().toISOString(),
};

notifications.push(dispatcherNotification);

return res.status(201).json({
success: true,
message: "Delivery created successfully",
delivery,
notification: dispatcherNotification,
});
});

// =====================================================
// UPDATE DELIVERY STATUS
// =====================================================

app.patch("/api/deliveries/:id/status", (req, res) => {
const { status } = req.body;

const allowedStatuses = [
"Pending",
"Assigned",
"Picked Up",
"Delivered",
];

if (!status || !allowedStatuses.includes(status)) {
return res.status(400).json({
success: false,
message:
"Invalid status. Allowed statuses are Pending, Assigned, Picked Up and Delivered.",
});
}

const delivery = deliveries.find(
(item) => item.id === req.params.id
);

if (!delivery) {
return res.status(404).json({
success: false,
message: "Delivery not found",
});
}

delivery.status = status;
delivery.updatedAt = new Date().toISOString();

let retailerNotification = null;

if (status === "Delivered") {
retailerNotification = {
id: "NOTIF-" + Date.now(),
type: "DELIVERY_COMPLETED",
recipient: "retailer",
deliveryId: delivery.id,
title: "Delivery Completed",
message:
"Delivery " +
delivery.id +
" for " +
delivery.customerName +
" has been delivered successfully.",
status: "Unread",
createdAt: new Date().toISOString(),
};


notifications.push(retailerNotification);

console.log(
  "Retailer notification created:",
  retailerNotification
);


}

return res.json({
success: true,
message:
status === "Delivered"
? "Delivery marked as delivered"
: "Delivery status updated",
delivery,
notification: retailerNotification,
});
});

// =====================================================
// PRODUCTS
// =====================================================

// Get all products
app.get("/api/products", (req, res) => {
return res.json({
success: true,
products,
});
});

// Add product
app.post("/api/products", (req, res) => {
const {
name,
description,
price,
quantity,
} = req.body;

if (
!name ||
price === undefined ||
quantity === undefined
) {
return res.status(400).json({
success: false,
message:
"Product name, price and quantity are required",
});
}

const numericPrice = Number(price);
const numericQuantity = Number(quantity);

if (
Number.isNaN(numericPrice) ||
Number.isNaN(numericQuantity) ||
numericPrice < 0 ||
numericQuantity < 0
) {
return res.status(400).json({
success: false,
message:
"Price and quantity must be valid positive numbers",
});
}

const product = {
id: "PROD-" + Date.now(),
name,
description: description || "",
price: numericPrice,
quantity: numericQuantity,
createdAt: new Date().toISOString(),
};

products.push(product);

return res.status(201).json({
success: true,
message: "Product added successfully",
product,
});
});

// Update product quantity
app.patch("/api/products/:id/quantity", (req, res) => {
const { quantity } = req.body;

const product = products.find(
(item) => item.id === req.params.id
);

if (!product) {
return res.status(404).json({
success: false,
message: "Product not found",
});
}

const numericQuantity = Number(quantity);

if (
Number.isNaN(numericQuantity) ||
numericQuantity < 0
) {
return res.status(400).json({
success: false,
message:
"Quantity must be a valid positive number",
});
}

product.quantity = numericQuantity;

return res.json({
success: true,
message: "Product quantity updated",
product,
});
});

// =====================================================
// NOTIFICATIONS
// =====================================================

// Get all notifications
app.get("/api/notifications", (req, res) => {
return res.json({
success: true,
notifications,
});
});

// Get retailer notifications
app.get("/api/notifications/retailer", (req, res) => {
const retailerNotifications = notifications.filter(
(notification) =>
notification.recipient === "retailer"
);

return res.json({
success: true,
notifications: retailerNotifications,
});
});

// Get dispatcher notifications
app.get("/api/notifications/dispatcher", (req, res) => {
const dispatcherNotifications = notifications.filter(
(notification) =>
notification.recipient === "dispatcher"
);

return res.json({
success: true,
notifications: dispatcherNotifications,
});
});

// Mark notification as read
app.patch("/api/notifications/:id/read", (req, res) => {
const notification = notifications.find(
(item) => item.id === req.params.id
);

if (!notification) {
return res.status(404).json({
success: false,
message: "Notification not found",
});
}

notification.status = "Read";

return res.json({
success: true,
message: "Notification marked as read",
notification,
});
});

// =====================================================
// SERVER
// =====================================================

app.listen(PORT, () => {
console.log(
`Reflex backend running on http://localhost:${PORT}`
);
});

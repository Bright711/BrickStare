const riderData = {
  name: "Brian Mwangi",

  deliveries: [
    {
      id: "REF-1025",
      customer: "Mary Wanjiku",
      phone: "0701 234 567",
      address: "Kilimani, Nairobi",
      item: "Heavy Duty Spanner x 3",
      status: "assigned",
      time: "10:30 AM",
    },

    {
      id: "REF-1026",
      customer: "David Mwangi",
      phone: "0722 987 654",
      address: "Lavington, Nairobi",
      item: "Mattock x 1",
      status: "picked-up",
      time: "11:15 AM",
    },

    {
      id: "REF-1027",
      customer: "Grace Wanjiku",
      phone: "0798 123 456",
      address: "South B, Nairobi",
      item: "Wheelbarrow x 1",
      status: "delivered",
      time: "12:40 PM",
    },
  ],
};

document.addEventListener("DOMContentLoaded", function () {
  initializeRider();
  initializeFilters();
  initializeDeliveryButtons();
  initializeMobileMenu();
  initializeModal();
  initializeLogout();
  initializeActiveDelivery();
});

function initializeRider() {
  const navName = document.getElementById("navRiderName");
  const pageName = document.getElementById("pageRiderName");

  if (navName) {
    navName.textContent = riderData.name;
  }

  if (pageName) {
    pageName.textContent = riderData.name.split(" ")[0];
  }

  const dateElement = document.getElementById("currentDate");

  if (dateElement) {
    const today = new Date();

    const options = {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    };

    dateElement.textContent = today.toLocaleDateString("en-US", options);
  }
}

function initializeFilters() {
  const filterButtons = document.querySelectorAll(".filter-button");
  const deliveryCards = document.querySelectorAll(".delivery-card");

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      filterButtons.forEach(function (item) {
        item.classList.remove("active");
      });

      button.classList.add("active");

      const filter = button.dataset.filter;

      deliveryCards.forEach(function (card) {
        const status = card.dataset.status;

        if (filter === "all" || filter === status) {
          card.classList.remove("hidden");
        } else {
          card.classList.add("hidden");
        }
      });
    });
  });
}

function initializeDeliveryButtons() {
  const updateButtons = document.querySelectorAll(".update-status-button");

  updateButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const card = button.closest(".delivery-card");

      if (!card) return;

      const deliveryId = card.dataset.id;

      updateDeliveryStatus(deliveryId);
    });
  });

  const viewButtons = document.querySelectorAll(".view-delivery-button");

  viewButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const card = button.closest(".delivery-card");

      if (!card) return;

      openDeliveryModal(card.dataset.id);
    });
  });
}

function updateDeliveryStatus(deliveryId) {
  const delivery = riderData.deliveries.find(function (item) {
    return item.id === deliveryId;
  });

  if (!delivery) {
    return;
  }

  if (delivery.status === "assigned") {
    delivery.status = "picked-up";

    showNotification("Delivery marked as Picked Up.");
  } else if (delivery.status === "picked-up") {
    delivery.status = "delivered";

    showNotification("Delivery marked as Delivered.");
  } else {
    showNotification("This delivery is already complete.");

    return;
  }

  updateDeliveryUI(delivery);

  updateCounters();
}

function updateDeliveryUI(delivery) {
  const card = document.querySelector(
    `.delivery-card[data-id="${delivery.id}"]`,
  );

  if (!card) return;

  const statusElement = card.querySelector(".delivery-status");

  if (statusElement) {
    statusElement.textContent = formatStatus(delivery.status);

    statusElement.className =
      "delivery-status " + getStatusClass(delivery.status);
  }

  card.dataset.status = delivery.status;

  const button = card.querySelector(".update-status-button");

  if (button) {
    if (delivery.status === "delivered") {
      button.style.display = "none";
    } else {
      button.style.display = "inline-block";
    }
  }

  updateActiveDelivery(delivery);
}

function initializeActiveDelivery() {
  const active = riderData.deliveries.find(function (delivery) {
    return delivery.status === "picked-up";
  });

  if (active) {
    updateActiveDelivery(active);
  }
}

function updateActiveDelivery(delivery) {
  const id = document.getElementById("activeDeliveryId");
  const customer = document.getElementById("activeCustomer");
  const phone = document.getElementById("activePhone");
  const address = document.getElementById("activeAddress");
  const item = document.getElementById("activeItem");
  const status = document.getElementById("activeDeliveryStatus");

  if (id) {
    id.textContent = delivery.id;
  }

  if (customer) {
    customer.textContent = delivery.customer;
  }

  if (phone) {
    phone.textContent = delivery.phone;
  }

  if (address) {
    address.textContent = delivery.address;
  }

  if (item) {
    item.textContent = delivery.item;
  }

  if (status) {
    status.textContent = formatStatus(delivery.status);
    status.className = "delivery-status " + getStatusClass(delivery.status);
  }
}

const activeButton = document.getElementById("updateDeliveryButton");

if (activeButton) {
  activeButton.addEventListener("click", function () {
    const active = riderData.deliveries.find(function (delivery) {
      return delivery.status === "picked-up";
    });

    if (!active) {
      showNotification("No active delivery found.");

      return;
    }

    updateDeliveryStatus(active.id);
  });
}

function formatStatus(status) {
  if (status === "assigned") {
    return "Assigned";
  }

  if (status === "picked-up") {
    return "Picked Up";
  }

  if (status === "delivered") {
    return "Delivered";
  }

  return status;
}

function getStatusClass(status) {
  if (status === "assigned") {
    return "status-assigned";
  }

  if (status === "picked-up") {
    return "status-picked-up";
  }

  if (status === "delivered") {
    return "status-delivered";
  }

  return "";
}

function updateCounters() {
  const assigned = riderData.deliveries.filter(function (delivery) {
    return delivery.status === "assigned";
  }).length;

  const pickedUp = riderData.deliveries.filter(function (delivery) {
    return delivery.status === "picked-up";
  }).length;

  const delivered = riderData.deliveries.filter(function (delivery) {
    return delivery.status === "delivered";
  }).length;

  const assignedCount = document.getElementById("assignedCount");
  const pickedUpCount = document.getElementById("pickedUpCount");
  const deliveredCount = document.getElementById("deliveredCount");
  const totalCount = document.getElementById("totalCount");

  if (assignedCount) {
    assignedCount.textContent = assigned;
  }

  if (pickedUpCount) {
    pickedUpCount.textContent = pickedUp;
  }

  if (deliveredCount) {
    deliveredCount.textContent = delivered;
  }

  if (totalCount) {
    totalCount.textContent = riderData.deliveries.length;
  }
}

function initializeModal() {
  const modal = document.getElementById("deliveryModal");

  const closeButton = document.getElementById("closeDeliveryModal");

  const overlay = modal.querySelector(".rider-modal-overlay");

  if (closeButton) {
    closeButton.addEventListener("click", closeDeliveryModal);
  }

  if (overlay) {
    overlay.addEventListener("click", closeDeliveryModal);
  }

  const modalUpdateButton = document.getElementById("modalUpdateButton");

  if (modalUpdateButton) {
    modalUpdateButton.addEventListener("click", function () {
      const id = modalUpdateButton.dataset.id;

      if (id) {
        updateDeliveryStatus(id);

        closeDeliveryModal();
      }
    });
  }
}

function openDeliveryModal(deliveryId) {
  const delivery = riderData.deliveries.find(function (item) {
    return item.id === deliveryId;
  });

  if (!delivery) return;

  const modal = document.getElementById("deliveryModal");

  document.getElementById("modalDeliveryId").textContent = delivery.id;
  document.getElementById("modalCustomer").textContent = delivery.customer;
  document.getElementById("modalPhone").textContent = delivery.phone;
  document.getElementById("modalAddress").textContent = delivery.address;
  document.getElementById("modalItem").textContent = delivery.item;
  document.getElementById("modalStatus").textContent = formatStatus(
    delivery.status,
  );

  document.getElementById("modalUpdateButton").dataset.id = delivery.id;

  modal.classList.add("open");

  document.body.style.overflow = "hidden";
}

function closeDeliveryModal() {
  const modal = document.getElementById("deliveryModal");

  modal.classList.remove("open");

  document.body.style.overflow = "";
}

function initializeMobileMenu() {
  const menuButton = document.getElementById("mobileMenuButton");

  const menu = document.getElementById("mobileRiderMenu");

  if (!menuButton || !menu) {
    return;
  }

  menuButton.addEventListener("click", function () {
    menu.classList.toggle("open");
  });

  menu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      menu.classList.remove("open");
    });
  });
}

const callButton = document.getElementById("callCustomerButton");

if (callButton) {
  callButton.addEventListener("click", function (event) {
    event.preventDefault();

    const active = riderData.deliveries.find(function (delivery) {
      return delivery.status === "picked-up";
    });

    if (!active) {
      showNotification("No active customer found.");

      return;
    }

    const cleanPhone = active.phone.replace(/\s/g, "");

    window.location.href = "tel:" + cleanPhone;
  });
}

function initializeLogout() {
  const logoutButtons = document.querySelectorAll("#mobileLogout");

  const logoutModal = document.getElementById("logoutModal");

  const cancelLogout = document.getElementById("cancelLogout");

  const confirmLogout = document.getElementById("confirmLogout");

  logoutButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      logoutModal.classList.add("open");
    });
  });

  if (cancelLogout) {
    cancelLogout.addEventListener("click", function () {
      logoutModal.classList.remove("open");
    });
  }

  if (confirmLogout) {
    confirmLogout.addEventListener("click", function () {
      window.location.href = "login.html";
    });
  }
}

function showNotification(message) {
  const existing = document.querySelector(".rider-notification");

  if (existing) {
    existing.remove();
  }

  const notification = document.createElement("div");

  notification.className = "rider-notification";

  notification.innerHTML = `

        <i class="fa-solid fa-circle-check"></i>

        <span>${message}</span>

    `;

  document.body.appendChild(notification);

  setTimeout(function () {
    notification.classList.add("show");
  }, 10);

  setTimeout(function () {
    notification.classList.remove("show");

    setTimeout(function () {
      notification.remove();
    }, 250);
  }, 2500);
}

const historyButton = document.getElementById("viewHistoryButton");

if (historyButton) {
  historyButton.addEventListener("click", function () {
    showNotification("Full delivery history will be available here.");
  });
}

/* BRICKSTARE RIDER LIVE LOCATION TRACKING */


// CONFIGURATION

// LOCAL DEVELOPMENT
const TRACKING_SERVER = "ws://localhost:8000";

// When deployed with HTTPS, change this to:
// const TRACKING_SERVER = "wss://your-backend-domain.com";


// VARIABLES

let map = null;
let riderMarker = null;
let accuracyCircle = null;
let watchId = null;
let socket = null;

let isTracking = false;


// INITIALIZE MAP

function initializeRiderMap() {
  const mapElement = document.getElementById("riderMap");

  if (!mapElement) {
    console.error("Rider map element was not found.");
    return;
  }

  // Default location: Nairobi
  // This is only the starting position before GPS is obtained.
  map = L.map("riderMap").setView([-1.286389, 36.817223], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 20,
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);
}


// CREATE RIDER ICON

function createRiderIcon() {
  return L.divIcon({
    className: "",
    html: `
            <div class="rider-marker">
                <i class="fas fa-motorcycle"></i>
            </div>
        `,
    iconSize: [42, 42],
    iconAnchor: [21, 21],
  });
}


// CONNECT TO WEBSOCKET SERVER

function connectToTrackingServer() {
  try {
    socket = new WebSocket(TRACKING_SERVER);

    socket.onopen = function () {
      console.log("Connected to tracking server.");

      updateTrackingStatus("Connected", true);
    };

    socket.onmessage = function (event) {
      console.log("Server message:", event.data);
    };

    socket.onerror = function (error) {
      console.error("Tracking WebSocket error:", error);

      updateTrackingStatus("Server unavailable", false);
    };

    socket.onclose = function () {
      console.log("Tracking server disconnected.");

      updateTrackingStatus("Disconnected", false);
    };
  } catch (error) {
    console.error("Could not connect to tracking server:", error);
  }
}


// START GPS TRACKING

function startLiveTracking() {
  if (!navigator.geolocation) {
    alert("Your device/browser does not support GPS location.");

    return;
  }

  if (isTracking) {
    return;
  }

  // Connect to backend if necessary
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    connectToTrackingServer();

    // Give WebSocket a moment to connect
    setTimeout(() => {
      beginGPSWatch();
    }, 500);
  } else {
    beginGPSWatch();
  }
}


// START GPS WATCH

function beginGPSWatch() {
  if (watchId !== null) {
    return;
  }

  updateGPSStatus("Requesting GPS permission...");

  watchId = navigator.geolocation.watchPosition(
    function (position) {
      const latitude = position.coords.latitude;

      const longitude = position.coords.longitude;

      const accuracy = position.coords.accuracy;

      console.log("GPS:", latitude, longitude, "Accuracy:", accuracy);

      isTracking = true;

      updateGPSStatus("GPS Active");

      updateCoordinates(latitude, longitude);

      updateLastUpdated();

      updateRiderMarker(latitude, longitude, accuracy);

      sendLocationToServer(latitude, longitude, accuracy);

      updateButtons();
    },

    function (error) {
      console.error("GPS error:", error);

      let message = "Unable to get your location.";

      if (error.code === 1) {
        message = "Location permission was denied.";
      } else if (error.code === 2) {
        message = "Your location is currently unavailable.";
      } else if (error.code === 3) {
        message = "GPS request timed out.";
      }

      updateGPSStatus(message);

      alert(message);
    },

    {
      enableHighAccuracy: true,
      maximumAge: 5000,
      timeout: 15000,
    },
  );
}


// UPDATE RIDER MARKER

function updateRiderMarker(latitude, longitude, accuracy) {
  if (!map) {
    return;
  }

  const newLocation = [latitude, longitude];

  // First GPS position
  if (!riderMarker) {
    riderMarker = L.marker(newLocation, {
      icon: createRiderIcon(),
    }).addTo(map);

    riderMarker.bindPopup("<strong>Rider</strong><br>Live location");
  } else {
    // Move existing marker
    riderMarker.setLatLng(newLocation);
  }

  // Accuracy circle
  if (!accuracyCircle) {
    accuracyCircle = L.circle(newLocation, {
      radius: accuracy,
      weight: 1,
      fillOpacity: 0.08,
    }).addTo(map);
  } else {
    accuracyCircle.setLatLng(newLocation);

    accuracyCircle.setRadius(accuracy);
  }

  // Center map on rider
  map.setView(newLocation, Math.max(map.getZoom(), 15), {
    animate: true,
  });
}

// SEND LOCATION TO BACKEND

function sendLocationToServer(latitude, longitude, accuracy) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    const locationData = {
      type: "rider_location",

      rider_id: getRiderId(),

      latitude: latitude,

      longitude: longitude,

      accuracy: accuracy,

      timestamp: new Date().toISOString(),
    };

    socket.send(JSON.stringify(locationData));

    console.log("Location sent:", locationData);
  } else {
    console.warn("WebSocket is not connected.");
  }
}

// STOP TRACKING

function stopLiveTracking() {
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);

    watchId = null;
  }

  isTracking = false;

  updateGPSStatus("Tracking stopped");

  updateTrackingStatus("Offline", false);

  updateButtons();

  console.log("Live tracking stopped.");
}

// GET RIDER ID

function getRiderId() {
  // For now this is an MVP rider ID.
  // Later this should come from your login system.

  let riderId = localStorage.getItem("brickstare_rider_id");

  if (!riderId) {
    riderId = "RIDER-" + Math.floor(Math.random() * 100000);

    localStorage.setItem("brickstare_rider_id", riderId);
  }

  return riderId;
}

// UI HELPERS

function updateCoordinates(latitude, longitude) {
  const latitudeElement = document.getElementById("latitude");

  const longitudeElement = document.getElementById("longitude");

  if (latitudeElement) {
    latitudeElement.textContent = latitude.toFixed(6);
  }

  if (longitudeElement) {
    longitudeElement.textContent = longitude.toFixed(6);
  }
}

function updateLastUpdated() {
  const element = document.getElementById("lastUpdated");

  if (element) {
    element.textContent = new Date().toLocaleTimeString();
  }
}

function updateGPSStatus(message) {
  const element = document.getElementById("gpsStatus");

  if (element) {
    element.textContent = message;
  }
}

function updateTrackingStatus(message, active) {
  const element = document.getElementById("trackingStatus");

  const container = document.querySelector(".tracking-status");

  if (element) {
    element.textContent = message;
  }

  if (container) {
    container.classList.toggle("active", active);
  }
}

function updateButtons() {
  const startButton = document.getElementById("startTrackingBtn");

  const stopButton = document.getElementById("stopTrackingBtn");

  if (startButton) {
    startButton.disabled = isTracking;
  }

  if (stopButton) {
    stopButton.disabled = !isTracking;
  }
}


// BUTTON EVENTS

document.addEventListener("DOMContentLoaded", function () {
  initializeRiderMap();

  const startButton = document.getElementById("startTrackingBtn");

  const stopButton = document.getElementById("stopTrackingBtn");

  if (startButton) {
    startButton.addEventListener("click", startLiveTracking);
  }

  if (stopButton) {
    stopButton.addEventListener("click", stopLiveTracking);
  }

  updateButtons();
});

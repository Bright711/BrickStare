alert("app.js is connected and running!");
console.log("✅ app.js loaded successfully");

// --- MOCK DATA ---
let deliveries = [
    { id: 'ORD-1001', customer: 'John Doe', address: '123 Main St, City', items: 3 },
    { id: 'ORD-1002', customer: 'Jane Smith', address: '456 Oak Ave, Town', items: 1 },
    { id: 'ORD-1003', customer: 'Bob Johnson', address: '789 Pine Rd, Village', items: 5 }
];

let riders = [
    { id: 'R-01', name: 'Alice Rider', status: 'available', location: 'Downtown' },
    { id: 'R-02', name: 'Charlie Driver', status: 'available', location: 'Uptown' },
    { id: 'R-03', name: 'David Speed', status: 'available', location: 'Midtown' }
];

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM is ready. Rendering dashboard...");
    renderDashboard();
});

function renderDashboard() {
    updateStats();
    renderDeliveries();
    renderRiders();
}

function updateStats() {
    const pendingEl = document.getElementById('stat-pending');
    const ridersEl = document.getElementById('stat-riders');
    
    if (pendingEl) pendingEl.textContent = deliveries.length;
    if (ridersEl) ridersEl.textContent = riders.length;
}

function renderDeliveries() {
    const container = document.getElementById('deliveries-list');
    if (!container) return;
    container.innerHTML = '';

    deliveries.forEach(delivery => {
        let riderOptions = '<option value="">Select Rider...</option>';
        riders.forEach(rider => {
            riderOptions += `<option value="${rider.id}">${rider.name}</option>`;
        });

        const div = document.createElement('div');
        div.className = 'list-item';
        div.innerHTML = `
            <div class="item-info">
                <h4>${delivery.id} - ${delivery.customer}</h4>
                <p><i class="fa-solid fa-location-dot"></i> ${delivery.address} (${delivery.items} items)</p>
            </div>
            <div class="action-group">
                <select id="select-${delivery.id}">${riderOptions}</select>
                <button class="btn btn-primary" onclick="assignRider('${delivery.id}')">
                    <i class="fa-solid fa-check"></i> Assign
                </button>
            </div>
        `;
        container.appendChild(div);
    });
}

function renderRiders() {
    const container = document.getElementById('riders-list');
    if (!container) return;
    container.innerHTML = '';

    riders.forEach(rider => {
        const div = document.createElement('div');
        div.className = 'list-item';
        div.innerHTML = `
            <div class="item-info">
                <h4>${rider.name}</h4>
                <p><i class="fa-solid fa-map-pin"></i> ${rider.location}</p>
            </div>
            <span class="status-badge status-available">${rider.status.toUpperCase()}</span>
        `;
        container.appendChild(div);
    });
}

// --- ACTIONS ---
window.assignRider = function(deliveryId) {
    const selectBox = document.getElementById(`select-${deliveryId}`);
    const riderId = selectBox.value;

    if (!riderId) {
        alert('Please select a rider first!');
        return;
    }

    const rider = riders.find(r => r.id === riderId);
    alert(`Success! Delivery ${deliveryId} assigned to ${rider.name}.`);

    // Remove from pending list
    deliveries = deliveries.filter(d => d.id !== deliveryId);
    renderDashboard();
}
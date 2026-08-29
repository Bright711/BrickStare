// 🔒 1. AUTHENTICATION CHECK
if (!localStorage.getItem('dispatcherToken')) {
    window.location.href = 'login.html';
}

// --- 2. MOCK DATA ---
let deliveries = [
    { id: 'ORD-1001', customer: 'Fahima Janice', address: '123 Main St, City', items: 3 },
    { id: 'ORD-1002', customer: 'Viggey Egeiza', address: '456 Oak Ave, Town', items: 1 },
    { id: 'ORD-1003', customer: 'Mariam Magero', address: '789 Pine Rd, Village', items: 5 }
];

let riders = [
    { id: 'R-01', name: 'Alice Rider', status: 'available', location: 'Downtown' },
    { id: 'R-02', name: 'Charlie Driver', status: 'available', location: 'Uptown' },
    { id: 'R-03', name: 'David Speed', status: 'available', location: 'Midtown' }
];

// --- 3. INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    renderDashboard();
    addLogoutButton();
});

// --- 4. LOGOUT FUNCTION ---
function logout() {
    localStorage.removeItem('dispatcherToken');
    localStorage.removeItem('dispatcherUser');
    window.location.href = 'login.html';
}

// --- 5. ADD LOGOUT BUTTON ---
function addLogoutButton() {
    const header = document.querySelector('header');
    const userProfile = header.querySelector('.user-profile');
    
    if (userProfile && !document.getElementById('logout-btn')) {
        const logoutBtn = document.createElement('button');
        logoutBtn.id = 'logout-btn';
        logoutBtn.className = 'btn btn-primary';
        logoutBtn.innerHTML = '<i class="fa-solid fa-right-from-bracket"></i> Logout';
        logoutBtn.onclick = logout;
        logoutBtn.style.marginLeft = '15px';
        userProfile.appendChild(logoutBtn);
    }
}

// --- 6. RENDER FUNCTIONS ---
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
            <span class="status-badge">${rider.status.toUpperCase()}</span>
        `;
        container.appendChild(div);
    });
}

// --- 7. ACTIONS ---
window.assignRider = function(deliveryId) {
    const selectBox = document.getElementById(`select-${deliveryId}`);
    const riderId = selectBox.value;

    if (!riderId) {
        alert('Please select a rider first!');
        return;
    }

    const rider = riders.find(r => r.id === riderId);
    alert(`Success! Delivery ${deliveryId} assigned to ${rider.name}.`);

    deliveries = deliveries.filter(d => d.id !== deliveryId);
    renderDashboard();
}

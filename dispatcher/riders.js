let riders = [
    { id: 'R-01', name: 'Alice Rider', phone: '+1234567890', vehicle: 'Motorcycle', location: 'Downtown', status: 'available', deliveries: 0 },
    { id: 'R-02', name: 'Charlie Driver', phone: '+1234567891', vehicle: 'Motorcycle', location: 'Uptown', status: 'busy', deliveries: 1 },
    { id: 'R-03', name: 'David Speed', phone: '+1234567892', vehicle: 'Van', location: 'Midtown', status: 'available', deliveries: 0 },
    { id: 'R-04', name: 'Emma Swift', phone: '+1234567893', vehicle: 'Bicycle', location: 'Eastside', status: 'available', deliveries: 0 },
    { id: 'R-05', name: 'Frank Rush', phone: '+1234567894', vehicle: 'Motorcycle', location: 'Westside', status: 'busy', deliveries: 2 }
];

document.addEventListener('DOMContentLoaded', () => {
    updateRiderStats();
    renderRiders();
});

function updateRiderStats() {
    document.getElementById('stat-total').textContent = riders.length;
    document.getElementById('stat-available').textContent = riders.filter(r => r.status === 'available').length;
    document.getElementById('stat-busy').textContent = riders.filter(r => r.status === 'busy').length;
}

function renderRiders() {
    const container = document.getElementById('riders-list');
    container.innerHTML = '';

    riders.forEach(rider => {
        const div = document.createElement('div');
        div.className = 'list-item';
        div.innerHTML = `
            <div class="item-info">
                <h4>${rider.name}</h4>
                <p><i class="fa-solid fa-phone"></i> ${rider.phone}</p>
                <p><i class="fa-solid fa-motorcycle"></i> ${rider.vehicle} | <i class="fa-solid fa-map-pin"></i> ${rider.location}</p>
                <p>Active Deliveries: ${rider.deliveries}</p>
            </div>
            <span class="status-badge ${rider.status === 'available' ? 'status-available' : 'status-busy'}">
                ${rider.status.toUpperCase()}
            </span>
        `;
        container.appendChild(div);
    });
}
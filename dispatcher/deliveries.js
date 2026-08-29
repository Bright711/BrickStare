// Mock data with different statuses
let allDeliveries = [
    { id: 'ORD-1001', customer: 'Fahima Janice', address: '123 Main St, City', items: 3, status: 'pending', rider: null },
    { id: 'ORD-1002', customer: 'Viggey Egeiza', address: '456 Oak Ave, Town', items: 1, status: 'assigned', rider: 'Alice Rider' },
    { id: 'ORD-1003', customer: 'Mariam Magero', address: '789 Pine Rd, Village', items: 5, status: 'in_transit', rider: 'Charlie Driver' },
    { id: 'ORD-1004', customer: 'John Smith', address: '555 River Rd, City', items: 2, status: 'delivered', rider: 'David Speed' },
    { id: 'ORD-1005', customer: 'Sarah Lee', address: '222 Mountain Ave, Town', items: 4, status: 'pending', rider: null }
];

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    console.log('Deliveries page loaded');
    renderAllDeliveries(allDeliveries);
});

// Render deliveries function
function renderAllDeliveries(deliveries) {
    const container = document.getElementById('all-deliveries-list');
    if (!container) {
        console.error('Container not found!');
        return;
    }
    
    container.innerHTML = '';

    if (deliveries.length === 0) {
        container.innerHTML = '<p class="loading">No deliveries found.</p>';
        return;
    }

    deliveries.forEach(d => {
        const div = document.createElement('div');
        div.className = 'list-item';
        div.innerHTML = `
            <div class="item-info">
                <h4>${d.id} - ${d.customer}</h4>
                <p><i class="fa-solid fa-location-dot"></i> ${d.address} (${d.items} items)</p>
                ${d.rider ? `<p><i class="fa-solid fa-motorcycle"></i> Rider: ${d.rider}</p>` : ''}
            </div>
            <span class="status-badge status-${d.status}">${d.status.replace('_', ' ').toUpperCase()}</span>
        `;
        container.appendChild(div);
    });
    
    console.log(`Rendered ${deliveries.length} deliveries`);
}

// Filter function - MAKE THIS GLOBAL
window.filterDeliveries = function(status) {
    console.log('Filtering by:', status);
    
    // Update active button
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase().replace(' ', '_') === status || 
            (status === 'all' && btn.textContent === 'All')) {
            btn.classList.add('active');
        }
    });

    // Filter data
    if (status === 'all') {
        renderAllDeliveries(allDeliveries);
    } else {
        const filtered = allDeliveries.filter(d => d.status === status);
        console.log(`Filtered to ${filtered.length} deliveries`);
        renderAllDeliveries(filtered);
    }
}
const reportData = {
    total: 45,
    pending: 3,
    assigned: 5,
    in_transit: 7,
    delivered: 30,
    failed: 0
};

const topRiders = [
    { name: 'David Speed', deliveries: 12, rating: 4.9 },
    { name: 'Alice Rider', deliveries: 10, rating: 4.8 },
    { name: 'Charlie Driver', deliveries: 8, rating: 4.7 },
    { name: 'Emma Swift', deliveries: 6, rating: 4.6 },
    { name: 'Frank Rush', deliveries: 5, rating: 4.5 }
];

document.addEventListener('DOMContentLoaded', () => {
    loadReports();
});

function loadReports() {
    // Update stats
    document.getElementById('report-total').textContent = reportData.total;
    const successRate = Math.round((reportData.delivered / reportData.total) * 100);
    document.getElementById('report-rate').textContent = successRate + '%';

    // Render status breakdown
    renderStatusBreakdown();
    renderTopRiders();
}

function renderStatusBreakdown() {
    const container = document.getElementById('status-breakdown');
    container.innerHTML = '';

    const statuses = [
        { label: 'Pending', count: reportData.pending, color: '#f59e0b' },
        { label: 'Assigned', count: reportData.assigned, color: '#3b82f6' },
        { label: 'In Transit', count: reportData.in_transit, color: '#8b5cf6' },
        { label: 'Delivered', count: reportData.delivered, color: '#10b981' },
        { label: 'Failed', count: reportData.failed, color: '#ef4444' }
    ];

    statuses.forEach(s => {
        const percentage = Math.round((s.count / reportData.total) * 100);
        const div = document.createElement('div');
        div.className = 'list-item';
        div.innerHTML = `
            <div class="item-info">
                <h4>${s.label}</h4>
                <div class="progress-bar" style="width: 100%; height: 8px; background: #e2e8f0; border-radius: 4px; margin-top: 8px;">
                    <div style="width: ${percentage}%; height: 100%; background: ${s.color}; border-radius: 4px;"></div>
                </div>
            </div>
            <div style="text-align: right;">
                <strong>${s.count}</strong>
                <p style="font-size: 0.8rem; color: #64748b;">${percentage}%</p>
            </div>
        `;
        container.appendChild(div);
    });
}

function renderTopRiders() {
    const container = document.getElementById('top-riders');
    container.innerHTML = '';

    topRiders.forEach((rider, index) => {
        const div = document.createElement('div');
        div.className = 'list-item';
        div.innerHTML = `
            <div class="item-info">
                <h4>#${index + 1} ${rider.name}</h4>
                <p><i class="fa-solid fa-star" style="color: #f59e0b;"></i> ${rider.rating} rating</p>
            </div>
            <div style="text-align: right;">
                <strong>${rider.deliveries}</strong>
                <p style="font-size: 0.8rem; color: #64748b;">deliveries</p>
            </div>
        `;
        container.appendChild(div);
    });
}
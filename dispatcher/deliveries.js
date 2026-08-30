const API = "http://localhost:5000/api";
if (!localStorage.getItem("dispatcherToken")) window.location.href = "/login";
let allDeliveries = [];
function render(list) {
  const container = document.getElementById("all-deliveries-list"); if (!container) return;
  container.innerHTML = list.length ? list.map(d => `<div class="list-item"><div class="item-info"><h4>${d.id} · ${d.customerName}</h4><p><i class="fa-solid fa-location-dot"></i> ${d.destination}</p><p><i class="fa-solid fa-box"></i> ${d.itemDescription}</p>${d.riderName ? `<p><i class="fa-solid fa-motorcycle"></i> Rider: ${d.riderName}</p>` : ""}</div><span class="status-badge">${d.status}</span></div>`).join("") : '<p class="loading">No deliveries found.</p>';
}
window.filterDeliveries = (status) => render(status === "all" ? allDeliveries : allDeliveries.filter(d => d.status.toLowerCase().replace(" ", "_") === status));
document.addEventListener("DOMContentLoaded", async () => { try { const r = await fetch(`${API}/deliveries`); const d = await r.json(); allDeliveries = d.deliveries || []; render(allDeliveries); } catch { render([]); } });

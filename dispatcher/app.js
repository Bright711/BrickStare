const API = "http://localhost:5000/api";

if (!localStorage.getItem("dispatcherToken")) window.location.href = "/login";

let deliveries = [];
let riders = [];

const esc = (value) => String(value ?? "").replace(/[&<>'"]/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));

async function loadData() {
  const [dRes, rRes] = await Promise.all([fetch(`${API}/deliveries`), fetch(`${API}/users/riders`)]);
  const d = await dRes.json(); const r = await rRes.json();
  deliveries = d.deliveries || []; riders = r.riders || [];
  renderDashboard();
}

function renderDashboard() {
  const currentUser = JSON.parse(localStorage.getItem("dispatcherUser") || "null");
  const nameEl = document.getElementById("dispatcherName");
  if (nameEl && currentUser?.name) nameEl.textContent = currentUser.name;
  const pending = deliveries.filter(d => d.status === "Pending");
  const active = deliveries.filter(d => d.status !== "Delivered");
  document.getElementById("stat-pending")?.replaceChildren(document.createTextNode(pending.length));
  document.getElementById("stat-riders")?.replaceChildren(document.createTextNode(riders.length));
  const completed = deliveries.filter(d => d.status === "Delivered").length;
  document.querySelector(".stat-card:nth-child(3) p")?.replaceChildren(document.createTextNode(completed));
  const list = document.getElementById("deliveries-list");
  if (list) list.innerHTML = active.length ? active.map(d => `
    <div class="list-item"><div class="item-info"><h4>${esc(d.id)} · ${esc(d.customerName)}</h4><p><i class="fa-solid fa-location-dot"></i> ${esc(d.destination)}</p><p><i class="fa-solid fa-box"></i> ${esc(d.itemDescription)}</p>${d.riderName ? `<p><i class="fa-solid fa-motorcycle"></i> ${esc(d.riderName)}</p>` : ""}</div>
    ${d.status === "Pending" ? `<div class="action-group"><select id="rider-${esc(d.id)}"><option value="">Select rider</option>${riders.filter(r => r.status === "Available").map(r => `<option value="${r.id}">${esc(r.name)}</option>`).join("")}</select><button class="btn btn-primary" onclick="assignRider('${d.id}')">Assign</button></div>` : `<span class="status-badge">${esc(d.status)}</span>`}</div>`).join("") : `<p class="loading">No open deliveries.</p>`;
  const riderList = document.getElementById("riders-list");
  if (riderList) riderList.innerHTML = riders.map(r => `<div class="list-item"><div class="item-info"><h4>${esc(r.name)}</h4><p>${esc(r.email)}</p></div><span class="status-badge">${esc(r.status)}</span></div>`).join("");
}

window.assignRider = async (deliveryId) => {
  const riderId = document.getElementById(`rider-${deliveryId}`)?.value;
  if (!riderId) return alert("Please select a rider first.");
  const response = await fetch(`${API}/deliveries/${deliveryId}/assign`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ riderId }) });
  const data = await response.json();
  if (!response.ok) return alert(data.message || "Assignment failed.");
  await loadData();
};

function logout() { localStorage.removeItem("dispatcherToken"); localStorage.removeItem("dispatcherUser"); window.location.href = "/login"; }

document.addEventListener("DOMContentLoaded", () => { document.getElementById("logout-btn")?.addEventListener("click", logout); loadData().catch(() => alert("Start the Reflex backend on port 5000.")); setInterval(() => loadData().catch(() => {}), 5000); });

(function () {
  'use strict';

  const USERS = Array.from({ length: 5 }, (_, i) => ({
    email: `retailer00${i + 1}@gmail.com`,
    password: '1234',
    role: 'retailer'
  }));

  const KEYS = {
    user: 'brickstareRetailerUser',
    deliveries: 'brickstareDeliveries',
    inventory: 'brickstareInventory',
    orders: 'brickstareOrders',
    settings: 'brickstareRetailerSettings',
    notices: 'brickstareRetailerNotices'
  };

  const seedOrders = [
    {
      id: 'ORD-1001', customerName: 'Brian Mwangi', phone: '0712345678', address: 'Westlands, Nairobi',
      items: [{ productName: 'LED Smart TV 43-inch', quantity: 1 }], status: 'New'
    },
    {
      id: 'ORD-1002', customerName: 'Mercy Wanjiku', phone: '0723456789', address: 'Kilimani, Nairobi',
      items: [{ productName: 'First Aid Kit', quantity: 2 }], status: 'New'
    },
    {
      id: 'ORD-1003', customerName: 'David Otieno', phone: '0734567890', address: 'South B, Nairobi',
      items: [{ productName: 'Cordless Drill', quantity: 1 }, { productName: 'Tape Measure', quantity: 1 }], status: 'New'
    }
  ];

  const seedInventory = [
    { id: 'PRD-001', name: 'LED Smart TV 43-inch', category: 'Electronics', price: 32999, stock: 8, image: '' },
    { id: 'PRD-002', name: 'First Aid Kit', category: 'Pharmacy', price: 1850, stock: 16, image: '' },
    { id: 'PRD-003', name: 'Cordless Drill', category: 'Hardware', price: 6400, stock: 6, image: '' }
  ];

  function read(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch (_) { return fallback; }
  }

  function write(key, value) { localStorage.setItem(key, JSON.stringify(value)); }

  function currentUser() { return read(KEYS.user, null); }

  function isLoggedIn() { return !!currentUser(); }

  function requireLogin() {
    if (!isLoggedIn()) {
      window.location.href = 'retailer.html';
      return false;
    }
    return true;
  }

  function seedData() {
    if (!localStorage.getItem(KEYS.orders)) write(KEYS.orders, seedOrders);
    if (!localStorage.getItem(KEYS.inventory)) write(KEYS.inventory, seedInventory);
    if (!localStorage.getItem(KEYS.deliveries)) write(KEYS.deliveries, []);
    if (!localStorage.getItem(KEYS.notices)) write(KEYS.notices, [
      { title: 'Welcome to BrickStare', message: 'Your retailer delivery workspace is ready.', time: new Date().toISOString() }
    ]);
    if (!localStorage.getItem(KEYS.settings)) write(KEYS.settings, { storeName: 'BrickStare Store', phone: '', email: currentUser()?.email || '', notifications: true });
  }

  function esc(value) {
    return String(value ?? '').replace(/[&<>'"]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[c]));
  }

  function money(value) { return `KSh ${Number(value || 0).toLocaleString()}`; }

  function formatDate(value) {
    if (!value) return '—';
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? esc(value) : d.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
  }

  function statusClass(status) { return String(status || '').toLowerCase().replace(/\s+/g, '-'); }

  function shell(page, content) {
    const user = currentUser();
    const name = user?.email?.split('@')[0] || 'Retailer';
    const nav = [
      ['dashboard.html', 'Dashboard', 'dashboard'],
      ['new-delivery.html', 'New Delivery', 'new-delivery'],
      ['my-deliveries.html', 'My Deliveries', 'my-deliveries'],
      ['inventory.html', 'Inventory', 'inventory'],
      ['notifications.html', 'Notifications', 'notifications']
    ];

    document.getElementById('app').innerHTML = `
      <div class="app">
        <aside class="sidebar">
          <div class="logo"><div class="logo-mark">B</div><div><h2>BrickStare</h2><span>Retailer Portal</span></div></div>
          <nav class="navigation">
            ${nav.map(([href,label,key]) => `<a class="nav-item ${page === key ? 'active' : ''}" href="${href}"><span aria-hidden="true">${icon(key)}</span><span>${label}</span></a>`).join('')}
          </nav>
          <div class="sidebar-bottom">
            <a class="nav-item ${page === 'settings' ? 'active' : ''}" href="settings.html"><span aria-hidden="true">⚙</span><span>Settings</span></a>
            <button class="nav-item logout-button" id="logoutBtn" type="button"><span aria-hidden="true">↪</span><span>Log Out</span></button>
          </div>
        </aside>
        <main class="main-content">
          <header class="top-header">
            <div><h1>${pageTitle(page)}</h1><p>${pageSubtitle(page)}</p></div>
            <div class="header-actions">
              <a class="notification-button" href="notifications.html" title="Notifications" aria-label="Notifications">${icon('bell')}</a>
              <div class="profile"><div class="avatar">R</div><div><strong>${esc(name)}</strong><span>Retailer</span></div></div>
            </div>
          </header>
          ${content}
        </main>
      </div>`;

    document.getElementById('logoutBtn').addEventListener('click', () => {
      if (confirm('Log out of BrickStare?')) {
        localStorage.removeItem(KEYS.user);
        localStorage.removeItem('reflexAuthenticated');
        localStorage.removeItem('reflexUserEmail');
        localStorage.removeItem('reflexUser');
        window.location.href = 'retailer.html';
      }
    });
  }

  function icon(name) {
    const icons = {
      dashboard: '▦', 'new-delivery': '+', 'my-deliveries': '▣', inventory: '□', notifications: '●', bell: '♢'
    };
    return `<span class="icon-text">${icons[name] || '•'}</span>`;
  }

  function pageTitle(page) {
    return ({ dashboard:'Dashboard', 'new-delivery':'New Delivery', 'my-deliveries':'My Deliveries', inventory:'Inventory', notifications:'Notifications', settings:'Settings', 'delivery-details':'Delivery Details' })[page] || 'BrickStare';
  }
  function pageSubtitle(page) {
    return ({ dashboard:'Orders and delivery requests', 'new-delivery':'Create a delivery request', 'my-deliveries':'Track your active and completed deliveries', inventory:'Manage products available for sale', notifications:'Updates about your deliveries', settings:'Manage your retailer preferences', 'delivery-details':'View delivery information and progress' })[page] || '';
  }

  function initLogin() {
    if (isLoggedIn()) window.location.href = 'dashboard.html';
    const form = document.getElementById('loginForm');
    form.addEventListener('submit', e => {
      e.preventDefault();
      const email = document.getElementById('email').value.trim().toLowerCase();
      const password = document.getElementById('password').value;
      const user = USERS.find(u => u.email === email && u.password === password);
      const error = document.getElementById('loginError');
      if (!user) { error.textContent = 'Invalid retailer email or password.'; error.classList.remove('hidden'); return; }
      write(KEYS.user, user);
      localStorage.setItem('reflexAuthenticated', 'true');
      localStorage.setItem('reflexUserEmail', user.email);
      localStorage.setItem('reflexUser', JSON.stringify(user));
      seedData();
      window.location.href = 'dashboard.html';
    });
  }

  function initDashboard() {
    if (!requireLogin()) return;
    seedData();
    const deliveries = read(KEYS.deliveries, []);
    const orders = read(KEYS.orders, []).filter(o => o.status === 'New');
    const pending = deliveries.filter(d => d.status === 'Pending').length;
    const progress = deliveries.filter(d => ['Assigned','Picked Up'].includes(d.status)).length;
    const done = deliveries.filter(d => d.status === 'Delivered').length;
    shell('dashboard', `
      <section class="welcome-section"><div><h2>Good morning</h2><p>Review customer orders and keep deliveries moving.</p></div><a class="button button-primary" href="new-delivery.html">+ New Delivery</a></section>
      <section class="stats-grid">
        ${stat('▣','Deliveries',deliveries.length)}${stat('◷','Pending',pending)}${stat('↗','In Progress',progress)}${stat('✓','Delivered',done)}
      </section>
      <section class="deliveries-section"><div class="section-header"><div><h2>Customer Orders</h2><p>Orders waiting to become delivery requests.</p></div></div>
        <div class="delivery-table">${orders.length ? orders.slice(0,6).map(orderRow).join('') : '<div class="empty">No new customer orders.</div>'}</div>
      </section>
      <section class="deliveries-section"><div class="section-header"><div><h2>Recent Deliveries</h2><p>Track requests after they are created.</p></div><a class="view-all-button" href="my-deliveries.html">View all</a></div>
        <div class="delivery-table">${deliveries.length ? deliveries.slice(0,5).map(deliveryRow).join('') : '<div class="empty">No delivery requests yet.</div>'}</div>
      </section>`);
  }

  function stat(symbol,label,value){ return `<div class="stat-card"><div class="stat-icon">${symbol}</div><div><span>${label}</span><h3>${value}</h3></div></div>`; }
  function orderRow(o){ return `<div class="delivery-row"><span>${esc(o.id)}</span><span>${esc(o.customerName)}</span><span>${esc(o.items.map(i=>`${i.productName} x${i.quantity}`).join(', '))}</span><span class="status pending">New</span><a class="details-button" href="new-delivery.html?order=${encodeURIComponent(o.id)}">Create Delivery</a></div>`; }
  function deliveryRow(d){ return `<div class="delivery-row"><span>${esc(d.id)}</span><span>${esc(d.customerName)}</span><span>${esc(d.destination)}</span><span class="status ${statusClass(d.status)}">${esc(d.status)}</span><a class="details-button" href="delivery-details.html?id=${encodeURIComponent(d.id)}">View</a></div>`; }

  function initNewDelivery() {
    if (!requireLogin()) return;
    seedData();
    const orders = read(KEYS.orders, []).filter(o => o.status === 'New');
    shell('new-delivery', `
      <section class="form-section">
        <form id="deliveryForm">
          <div class="delivery-form">
            <div class="form-group full"><label for="orderId">Customer order <span class="helper">optional</span></label><select id="orderId"><option value="">Enter delivery details below</option>${orders.map(o=>`<option value="${esc(o.id)}">${esc(o.id)} · ${esc(o.customerName)}</option>`).join('')}</select></div>
            <div class="form-group"><label for="customerName">Customer name</label><input id="customerName" required></div>
            <div class="form-group"><label for="customerPhone">Customer phone</label><input id="customerPhone" placeholder="07XX XXX XXX" required></div>
            <div class="form-group full"><label for="destination">Delivery address</label><input id="destination" placeholder="e.g. Westlands, Nairobi" required></div>
            <div class="form-group full"><label for="itemDescription">Item description</label><textarea id="itemDescription" rows="3" placeholder="e.g. LED TV x1" required></textarea></div>
            <div class="form-group"><label for="deliveryDate">Delivery date</label><input id="deliveryDate" type="date" required></div>
            <div class="form-group"><label for="deliveryTime">Delivery time</label><input id="deliveryTime" type="time" required></div>
            <div class="form-group full"><label for="notes">Notes <span class="helper">optional</span></label><textarea id="notes" rows="3" placeholder="Gate number, preferred contact time, or other useful detail"></textarea></div>
          </div>
          <div id="deliveryError" class="form-error hidden"></div>
          <div class="form-actions"><a class="button button-secondary" href="dashboard.html">Cancel</a><button class="button button-primary" type="submit">Create Delivery</button></div>
        </form>
      </section>`);

    const selected = new URLSearchParams(location.search).get('order');
    const orderSelect = document.getElementById('orderId');
    const fill = id => {
      const o = orders.find(x=>x.id===id); if(!o) return;
      document.getElementById('customerName').value=o.customerName;
      document.getElementById('customerPhone').value=o.phone;
      document.getElementById('destination').value=o.address;
      document.getElementById('itemDescription').value=o.items.map(i=>`${i.productName} x${i.quantity}`).join(', ');
    };
    orderSelect.addEventListener('change', e => fill(e.target.value));
    if(selected){ orderSelect.value=selected; fill(selected); }

    document.getElementById('deliveryForm').addEventListener('submit', e => {
      e.preventDefault();
      const delivery = {
        id: `DEL-${String(Date.now()).slice(-6)}`,
        orderId: orderSelect.value || null,
        retailerEmail: currentUser().email,
        customerName: document.getElementById('customerName').value.trim(),
        customerPhone: document.getElementById('customerPhone').value.trim(),
        destination: document.getElementById('destination').value.trim(),
        itemDescription: document.getElementById('itemDescription').value.trim(),
        deliveryDate: document.getElementById('deliveryDate').value,
        deliveryTime: document.getElementById('deliveryTime').value,
        notes: document.getElementById('notes').value.trim(),
        status: 'Pending',
        riderId: null,
        statusHistory: [{ status:'Pending', timestamp:new Date().toISOString() }],
        createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
      };
      const deliveries=read(KEYS.deliveries,[]); deliveries.unshift(delivery); write(KEYS.deliveries,deliveries);
      if(orderSelect.value){ const all=read(KEYS.orders,[]); const o=all.find(x=>x.id===orderSelect.value); if(o)o.status='Converted'; write(KEYS.orders,all); }
      const notices=read(KEYS.notices,[]); notices.unshift({title:'Delivery created',message:`${delivery.id} is waiting for dispatcher assignment.`,time:new Date().toISOString()}); write(KEYS.notices,notices);
      window.location.href=`delivery-details.html?id=${encodeURIComponent(delivery.id)}`;
    });
  }

  function initMyDeliveries(){
    if(!requireLogin())return; seedData(); const ds=read(KEYS.deliveries,[]);
    shell('my-deliveries', `<section class="deliveries-section"><div class="section-header"><div><h2>My Deliveries</h2><p>Updates are reflected here as the delivery moves through the process.</p></div><a class="button button-primary" href="new-delivery.html">+ New Delivery</a></div><div class="delivery-table">${ds.length?ds.map(deliveryRow).join(''):'<div class="empty">You have not created any deliveries yet.</div>'}</div></section>`);
  }

  function initDetails(){
    if(!requireLogin())return; seedData(); const id=new URLSearchParams(location.search).get('id'); const d=read(KEYS.deliveries,[]).find(x=>x.id===id);
    if(!d){ shell('delivery-details','<section class="welcome-section"><div><h2>Delivery not found</h2><p>The delivery could not be found in this browser.</p></div><a class="button button-primary" href="my-deliveries.html">Back to deliveries</a></section>'); return; }
    shell('delivery-details', `<section class="welcome-section"><div><h2>${esc(d.id)}</h2><p>${esc(d.itemDescription)}</p></div><span class="status ${statusClass(d.status)}">${esc(d.status)}</span></section>
      <section class="deliveries-section"><div class="section-header"><div><h2>Customer details</h2><p>Information attached to this delivery request.</p></div></div><div class="detail-grid">
        ${detail('Customer',d.customerName)}${detail('Phone',d.customerPhone)}${detail('Address',d.destination)}${detail('Delivery date',d.deliveryDate)}${detail('Delivery time',d.deliveryTime)}${detail('Assigned rider',d.riderId||'Waiting for dispatcher')}${detail('Notes',d.notes||'No notes')}
      </div></section>
      <section class="deliveries-section"><div class="section-header"><div><h2>Delivery progress</h2><p>Status changes made by the delivery team appear here.</p></div></div><div class="timeline">${(d.statusHistory||[]).map(x=>`<div class="timeline-item"><strong>${esc(x.status)}</strong><span>${formatDate(x.timestamp)}</span></div>`).join('')}</div></section>
      <a class="button button-secondary" href="my-deliveries.html">← Back to My Deliveries</a>`);
  }
  function detail(label,value){return `<div class="detail-item"><label>${esc(label)}</label><p>${esc(value)}</p></div>`}

  function initInventory(){
    if(!requireLogin())return; seedData(); renderInventory();
  }
  function renderInventory(){
    const products=read(KEYS.inventory,[]);
    shell('inventory', `<section class="deliveries-section"><div class="inventory-toolbar"><div><h2>Products</h2><p>Add new stock and keep the retailer catalogue up to date.</p></div><button class="button button-primary" id="addProductBtn">+ Add Product</button></div><div class="product-grid">${products.map(productCard).join('')||'<div class="empty">No products in inventory.</div>'}</div></section>`);
    document.getElementById('addProductBtn').addEventListener('click',openProductModal);
  }
  function productCard(p){return `<article class="product-card"><div class="product-image">${p.image?`<img src="${esc(p.image)}" alt="${esc(p.name)}">`:'No image'}</div><div class="product-body"><h3>${esc(p.name)}</h3><p>${esc(p.category)}</p><div class="product-meta"><span class="price">${money(p.price)}</span><span class="stock">${Number(p.stock)} in stock</span></div></div></article>`}
  function openProductModal(){
    const wrap=document.createElement('div'); wrap.className='modal-backdrop'; wrap.id='productModal'; wrap.innerHTML=`<div class="modal"><h2>Add product</h2><p>Enter the details for new stock and attach a product photo.</p><form id="productForm"><div class="form-group"><label>Product name<input id="pName" required placeholder="e.g. Power Drill"></label></div><div class="form-group" style="margin-top:15px"><label>Category<select id="pCategory"><option>Electronics</option><option>Pharmacy</option><option>Hardware</option></select></label></div><div class="form-group" style="margin-top:15px"><label>Price (KSh)<input id="pPrice" type="number" min="0" required></label></div><div class="form-group" style="margin-top:15px"><label>Stock quantity<input id="pStock" type="number" min="0" required></label></div><div class="form-group" style="margin-top:15px"><label>Product image<input id="pImage" type="file" accept="image/*"><span class="helper">Choose one photo of this product.</span></label><div class="image-preview" id="imagePreview">No image selected</div></div><div id="productError" class="form-error hidden" style="margin-top:15px"></div><div class="modal-actions"><button type="button" class="button button-secondary" id="cancelProduct">Cancel</button><button type="submit" class="button button-primary">Add Product</button></div></form></div>`;
    document.body.appendChild(wrap);
    const input=wrap.querySelector('#pImage'), preview=wrap.querySelector('#imagePreview');
    input.addEventListener('change',()=>{const f=input.files[0];if(!f){preview.textContent='No image selected';return;}const r=new FileReader();r.onload=()=>preview.innerHTML=`<img src="${r.result}" alt="Preview">`;r.readAsDataURL(f);});
    wrap.querySelector('#cancelProduct').onclick=()=>wrap.remove();
    wrap.addEventListener('click',e=>{if(e.target===wrap)wrap.remove();});
    wrap.querySelector('#productForm').addEventListener('submit',e=>{e.preventDefault();const f=input.files[0];const finish=image=>{const products=read(KEYS.inventory,[]);products.unshift({id:`PRD-${Date.now().toString().slice(-6)}`,name:wrap.querySelector('#pName').value.trim(),category:wrap.querySelector('#pCategory').value,price:Number(wrap.querySelector('#pPrice').value),stock:Number(wrap.querySelector('#pStock').value),image:image||''});write(KEYS.inventory,products);wrap.remove();renderInventory();};if(f){const r=new FileReader();r.onload=()=>finish(r.result);r.readAsDataURL(f);}else finish('');});
  }

  function initNotifications(){if(!requireLogin())return;seedData();const ns=read(KEYS.notices,[]);shell('notifications',`<section class="deliveries-section"><div class="section-header"><div><h2>Notifications</h2><p>Important updates for your delivery requests.</p></div></div><div class="notice-list">${ns.length?ns.map(n=>`<article class="notice"><strong>${esc(n.title)}</strong><p>${esc(n.message)}</p><small>${formatDate(n.time)}</small></article>`).join(''):'<div class="empty">No notifications.</div>'}</div></section>`)}

  function initSettings(){
    if(!requireLogin())return;seedData();const s=read(KEYS.settings,{storeName:'BrickStare Store',phone:'',email:currentUser().email,notifications:true});
    shell('settings',`<div class="settings-layout"><nav class="settings-nav"><button class="active" data-tab="store">Store details</button><button data-tab="notifications">Notifications</button><button data-tab="account">Account</button></nav><section class="settings-panel"><div id="settingsPanel"></div></section></div>`);
    const panel=document.getElementById('settingsPanel');
    function render(tab){
      if(tab==='store')panel.innerHTML=`<h2>Store details</h2><p>Keep the information used on your retailer profile up to date.</p><form class="settings-form" id="storeForm"><div class="form-group"><label>Store name<input id="storeName" value="${esc(s.storeName)}"></label></div><div class="form-group"><label>Phone number<input id="storePhone" value="${esc(s.phone)}" placeholder="07XX XXX XXX"></label></div><div class="form-group full"><label>Email address<input value="${esc(s.email)}" disabled></label></div><div class="save-row full"><button class="button button-primary" type="submit">Save changes</button></div></form>`;
      if(tab==='notifications')panel.innerHTML=`<h2>Notifications</h2><p>Choose which retailer updates you want to receive.</p><div class="settings-option"><div><strong>Delivery updates</strong><span>Show updates when a delivery is assigned, picked up or delivered.</span></div><label class="switch"><input id="notifySwitch" type="checkbox" ${s.notifications?'checked':''}><span class="slider"></span></label></div><div class="save-row"><button class="button button-primary" id="saveNotify">Save changes</button></div>`;
      if(tab==='account')panel.innerHTML=`<h2>Account</h2><p>Your retailer account is managed by BrickStare.</p><div class="settings-option"><div><strong>Signed in as</strong><span>${esc(s.email)}</span></div><span class="status assigned">Retailer</span></div><div class="save-row"><button class="button button-danger" id="settingsLogout">Log out</button></div>`;
      const sf=document.getElementById('storeForm');if(sf)sf.onsubmit=e=>{e.preventDefault();s.storeName=document.getElementById('storeName').value.trim()||'BrickStare Store';s.phone=document.getElementById('storePhone').value.trim();write(KEYS.settings,s);showSaved(panel)};
      const sn=document.getElementById('saveNotify');if(sn)sn.onclick=()=>{s.notifications=document.getElementById('notifySwitch').checked;write(KEYS.settings,s);showSaved(panel)};
      const lo=document.getElementById('settingsLogout');if(lo)lo.onclick=()=>{localStorage.removeItem(KEYS.user);window.location.href='retailer.html'};
    }
    function showSaved(p){const n=document.createElement('div');n.className='success-note';n.textContent='Changes saved.';p.prepend(n);setTimeout(()=>n.remove(),2500)}
    document.querySelectorAll('.settings-nav button').forEach(b=>b.onclick=()=>{document.querySelectorAll('.settings-nav button').forEach(x=>x.classList.remove('active'));b.classList.add('active');render(b.dataset.tab)});render('store');
  }

  function init(){
    const page=document.body.dataset.page;
    if(page==='login'){initLogin();return;}
    const f={dashboard:initDashboard,'new-delivery':initNewDelivery,'my-deliveries':initMyDeliveries,'delivery-details':initDetails,inventory:initInventory,notifications:initNotifications,settings:initSettings}[page];
    if(f)f();
  }
  document.addEventListener('DOMContentLoaded',init);
})();

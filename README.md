# Reflex

Reflex is a delivery coordination prototype for small Kenyan retailers.

## Core flow

Customer shops → Checkout → Retailer sees the order → Retailer creates delivery → Dispatcher assigns rider → Rider marks **Assigned → Picked Up → Scan QR / enter Package ID → Checking package → Package verified → Mark as Delivered** → Retailer sees the updated status.

## Demo accounts

All passwords are `1234`.

- Retailer: `retailer001@gmail.com`
- Dispatcher: `dispatcher001@gmail.com` 
- Rider: `rider001@gmail.com` through `rider005@gmail.com`
- Customer: `customer001@gmail.com`

## Run locally

Terminal 1:

```bash
npm install
npm run server
```

Terminal 2:

```bash
npm run dev
```

Open the Vite URL shown in Terminal 2. The dispatcher portal is `dispatcher/login.html` and the rider portal is `rider/login.html`.

The backend stores demo data in memory, so restarting the server resets the demo orders and deliveries.

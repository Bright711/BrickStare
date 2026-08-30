import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
User,
Bell,
Store,
Save,
ArrowLeft,
} from "lucide-react";

function Settings() {
const navigate = useNavigate();

const authenticatedEmail =
localStorage.getItem("reflexUserEmail") || "";

const [settings, setSettings] = useState({
storeName:
localStorage.getItem("reflexStoreName") ||
"Retailer Store",


managerName:
  localStorage.getItem("reflexManagerName") ||
  "Store Manager",

email:
  localStorage.getItem("reflexEmail") ||
  authenticatedEmail,

notifications:
  localStorage.getItem("reflexNotifications") !==
  "false",


});

const [saved, setSaved] = useState(false);

const handleChange = (event) => {
const {
name,
value,
type,
checked,
} = event.target;


setSettings((previousSettings) => ({
  ...previousSettings,
  [name]:
    type === "checkbox"
      ? checked
      : value,
}));

setSaved(false);


};

const handleSave = (event) => {
event.preventDefault();


localStorage.setItem(
  "reflexStoreName",
  settings.storeName
);

localStorage.setItem(
  "reflexManagerName",
  settings.managerName
);

localStorage.setItem(
  "reflexEmail",
  settings.email
);

localStorage.setItem(
  "reflexNotifications",
  String(settings.notifications)
);

setSaved(true);

setTimeout(() => {
  setSaved(false);
}, 3000);


};

return ( <main className="main-content"> <header className="top-header"> <div> <h1>Settings</h1> <p>
Manage your retailer portal settings </p> </div> </header>


  <section className="welcome-section">
    <div>
      <h2>Account Settings</h2>
      <p>
        Update your store information and
        notification preferences.
      </p>
    </div>
  </section>

  {saved && (
    <div className="success-message">
      Settings saved successfully.
    </div>
  )}

  <section className="deliveries-section">
    <div className="section-header">
      <div>
        <h2>
          <Store size={20} />
          Store Information
        </h2>

        <p>
          Information about your retail store.
        </p>
      </div>
    </div>

    <form
      className="delivery-form"
      onSubmit={handleSave}
    >
      <div className="form-group">
        <label htmlFor="storeName">
          Store Name
        </label>

        <input
          id="storeName"
          name="storeName"
          type="text"
          value={settings.storeName}
          onChange={handleChange}
          placeholder="Enter store name"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="managerName">
          Manager Name
        </label>

        <input
          id="managerName"
          name="managerName"
          type="text"
          value={settings.managerName}
          onChange={handleChange}
          placeholder="Enter manager name"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">
          Email Address
        </label>

        <input
          id="email"
          name="email"
          type="email"
          value={settings.email}
          onChange={handleChange}
          placeholder="Enter email address"
          required
        />
      </div>

      <div className="form-group">
        <label
          htmlFor="notifications"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            cursor: "pointer",
          }}
        >
          <input
            id="notifications"
            name="notifications"
            type="checkbox"
            checked={settings.notifications}
            onChange={handleChange}
          />

          <span>
            Receive delivery notifications
          </span>
        </label>
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="cancel-button"
          onClick={() => navigate("/")}
        >
          <ArrowLeft size={18} />
          Cancel
        </button>

        <button
          type="submit"
          className="submit-button"
        >
          <Save size={18} />
          Save Settings
        </button>
      </div>
    </form>
  </section>

  <section className="deliveries-section">
    <div className="section-header">
      <div>
        <h2>
          <Bell size={20} />
          Notification Preferences
        </h2>

        <p>
          Control your delivery notification
          preferences.
        </p>
      </div>
    </div>

    <div className="delivery-form">
      <div>
        <Bell size={20} />

        <label>
          Delivery Notifications
        </label>

        <p>
          {settings.notifications
            ? "Notifications are enabled."
            : "Notifications are disabled."}
        </p>
      </div>

      <div>
        <User size={20} />

        <label>
          Account Type
        </label>

        <p>
          Retailer / Store Manager
        </p>
      </div>
    </div>
  </section>

  <section className="deliveries-section">
    <div className="section-header">
      <div>
        <h2>
          <User size={20} />
          Account Information
        </h2>

        <p>
          Your current retailer account.
        </p>
      </div>
    </div>

    <div className="delivery-form">
      <div>
        <label>
          Authentication Email
        </label>

        <p>
          {authenticatedEmail ||
            "No authentication email available"}
        </p>
      </div>

      <div>
        <label>
          Role
        </label>

        <p>
          Retailer
        </p>
      </div>

      <div>
        <label>
          Account Status
        </label>

        <p>
          Active
        </p>
      </div>
    </div>
  </section>
</main>


);
}

export default Settings;

import { useEffect, useState } from "react";
import { Bell, CheckCircle } from "lucide-react";

function Notifications() {
const [notifications, setNotifications] = useState([]);
const [error, setError] = useState("");
const [loading, setLoading] = useState(true);

useEffect(() => {
const fetchNotifications = async () => {
try {
setLoading(true);
setError("");


    const response = await fetch(
      "http://localhost:5000/api/notifications/retailer"
    );

    if (!response.ok) {
      throw new Error("Failed to fetch notifications");
    }

    const data = await response.json();

    if (data.success) {
      setNotifications(data.notifications || []);
    } else {
      setError("Unable to load notifications.");
    }
  } catch (err) {
    console.error("Failed to fetch notifications:", err);
    setError(
      "Unable to connect to the notification server."
    );
  } finally {
    setLoading(false);
  }
};

fetchNotifications();


}, []);

const getNotificationIcon = (notification) => {
if (notification.type === "DELIVERY_COMPLETED") {
return ( <CheckCircle
       size={22}
       strokeWidth={2}
     />
);
}


return (
  <Bell
    size={22}
    strokeWidth={2}
  />
);


};

return ( <main className="main-content"> <header className="top-header"> <div> <h1>Notifications</h1> <p>
Stay updated on your delivery activities </p> </div> </header>


  <section className="welcome-section">
    <div>
      <h2>Recent Notifications</h2>
      <p>
        Here are your latest delivery updates.
      </p>
    </div>
  </section>

  {error && (
    <section className="deliveries-section">
      <div className="form-error">
        {error}
      </div>
    </section>
  )}

  <section className="deliveries-section">
    <div className="delivery-table">

      {loading ? (
        <div className="delivery-row">
          <span>
            <Bell
              size={22}
              strokeWidth={2}
            />
          </span>

          <div>
            <strong>
              Loading notifications...
            </strong>

            <p>
              Please wait while we retrieve your
              latest delivery updates.
            </p>
          </div>
        </div>
      ) : notifications.length === 0 ? (
        <div className="delivery-row">
          <span>
            <Bell
              size={22}
              strokeWidth={2}
            />
          </span>

          <div>
            <strong>
              No notifications yet
            </strong>

            <p>
              Notifications will appear when
              your delivery status is updated.
            </p>
          </div>
        </div>
      ) : (
        notifications
          .slice()
          .reverse()
          .map((notification) => (
            <div
              className="delivery-row"
              key={notification.id}
            >
              <span>
                {getNotificationIcon(
                  notification
                )}
              </span>

              <div>
                <strong>
                  {notification.title ||
                    "Delivery Update"}
                </strong>

                <p>
                  {notification.message}
                </p>

                <small>
                  {notification.createdAt
                    ? new Date(
                        notification.createdAt
                      ).toLocaleString()
                    : ""}
                </small>
              </div>

              <span>
                {notification.status}
              </span>
            </div>
          ))
      )}

    </div>
  </section>
</main>


);
}

export default Notifications;

import { useEffect, useState } from "react";
import api from "./services/api";

function AdminDashboard() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const res = await api.get("/activities");
      setActivities(res.data);
    } catch {
      setActivities([]);
    }
  };

  return (
    <section className="card admin-card">
      <div className="section-head">
        <div>
          <h2>Admin Dashboard</h2>
          <p className="admin-subtitle">User activity monitoring</p>
        </div>

        <span className="section-count">
          {activities.length} activities
        </span>
      </div>

      {activities.length === 0 ? (
        <div className="empty-state">No activities found.</div>
      ) : (
        <div className="activity-list">
          {activities.map((activity) => (
            <div className="activity-item" key={activity._id}>
              <div className="activity-icon">
                {activity.action?.charAt(0)}
              </div>

              <div className="activity-content">
                <div className="activity-top">
                  <strong>{activity.username}</strong>
                  <span className="activity-action">{activity.action}</span>
                </div>

                <p>{activity.detail}</p>

                <span className="activity-time">
                  {new Date(activity.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default AdminDashboard;
import { useEffect, useState } from "react";
import API from "../services/api";

const DashboardPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const fetchMyOrders = async () => {
    try {
      const res = await API.get("/user/my-orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to load your orders", err);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>🍕 Build Your Pizza</h2>
      {/* You can include your pizza builder and payment code here */}

      <hr />
      <h3>📦 Your Orders</h3>

      {orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
            <p><strong>Pizza:</strong> {order.base}, {order.sauce}, {order.cheese}</p>
            <p><strong>Veggies:</strong> {order.veggies.length > 0 ? order.veggies.join(", ") : "None"}</p>
            <p><strong>Meat:</strong> {order.meat.length > 0 ? order.meat.join(", ") : "None"}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Ordered On:</strong> {new Date(order.createdAt).toLocaleString()}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default DashboardPage;

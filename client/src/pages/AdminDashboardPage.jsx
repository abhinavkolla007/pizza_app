import { useEffect, useState } from "react";
import API from "../services/api";

const AdminDashboardPage = () => {
  const [inventory, setInventory] = useState([]);
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newItem, setNewItem] = useState({
    type: "",
    name: "",
    stock: 0,
    threshold: 20,
  });
  const [updatedStocks, setUpdatedStocks] = useState({});

  useEffect(() => {
    fetchInventory();
    fetchOrders();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await API.get("/admin/inventory");
      setInventory(res.data);

      const stockMap = {};
      res.data.forEach(item => {
        stockMap[item._id] = item.stock;
      });
      setUpdatedStocks(stockMap);
    } catch (err) {
      console.error("Failed to load inventory", err);
      // alert("Failed to load inventory. Please try again."); // User feedback
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await API.get("/admin/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to load orders", err);
      // alert("Failed to load orders. Please try again."); // User feedback
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      await API.post("/admin/inventory", newItem);
      alert("Item added!");
      setNewItem({ type: "", name: "", stock: 0, threshold: 20 });
      fetchInventory();
    } catch (err) {
      alert("Failed to add item: " + (err.response?.data?.message || err.message));
    }
  };

  const handleUpdateStock = async (id) => {
    const stock = parseInt(updatedStocks[id]);
    if (isNaN(stock)) {
      alert("Invalid stock number");
      return;
    }
    try {
      await API.put(`/admin/inventory/${id}`, { stock });
      alert("Stock updated!"); // Added confirmation
      fetchInventory();
    } catch (err) {
      alert("Failed to update stock: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await API.delete(`/admin/inventory/${id}`);
      alert("Item deleted!"); // Added confirmation
      fetchInventory();
    } catch (err) {
      alert("Failed to delete item: " + (err.response?.data?.message || err.message));
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await API.put(`/admin/orders/${id}/status`, { status });
      alert("Order status updated!"); // Added confirmation
      fetchOrders();
    } catch (err) {
      alert("Failed to update order status: " + (err.response?.data?.message || err.message));
    }
  };

  // Filtered Inventory Based on Search
  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    // Outer container for the full screen background and relative positioning
    <div style={{
      minHeight: "100vh",
      width: "100vw",
      background: "linear-gradient(135deg, #FFC7B2 0%, #E0BBE4 100%)", // Consistent Background
      margin: 0,
      padding: 0,
      boxSizing: "border-box",
      position: "relative",
      overflow: "hidden" // Ensure no body scrollbars
    }}>
      {/* Global styles injected into the head */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap');
          
          html, body {
            margin: 0;
            padding: 0;
            height: 100%;
            font-size: 16px; 
          }
          body {
            font-family: 'Poppins', sans-serif;
            overflow: hidden;
          }

          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          /* --- Unified Input/Select/Button Styling --- */
          input[type="email"],
          input[type="password"],
          input[type="text"],
          input[type="number"], /* Include number inputs */
          select { 
            font-size: 16px !important; 
            -webkit-text-size-adjust: 100% !important; 
            line-height: normal !important; 
            box-sizing: border-box !important; 
            outline: none !important; 

            padding: 0.75rem 1rem; 
            border: 1px solid #ddd;
            border-radius: 8px;
            background: #f0f4ff;
            font-family: 'Poppins', sans-serif; 
            width: 100%; /* Default width */
            -webkit-appearance: none; 
            -moz-appearance: none; 
            appearance: none; 
          }

          button[type="submit"],
          button {
            padding: 0.75rem 1.5rem;
            background: linear-gradient(90deg, #6a11cb 0%, #2575fc 100%);
            color: #fff;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: bold;
            cursor: pointer;
            font-family: 'Poppins', sans-serif;
            transition: background 0.2s, transform 0.1s ease-in-out;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
          }
          button[type="submit"]:hover,
          button:hover {
            background: linear-gradient(90deg, #2575fc 0%, #6a11cb 100%);
            transform: translateY(-2px);
            box-shadow: 0 6px 15px rgba(0,0,0,0.15);
          }
          button[type="submit"]:active,
          button:active {
            transform: scale(0.98);
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }

          /* Specific styling for select arrow */
          .select-wrapper::after {
            content: '▼';
            font-size: 0.7rem; 
            color: #aaa;
            position: absolute;
            right: 1rem;
            top: calc(50% + 3px); 
            transform: translateY(-50%); 
            pointer-events: none; 
          }

          /* Table Styling */
          table {
            width: 100%;
            border-collapse: separate; /* Allow border-radius on cells */
            border-spacing: 0;
            margin-top: 1.5rem;
            box-shadow: 0 4px 20px rgba(0,0,0,0.05);
            border-radius: 12px;
            overflow: hidden; /* Ensures rounded corners apply to content */
          }

          th, td {
            padding: 1rem;
            text-align: left;
            border-bottom: 1px solid #eee; /* Separator for rows */
            font-family: 'Poppins', sans-serif;
            font-size: 0.95rem;
            color: #333;
          }

          thead th {
            background-color: #f8faff;
            color: #2575fc;
            font-weight: 700;
            text-transform: uppercase;
            font-size: 0.85rem;
            letter-spacing: 0.05em;
          }

          tbody tr:last-child td {
            border-bottom: none; /* No border for the last row */
          }

          tbody tr:hover {
            background-color: #fefefe;
          }

          /* Special styles for table cells with buttons/inputs */
          td button {
            padding: 0.5rem 0.8rem;
            font-size: 0.8rem;
            margin-left: 0.5rem;
            box-shadow: none; /* Smaller shadow for table buttons */
          }
          td input[type="number"] {
            width: 80px !important; /* Specific width for stock input */
            display: inline-block;
            margin-right: 0.5rem;
            padding: 0.5rem 0.8rem;
            font-size: 0.9rem !important;
          }
        `}
      </style>
      
      {/* The centered main admin dashboard container */}
      <div style={{
        background: "#fff",
        padding: "2.5rem",
        borderRadius: "16px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
        width: "900px", // Increased width for admin content
        maxWidth: "95%", 
        textAlign: "left", // Align content to left within the card
        animation: "fadeIn 1s forwards",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        maxHeight: "95vh", // Limit height
        overflowY: "auto", // Allow scrolling within the dashboard card
        display: "flex",
        flexDirection: "column",
        gap: "2.5rem" // Space between major sections
      }}>
        <h2 style={{ color: "#2575fc", marginBottom: "0.5rem", fontFamily: "'Poppins', sans-serif", textAlign: "center" }}>🛠️ Admin Dashboard</h2>

        {/* Add New Inventory Item Section */}
        <div>
          <h3 style={{ color: "#6a11cb", marginBottom: "1rem", fontFamily: "'Poppins', sans-serif" }}>➕ Add New Inventory Item</h3>
          <form onSubmit={handleAddItem} style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "flex-end" }}>
            <div style={{ flex: "1 1 200px" }}>
              <label htmlFor="newItemType" style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.9rem", color: "#555" }}>Type:</label>
              <input
                id="newItemType"
                placeholder="e.g., base, sauce, cheese"
                value={newItem.type}
                onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
                required
                type="text"
                style={{ width: "100%" }}
              />
            </div>
            <div style={{ flex: "1 1 200px" }}>
              <label htmlFor="newItemName" style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.9rem", color: "#555" }}>Name:</label>
              <input
                id="newItemName"
                placeholder="e.g., Thin Crust, Tomato Basil"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                required
                type="text"
                style={{ width: "100%" }}
              />
            </div>
            <div style={{ flex: "0 1 100px" }}>
              <label htmlFor="newItemStock" style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.9rem", color: "#555" }}>Stock:</label>
              <input
                id="newItemStock"
                type="number"
                placeholder="0"
                value={newItem.stock}
                onChange={(e) => setNewItem({ ...newItem, stock: e.target.value })}
                required
                style={{ width: "100%" }}
              />
            </div>
            <div style={{ flex: "0 1 100px" }}>
              <label htmlFor="newItemThreshold" style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.9rem", color: "#555" }}>Threshold:</label>
              <input
                id="newItemThreshold"
                type="number"
                placeholder="20"
                value={newItem.threshold}
                onChange={(e) => setNewItem({ ...newItem, threshold: e.target.value })}
                required
                style={{ width: "100%" }}
              />
            </div>
            <button type="submit" style={{ flex: "0 1 auto", minWidth: "120px" }}>Add Item</button>
          </form>
        </div>

        {/* Search Inventory Section */}
        <div>
          <h3 style={{ color: "#6a11cb", marginBottom: "1rem", fontFamily: "'Poppins', sans-serif" }}>🔍 Search Inventory</h3>
          <input
            type="text"
            placeholder="Search by name or type"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: "clamp(200px, 50%, 400px)" }} /* Responsive width */
          />
        </div>

        {/* Inventory Items Section */}
        <div>
          <h3 style={{ color: "#6a11cb", marginBottom: "1rem", fontFamily: "'Poppins', sans-serif" }}>📦 Inventory Items</h3>
          {filteredInventory.length === 0 ? (
            <p style={{ color: "#555" }}>No matching inventory items found.</p>
          ) : (
            <div style={{ maxHeight: "300px", overflowY: "auto", borderRadius: "12px", border: "1px solid #eee" }}> {/* Scrollable table wrapper */}
              <table>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Name</th>
                    <th>Stock</th>
                    <th>Threshold</th>
                    <th>Status</th>
                    <th>Update Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInventory.map((item) => (
                    <tr key={item._id}>
                      <td>{item.type}</td>
                      <td>{item.name}</td>
                      <td>{item.stock}</td>
                      <td>{item.threshold}</td>
                      <td style={{ color: item.stock < item.threshold ? "#dc3545" : "#28a745", fontWeight: "bold" }}>
                        {item.stock < item.threshold ? "⚠️ Low" : "✅ OK"}
                      </td>
                      <td>
                        <input
                          type="number"
                          value={updatedStocks[item._id]}
                          onChange={(e) =>
                            setUpdatedStocks({ ...updatedStocks, [item._id]: e.target.value })
                          }
                        />
                        <button onClick={() => handleUpdateStock(item._id)} style={{ marginLeft: "0.5rem" }}>Update</button>
                      </td>
                      <td>
                        <button onClick={() => handleDeleteItem(item._id)} style={{ background: "linear-gradient(90deg, #dc3545 0%, #ff6b6b 100%)" }}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* User Orders Section */}
        <div>
          <h3 style={{ color: "#6a11cb", marginBottom: "1rem", fontFamily: "'Poppins', sans-serif" }}>🍕 User Orders</h3>
          {orders.length === 0 ? (
            <p style={{ color: "#555" }}>No user orders yet.</p>
          ) : (
            <div style={{ maxHeight: "400px", overflowY: "auto", borderRadius: "12px", border: "1px solid #eee" }}> {/* Scrollable table wrapper */}
              <table>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Pizza Details</th>
                    <th>Status</th>
                    <th>Change Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td>{order.userId?.email || "N/A"}</td>
                      <td>
                        <strong>Base:</strong> {order.base}<br />
                        <strong>Sauce:</strong> {order.sauce}<br />
                        <strong>Cheese:</strong> {order.cheese}<br />
                        <strong>Veggies:</strong> {order.veggies.join(", ") || "None"}<br />
                        <strong>Meat:</strong> {order.meat.join(", ") || "None"}
                      </td>
                      <td style={{ color: order.status === 'Delivered' ? '#28a745' : '#ffc107', fontWeight: 'bold' }}>{order.status}</td>
                      <td>
                        <div className="select-wrapper" style={{ position: "relative", width: "fit-content" }}>
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                            style={{ width: "150px" }} /* Specific width for order status select */
                          >
                            <option>Order Received</option>
                            <option>In Kitchen</option>
                            <option>Out for Delivery</option>
                            <option>Delivered</option> {/* Added Delivered status */}
                          </select>
                        </div>
                        <button onClick={() => updateOrderStatus(order._id, order.status)} style={{ marginLeft: "0.5rem" }}>Update</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
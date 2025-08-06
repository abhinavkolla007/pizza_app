import { useState, useEffect } from "react";
import API from "../services/api";

const DashboardPage = () => {
  const [base, setBase] = useState("");
  const [sauce, setSauce] = useState("");
  const [cheese, setCheese] = useState("");
  const [veggies, setVeggies] = useState([]);
  const [meat, setMeat] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingRazorpay, setLoadingRazorpay] = useState(true); // New state for Razorpay loading

  const veggieOptions = ["Onion", "Capsicum", "Mushroom", "Tomato", "Corn"];
  const meatOptions = ["Chicken", "Pepperoni", "Sausage", "Ham"];

  const fetchOrders = async () => {
    try {
      const res = await API.get("/pizza/my-orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to load orders:", err.response?.data || err.message);
      // alert("Failed to load orders. Please try again."); // Consider user-friendly alert
    }
  };

  // Effect to handle admin redirect and fetch orders for users
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role === "admin") {
      window.location.href = "/admin"; // Redirect to admin page
    } else {
      fetchOrders();
    }
  }, []);

  // Effect to load Razorpay script dynamically
  useEffect(() => {
    const scriptId = 'razorpay-checkout-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => {
        setLoadingRazorpay(false);
      };
      script.onerror = () => {
        console.error("Failed to load Razorpay SDK.");
        setLoadingRazorpay(false); // Still set to false to unblock, though payment won't work
        alert("Failed to load payment gateway. Please try again later.");
      };
      document.body.appendChild(script);
    } else {
      setLoadingRazorpay(false); // Script already loaded
    }
  }, []);


  const handlePaymentAndOrder = async (e) => {
    e.preventDefault();

    if (loadingRazorpay) {
      alert("Payment gateway is still loading. Please wait a moment.");
      return;
    }

    // Basic validation for pizza components
    if (!base || !sauce || !cheese) {
      alert("Please select a base, sauce, and cheese for your pizza!");
      return;
    }

    try {
      const paymentRes = await API.post("/payment/create-order", { amount: 299 });
      const { id: order_id } = paymentRes.data;

      const options = {
        key: "rzp_test_9V4PgB7GoLGO3H", // Replace with your actual key in production
        amount: 299 * 100, // amount in paisa
        currency: "INR",
        name: "Custom Pizza Order",
        description: "Your delicious custom pizza!",
        order_id: order_id,
        handler: async function (response) {
          try {
            alert("✅ Payment successful!");
            await API.post("/pizza/order", {
              base,
              sauce,
              cheese,
              veggies,
              meat,
              paymentId: response.razorpay_payment_id, // Save payment ID
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature,
            });

            // Clear form fields
            setBase(""); setSauce(""); setCheese("");
            setVeggies([]); setMeat([]);

            fetchOrders(); // Refresh orders list
          } catch (orderErr) {
            console.error("Failed to place order after payment:", orderErr.response?.data || orderErr.message);
            alert("Order placement failed after successful payment. Please contact support.");
          }
        },
        prefill: {
          name: "Customer Name", // You might want to prefill with user's actual name/email
          email: "customer@example.com",
          contact: "9999999999", // Optional: prefill contact number
        },
        theme: {
          color: "#6a11cb" // Match your button gradient start color
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (err) {
      console.error("Payment or order initiation failed:", err.response?.data || err.message);
      alert("Payment or order initiation failed. Please try again.");
    }
  };

  return (
    // Outer container for the full screen background and relative positioning
    <div style={{
      minHeight: "100vh",
      width: "100vw",
      background: "linear-gradient(135deg, #FFC7B2 0%, #E0BBE4 100%)", // Warm Peach to Soft Lavender
      margin: 0,
      padding: 0,
      boxSizing: "border-box",
      position: "relative",
      overflow: "hidden"
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

          /* --- IMPORTANT: Pure CSS Syntax for Inputs/Selects/Checkboxes --- */
          input[type="email"],
          input[type="password"],
          input[type="text"],
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
            width: 100%; 
            -webkit-appearance: none; 
            -moz-appearance: none; 
            appearance: none; 
          }

          /* Specific styling for checkboxes */
          input[type="checkbox"] {
            width: auto !important; /* Override 100% width for checkboxes */
            margin-right: 0.5rem;
            transform: scale(1.2); /* Make checkboxes slightly larger */
            cursor: pointer;
            -webkit-appearance: checkbox; /* Ensure standard checkbox appearance */
            -moz-appearance: checkbox;
            appearance: checkbox;
            box-shadow: none !important; /* Remove box-shadow on focus for checkboxes */
            border-radius: 4px; /* Slightly rounded corners for checkboxes */
            border: 1px solid #ccc;
            background-color: #fff;
          }

          input[type="checkbox"]:checked {
            background-color: #6a11cb; /* Checkbox checked color */
            border-color: #6a11cb;
          }
          
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

          /* Style for labels associated with checkboxes */
          .checkbox-group label {
            font-size: 1rem;
            color: #333;
            display: flex; /* Use flex for alignment */
            align-items: center;
            margin-bottom: 0.5rem;
          }
        `}
      </style>
      
      {/* The centered main dashboard container */}
      <div style={{
        background: "#fff",
        padding: "2.5rem 2rem",
        borderRadius: "16px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
        width: "700px", // Wider for dashboard content
        maxWidth: "95%", // Responsive max width
        textAlign: "center",
        animation: "fadeIn 1s forwards",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        maxHeight: "95vh", // Limit height
        overflowY: "auto", // Allow scrolling within the dashboard card
        display: "flex", // Use flexbox for internal layout
        flexDirection: "column", // Stack content vertically
        gap: "2rem" // Space between sections
      }}>
        {/* Pizza Builder Section */}
        <div style={{ borderBottom: "1px solid #eee", paddingBottom: "2rem" }}>
          <h2 style={{ color: "#2575fc", marginBottom: "1.5rem", fontFamily: "'Poppins', sans-serif" }}>Build Your Pizza</h2>
          <form onSubmit={handlePaymentAndOrder}>
            {/* Base Select */}
            <div style={{ position: "relative", marginBottom: "1.2rem", textAlign: "left" }} className="select-wrapper">
              <label htmlFor="base-select" style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "#555", fontFamily: "'Poppins', sans-serif" }}>Base:</label>
              <select id="base-select" value={base} onChange={(e) => setBase(e.target.value)} required>
                <option value="">--Select Base--</option>
                <option>Thin Crust</option>
                <option>Cheese Burst</option>
                <option>Pan Crust</option>
                <option>Wheat Thin</option>
                <option>Classic</option>
              </select>
            </div>

            {/* Sauce Select */}
            <div style={{ position: "relative", marginBottom: "1.2rem", textAlign: "left" }} className="select-wrapper">
              <label htmlFor="sauce-select" style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "#555", fontFamily: "'Poppins', sans-serif" }}>Sauce:</label>
              <select id="sauce-select" value={sauce} onChange={(e) => setSauce(e.target.value)} required>
                <option value="">--Select Sauce--</option>
                <option>Tomato Basil</option>
                <option>Barbecue</option>
                <option>Alfredo</option>
                <option>Spicy Red</option>
                <option>Pesto</option>
              </select>
            </div>

            {/* Cheese Select */}
            <div style={{ position: "relative", marginBottom: "1.2rem", textAlign: "left" }} className="select-wrapper">
              <label htmlFor="cheese-select" style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "#555", fontFamily: "'Poppins', sans-serif" }}>Cheese:</label>
              <select id="cheese-select" value={cheese} onChange={(e) => setCheese(e.target.value)} required>
                <option value="">--Select Cheese--</option>
                <option>Mozzarella</option>
                <option>Cheddar</option>
                <option>Parmesan</option>
                <option>Vegan Cheese</option>
              </select>
            </div>

            {/* Veggies Checkboxes */}
            <div style={{ marginBottom: "1.2rem", textAlign: "left" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "#555", fontFamily: "'Poppins', sans-serif" }}>Veggies:</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
                {veggieOptions.map((v) => (
                  <div key={v} className="checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        value={v}
                        checked={veggies.includes(v)}
                        onChange={(e) => {
                          if (e.target.checked) setVeggies([...veggies, v]);
                          else setVeggies(veggies.filter((item) => item !== v));
                        }}
                      />
                      {v}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Meat Checkboxes */}
            <div style={{ marginBottom: "1.5rem", textAlign: "left" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "#555", fontFamily: "'Poppins', sans-serif" }}>Meat:</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
                {meatOptions.map((m) => (
                  <div key={m} className="checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        value={m}
                        checked={meat.includes(m)}
                        onChange={(e) => {
                          if (e.target.checked) setMeat([...meat, m]);
                          else setMeat(meat.filter((item) => item !== m));
                        }}
                      />
                      {m}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Pay & Place Order Button */}
            <button
              type="submit"
              disabled={loadingRazorpay} // Disable button while Razorpay loads
              style={{
                width: "100%",
                padding: "0.75rem",
                background: "linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: "bold",
                cursor: loadingRazorpay ? "not-allowed" : "pointer",
                marginTop: "1rem",
                fontFamily: "'Poppins', sans-serif",
                transition: "background 0.2s, transform 0.1s ease-in-out",
                opacity: loadingRazorpay ? 0.7 : 1, // Visual feedback for loading
              }}
              onMouseOver={e => !loadingRazorpay && (e.target.style.background = "linear-gradient(90deg, #2575fc 0%, #6a11cb 100%)")}
              onMouseOut={e => !loadingRazorpay && (e.target.style.background = "linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)")}
              onMouseDown={e => !loadingRazorpay && (e.target.style.transform = "scale(0.98)")}
              onMouseUp={e => !loadingRazorpay && (e.target.style.transform = "scale(1)")}
            >
              {loadingRazorpay ? "Loading Payment..." : "Pay ₹299 & Place Order"}
            </button>
          </form>
        </div>

        {/* Your Orders Section */}
        <div style={{ paddingTop: "1rem" }}>
          <h3 style={{ color: "#2575fc", marginBottom: "1.5rem", fontFamily: "'Poppins', sans-serif" }}>Your Orders</h3>
          {orders.length === 0 ? (
            <p style={{ color: "#555", fontFamily: "'Poppins', sans-serif" }}>No orders yet. Build your first pizza!</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {orders.map((order) => (
                <li
                  key={order._id}
                  style={{
                    marginBottom: "1rem",
                    padding: "1.2rem",
                    border: "1px solid #eee",
                    borderRadius: "12px",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
                    background: "#fff",
                    textAlign: "left",
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  <strong style={{ color: "#6a11cb" }}>Pizza:</strong> {order.base}, {order.sauce}, {order.cheese}
                  <br />
                  <strong style={{ color: "#6a11cb" }}>Veggies:</strong> {order.veggies.join(", ") || "None"}
                  <br />
                  <strong style={{ color: "#6a11cb" }}>Meat:</strong> {order.meat.join(", ") || "None"}
                  <br />
                  <strong style={{ color: "#6a11cb" }}>Status:</strong> <span style={{ color: order.status === 'Delivered' ? '#28a745' : '#ffc107', fontWeight: 'bold' }}>{order.status}</span>
                  <br />
                  <strong style={{ color: "#6a11cb" }}>Ordered On:</strong>{" "}
                  {new Date(order.createdAt).toLocaleString()}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../services/api";
// import "../styles/OrderPage.css";

// export default function OrderPage() {
//   const navigate = useNavigate();

//   const [base, setBase] = useState("Thin Crust");
//   const [sauce, setSauce] = useState("Tomato");
//   const [cheese, setCheese] = useState("Mozzarella");
//   const [veggies, setVeggies] = useState([]);
//   const [meat, setMeat] = useState([]);
//   const amount = 499;

//   const handleCheckboxChange = (e, setter, currentState) => {
//     const value = e.target.value;
//     if (e.target.checked) {
//       setter([...currentState, value]);
//     } else {
//       setter(currentState.filter((item) => item !== value));
//     }
//   };

//   const handlePayNow = async () => {
//     try {
//       const res = await API.post("/payment/create-order", { amount });
//       const order = res.data;

//       const options = {
//         key: "rzp_test_9V4PgB7GoLGO3H",
//         amount: order.amount,
//         currency: "INR",
//         name: "Pizza Ordering App",
//         description: "Order Payment",
//         order_id: order.id,
//         handler: async function (response) {
//           try {
//             // Step 1: Verify Payment
//             await API.post("/payment/verify", {
//               razorpay_payment_id: response.razorpay_payment_id,
//               razorpay_order_id: response.razorpay_order_id,
//               razorpay_signature: response.razorpay_signature,
//             });

//             // Step 2: Place Pizza Order
//             await API.post("/user/place-order", {
//               base,
//               sauce,
//               cheese,
//               veggies,
//               meat,
//             });

//             alert("✅ Payment Verified and Order Placed!");
//             navigate("/my-orders");
//           } catch (err) {
//             alert("❌ Payment succeeded, but placing order failed.");
//             console.error(err);
//           }
//         },
//         prefill: {
//           name: "Abhinav Kolla",
//           email: "abhinav@example.com",
//           contact: "9999999999",
//         },
//         theme: {
//           color: "#F37254",
//         },
//       };

//       const rzp = new window.Razorpay(options);
//       rzp.open();
//     } catch (err) {
//       console.error("Error initiating payment:", err);
//       alert("⚠️ Payment initiation failed.");
//     }
//   };

//   return (
//     <div className="order-container">
//       <h1>🍕 Build Your Pizza</h1>

//       <div className="option-group">
//         <label><strong>Base:</strong></label>
//         <select value={base} onChange={(e) => setBase(e.target.value)}>
//           <option>Thin Crust</option>
//           <option>Thick Crust</option>
//           <option>Cheese Burst</option>
//         </select>
//       </div>

//       <div className="option-group">
//         <label><strong>Sauce:</strong></label>
//         <select value={sauce} onChange={(e) => setSauce(e.target.value)}>
//           <option>Tomato</option>
//           <option>Barbecue</option>
//           <option>White Garlic</option>
//         </select>
//       </div>

//       <div className="option-group">
//         <label><strong>Cheese:</strong></label>
//         <select value={cheese} onChange={(e) => setCheese(e.target.value)}>
//           <option>Mozzarella</option>
//           <option>Cheddar</option>
//           <option>Parmesan</option>
//         </select>
//       </div>

//       <div className="option-group">
//         <label><strong>Veggies:</strong></label>
//         {["Onion", "Capsicum", "Mushroom", "Corn"].map((veg) => (
//           <label key={veg}>
//             <input
//               type="checkbox"
//               value={veg}
//               checked={veggies.includes(veg)}
//               onChange={(e) => handleCheckboxChange(e, setVeggies, veggies)}
//             />
//             {veg}
//           </label>
//         ))}
//       </div>

//       <div className="option-group">
//         <label><strong>Meat:</strong></label>
//         {["Chicken", "Ham", "Sausage"].map((m) => (
//           <label key={m}>
//             <input
//               type="checkbox"
//               value={m}
//               checked={meat.includes(m)}
//               onChange={(e) => handleCheckboxChange(e, setMeat, meat)}
//             />
//             {m}
//           </label>
//         ))}
//       </div>

//       <div className="summary">
//         <p>Total Amount: <strong>₹{amount}</strong></p>
//         <button className="pay-btn" onClick={handlePayNow}>💳 Pay Now</button>
//       </div>
//     </div>
//   );
// }
import { useState } from "react";
import API from "../services/api";

export default function OrderPage() {
  const [base, setBase] = useState("Thin Crust");
  const [sauce, setSauce] = useState("Tomato");
  const [cheese, setCheese] = useState("Mozzarella");
  const [veggies, setVeggies] = useState([]);
  const [meat, setMeat] = useState([]);
  const amount = 499;

  const handleCheckboxChange = (e, setter, currentState) => {
    const value = e.target.value;
    if (e.target.checked) {
      setter([...currentState, value]);
    } else {
      setter(currentState.filter((item) => item !== value));
    }
  };

  const handlePayNow = async () => {
    try {
      const res = await API.post("/payment/create-order", { amount });
      const order = res.data;

      const options = {
        key: "rzp_test_9V4PgB7GoLGO3H",
        amount: order.amount,
        currency: "INR",
        name: "Pizza Ordering App",
        description: "Order Payment",
        order_id: order.id,
        handler: async function (response) {
          try {
            await API.post("/payment/verify", {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });

            await API.post("/user/place", {
              base,
              sauce,
              cheese,
              veggies,
              meat,
            });

            alert("✅ Payment Verified and Order Placed!");
          } catch (err) {
            alert("❌ Payment succeeded, but placing order failed.");
            console.error(err);
          }
        },
        prefill: {
          name: "Abhinav Kolla",
          email: "abhinav@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#F37254",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Error initiating payment:", err);
      alert("⚠️ Payment initiation failed.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-yellow-50 to-red-100 flex flex-col items-center p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-center mb-6 text-red-600">🍕 Build Your Pizza</h1>

        <div className="grid gap-6">
          <div>
            <label className="block font-semibold text-lg mb-1">Base</label>
            <select value={base} onChange={(e) => setBase(e.target.value)} className="w-full border p-2 rounded-lg">
              <option>Thin Crust</option>
              <option>Thick Crust</option>
              <option>Cheese Burst</option>
              <option>Whole Wheat</option>
              <option>Gluten Free</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-lg mb-1">Sauce</label>
            <select value={sauce} onChange={(e) => setSauce(e.target.value)} className="w-full border p-2 rounded-lg">
              <option>Tomato</option>
              <option>Barbecue</option>
              <option>White Garlic</option>
              <option>Alfredo</option>
              <option>Pesto</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-lg mb-1">Cheese</label>
            <select value={cheese} onChange={(e) => setCheese(e.target.value)} className="w-full border p-2 rounded-lg">
              <option>Mozzarella</option>
              <option>Cheddar</option>
              <option>Parmesan</option>
              <option>Vegan Cheese</option>
              <option>Swiss</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-lg mb-1">Veggies</label>
            <div className="grid grid-cols-2 gap-2">
              {["Onion", "Capsicum", "Mushroom", "Corn", "Tomato", "Olives"].map((veg) => (
                <label key={veg} className="flex items-center gap-2">
                  <input type="checkbox" value={veg} checked={veggies.includes(veg)} onChange={(e) => handleCheckboxChange(e, setVeggies, veggies)} />
                  {veg}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-lg mb-1">Meat</label>
            <div className="grid grid-cols-2 gap-2">
              {["Chicken", "Ham", "Sausage", "Pepperoni"].map((m) => (
                <label key={m} className="flex items-center gap-2">
                  <input type="checkbox" value={m} checked={meat.includes(m)} onChange={(e) => handleCheckboxChange(e, setMeat, meat)} />
                  {m}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xl font-bold mb-4">Total: ₹{amount}</p>
          <button
            onClick={handlePayNow}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl text-lg shadow-lg transition-transform transform hover:scale-105"
          >
            💳 Pay & Order Now
          </button>
        </div>
      </div>
    </div>
  );
}

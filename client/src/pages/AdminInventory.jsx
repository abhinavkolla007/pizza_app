import { useEffect, useState } from "react";
import API from "../services/api";

const AdminInventory = () => {
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await API.get("/inventory");
      setInventory(res.data);
    } catch (err) {
      alert("Failed to fetch inventory");
    }
  };

  const handleUpdate = async (id, quantity) => {
    try {
      await API.put(`/inventory/${id}`, { quantity });
      fetchInventory();
    } catch (err) {
      alert("Failed to update inventory");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Inventory Management</h2>
      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Name</th>
            <th>Quantity</th>
            <th>Threshold</th>
            <th>Update</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map(item => (
            <tr key={item._id}>
              <td>{item.type}</td>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>{item.threshold}</td>
              <td>
                <input
                  type="number"
                  min="0"
                  defaultValue={item.quantity}
                  onBlur={e => handleUpdate(item._id, Number(e.target.value))}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminInventory;
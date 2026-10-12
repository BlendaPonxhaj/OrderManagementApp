
import { useState } from "react";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [role, setRole] = useState("");

  const [orders, setOrders] = useState([]);
  const [couriers, setCouriers] = useState([]);
  const [selectedCouriers, setSelectedCouriers] = useState({});

  const [customer, setCustomer] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  const [courierUsername, setCourierUsername] = useState("");
  const [courierPassword, setCourierPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [editingOrder, setEditingOrder] = useState(null);
  const [editCustomer, setEditCustomer] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [deletingOrderId, setDeletingOrderId] = useState(null);

  function showMessage(text, type) {
  setMessage(text);
  setMessageType(type);
}
  async function handleLogin() {
    if (!username.trim() || !password.trim()) {
  showMessage("Please fill in all fields", "error");
  return;
}
    try {
      const response = await fetch("http://localhost:5157/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: username,
          password: password
        })
      });

      if (response.ok) {
        const data = await response.json();
        setToken(data.token);
        setRole(data.role);
        setPassword("");
        setMessage("");
      } else {
        showMessage("Username ose password gabim!","error");
      }
    } catch {
      showMessage("Could not connect to server","error");
    }
  }

  
  async function getOrders() {
    const response = await fetch("http://localhost:5157/api/orders", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      setOrders(data);
    } else {
      showMessage("Could not load orders","error");
    }
  }

  
  async function createOrder() {
    if (!customer.trim() || !address.trim() || !phone.trim()) {
      showMessage("Please fill in all fields", "error");
      return;
    }

    const response = await fetch("http://localhost:5157/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        customer: customer,
        address: address,
        phone: phone,
      })
    });

    if (response.ok) {
      showMessage("Order created successfully!", "success");
      setCustomer("");
      setAddress("");
      setPhone("");
      getOrders();
    } else {
      showMessage("Could not create order", "error");
    }
  }

  
  async function getCouriers() {
    const response = await fetch("http://localhost:5157/api/users/couriers", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      setCouriers(data);
    } else {
      showMessage("Could not load couriers","error");
    }
  }

 
  async function createCourier() {
    if (!courierUsername.trim() || courierPassword.length < 8) {
      showMessage("Enter a username and a password with at least 8 characters","error");
      return;
    }

    const response = await fetch("http://localhost:5157/api/users/couriers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        username: courierUsername,
        password: courierPassword
      })
    });

    if (response.ok) {
      showMessage("Courier created successfully!","success");
      setCourierUsername("");
      setCourierPassword("");
      getCouriers();
    } else {
      showMessage("Could not create courier","error");
    }
  }

  
  async function assignCourier(orderId) {
  const order = orders.find(o => o.id === orderId);
  const courierId = Number(selectedCouriers[orderId] ?? order?.courierId);

  if (!courierId) {
    showMessage("Please select a courier", "error");
    return;
  }

  const response = await fetch(
    `http://localhost:5157/api/orders/${orderId}/assign`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ courierId })
    }
  );

  if (response.ok) {
  showMessage("Courier assigned successfully!", "success");

  await getOrders();

  setSelectedCouriers((prev) => {
    const updated = { ...prev };
    delete updated[orderId];
    return updated;
  });
} else {
  showMessage("Could not assign courier", "error");
}
}

 
  function editOrder(order) {
  setEditingOrder(order);
  setEditCustomer(order.customer);
  setEditAddress(order.address);
  setEditPhone(order.phone);
}

async function saveEdit() {
  if (!editCustomer.trim() || !editAddress.trim() || !editPhone.trim()) {
    showMessage("Please fill in all fields", "error");
    return;
  }

  const response = await fetch(
    `http://localhost:5157/api/orders/${editingOrder.id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        customer: editCustomer,
        address: editAddress,
        phone: editPhone
      })
    }
  );

  if (response.ok) {
    showMessage("Order updated successfully!", "success");
    setEditingOrder(null);
    getOrders();
  } else {
    showMessage("Could not update order", "error");
  }
}


  async function deleteOrder(orderId) {

    const response = await fetch(
      `http://localhost:5157/api/orders/${orderId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (response.ok) {
      showMessage("Order deleted successfully!","success");
      setDeletingOrderId(null);
      getOrders();
    } else {
      showMessage("Could not delete order","error");
    }
  }

  
  async function getMyOrders() {
    const response = await fetch(
      "http://localhost:5157/api/courier/orders/my",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (response.ok) {
      const data = await response.json();
      setOrders(data);
    } else {
      showMessage("Could not load orders","error");
    }
  }

  async function updateStatus(orderId, status) {
    const response = await fetch(
      `http://localhost:5157/api/courier/orders/${orderId}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      }
    );

    if (response.ok) {
      showMessage("Status updated successfully!","success");
      getMyOrders();
    } else {
      showMessage("Could not update status","error");
    }
  }


  function logout() {
    setToken("");
    setRole("");
    setOrders([]);
    setCouriers([]);
    setSelectedCouriers({});
    setUsername("");
    setPassword("");
    setCourierPassword("");
    setMessage("");
  }


  
  if(token) {
  return (
    <div>
      {message && (
        <div className={`message ${messageType}`}>
          <span>{message}</span>
          <button onClick={() => setMessage("")}>×</button>
        </div>
      )}

      
        <div className="header">
          <h1>
            {role === "Admin" ? "Admin Dashboard" : "Courier Dashboard"}
          </h1>

          <button onClick={logout}>Logout</button>
        </div>

        {role === "Admin" && (
          <div>

           
            <div className="card">
              <h2>Create Courier</h2>

              <input
                placeholder="Courier Username"
                value={courierUsername}
                onChange={(e) => setCourierUsername(e.target.value)}
                autoComplete="off"
                required
              />

              <input
                type="password"
                placeholder="Courier Password"
                value={courierPassword}
                onChange={(e) => setCourierPassword(e.target.value)}
                minLength={8}
                autoComplete="new-password"
                required
              />

              <button onClick={createCourier}>
                Create Courier
              </button>
            </div>

           
            <div className="card">
              <h2>Create Order</h2>

              <input
                placeholder="Customer"
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                required
              />

              <input
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />

              <input
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />

              <button onClick={createOrder}>
                Create Order
              </button>
            </div>
            {editingOrder && (

  <div className="card">
    <h2>Edit Order #{editingOrder.id}</h2>

    <input
      placeholder="Customer"
      value={editCustomer}
      onChange={(e) => setEditCustomer(e.target.value)}
      required
    />

    <input
      placeholder="Address"
      value={editAddress}
      onChange={(e) => setEditAddress(e.target.value)}
      required
    />

    <input
      placeholder="Phone"
      value={editPhone}
      onChange={(e) => setEditPhone(e.target.value)}
      required
    />

    <button onClick={saveEdit}>Save Changes</button>

    <button onClick={() => setEditingOrder(null)}>
      Cancel
    </button>
  </div>
)}       
     {deletingOrderId !== null && (
  <div className="card">
    <h3>Delete Order #{deletingOrderId}</h3>
    <p>Are you sure you want to delete this order?</p>

    <button onClick={() => deleteOrder(deletingOrderId)}>
      Yes, Delete
    </button>

    <button onClick={() => setDeletingOrderId(null)}>
      Cancel
    </button>
  </div>
)}
          
            <div className="card">
              <h2>Orders</h2>
              {message && (
  <div className={`message ${messageType}`}>{message}</div>
)}

              <button onClick={getOrders}>
                Show Orders
              </button>

              <button onClick={getCouriers}>
                Show Couriers
              </button>

              <table>
  <thead>
    <tr>
      <th>ID</th>
      <th>Customer</th>
      <th>Address</th>
      <th>Status</th>
      <th>Courier</th>
      <th>Actions</th>
    </tr>
  </thead>

  <tbody>
    {orders.map((order) => (
      <tr key={order.id}>
        <td>{order.id}</td>
        <td>{order.customer}</td>
        <td>{order.address}</td>
        <td>{order.status}</td>

        <td>
          
          <select
            value={selectedCouriers[order.id] ?? order.courierId ?? ""}
            onChange={(e) =>
              setSelectedCouriers({
                ...selectedCouriers,
                [order.id]: e.target.value
              })
            }
          >
            <option value="">Select Courier</option>

            {couriers.map((courier) => (
              <option key={courier.id} value={courier.id}>
                {courier.userName}
              </option>
            ))}
          </select>
        </td>

        <td>
          <button onClick={() => assignCourier(order.id)}>
            Assign
          </button>

          <button onClick={() => editOrder(order)}>
            Edit
          </button>

          <button onClick={() => setDeletingOrderId(order.id)}> Delete </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
                    
            </div>
          </div>
        )}

      {role === "Courier" && (
  <div className="card">
    <h2>My Orders</h2>

    <button onClick={getMyOrders}>
      Show My Orders
    </button>

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Customer</th>
          <th>Address</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {orders.map((order) => (
          <tr key={order.id}>
            <td>{order.id}</td>
            <td>{order.customer}</td>
            <td>{order.address}</td>
            <td>{order.status}</td>

            <td>
              <button
                onClick={() => updateStatus(order.id, "InTransit")}
              >
                In Transit
              </button>

              <button
                onClick={() => updateStatus(order.id, "Delivered")}
              >
                Delivered
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}
      </div>
    );
  }
        
    

  //Login page
  return (
    <div className="login-page">
       {message && (
      <div className={`message ${messageType}`}>
        <span>{message}</span>
        <button onClick={() => setMessage("")}>×</button>
      </div>
    )}
      <div className="card">
        <h1>Order Management System</h1>
        <h2>Login</h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
}

export default App;

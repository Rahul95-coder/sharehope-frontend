import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch("http://localhost:8080/api/user");
      const data = await response.json();
      console.log(data)
      setUsers(data)
    };

    fetchUsers();
  }, []);

  return (
    <>
      <h2>Hello</h2>

      {users.map((user) => (
        <div key={user._id}>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
          <p>{user.role}</p>
        </div>
      ))}
    </>
  );
}

export default App;
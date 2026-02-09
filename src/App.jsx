import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Todo from "./pages/Todo";

function App() {
  const [page, setPage] = useState("login");
  const token = localStorage.getItem("token");

  if (token) {
    return <Todo />;
  }

  return (
    <div className="app-container">
      {page === "login" ? <Login /> : <Register />}
      <button
        className="switch-btn"
        onClick={() => setPage(page === "login" ? "register" : "login")}
      >
        {page === "login" ? "Go to Register" : "Go to Login"}
      </button>
    </div>

  );
}

export default App;

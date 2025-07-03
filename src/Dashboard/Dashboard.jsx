import { NavLink, Outlet, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";
import { baseUrl } from "../../api";

const Dashboard = () => {
  const navigate = useNavigate();
  const userId = parseInt(localStorage.getItem("userId"));
  const [user, setUser] = useState(null);

  // 🧠 Получаем данные пользователя
  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    axios
      .get(baseUrl+`/users/${userId}`)
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem("userId");
        navigate("/login");
      });
  }, [userId, navigate]);

  // 🚪 Выход
  const handleLogout = () => {
    localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="profile">
          <div className="avatar">👤</div>
          {user?.fullName && <h3>{user.fullName}</h3>}
          {user?.login && <p>@{user.login}</p>}
        </div>

        <nav className="nav">
          <NavLink to="/" end>🏠 Профиль</NavLink>
          <NavLink to="/friends">👥 Друзья</NavLink>
          <NavLink to="/events">📅 События</NavLink>
          <NavLink to="/settings">⚙️ Настройки</NavLink>
        </nav>

        <div className="logout-wrapper">
          <button className="logout-btn" onClick={handleLogout}>🚪 Выйти</button>
        </div>
      </aside>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;

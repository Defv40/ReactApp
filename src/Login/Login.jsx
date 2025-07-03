import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { baseUrl } from "../../api";

const Login = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(baseUrl+"/api/login", {
        login,
        password,
      });

        // после успешного входа:
      const { id } = res.data;
      localStorage.setItem("userId", id); // ⬅️ сохраняем
     

      navigate("/"); // переходим на главную
    } catch (err) {
      console.error(err);
      setError("Ошибка авторизации. Пожалуйста повторите попытку позже");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <div className="login-icon">🔐</div>
          <h2>Добро пожаловать</h2>
          <p>Войдите в свой аккаунт</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="login">Логин</label>
          <input
            type="text"
            id="login"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            required
          />

          <label htmlFor="password">Пароль</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button type="submit">Войти</button>
        </form>

        <div className="login-footer">
          Нет аккаунта? <a href="/register">Зарегистрируйтесь</a>
        </div>
      </div>
    </div>
  );
};

export default Login;

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // простая валидация
    if (password.length < 6) {
      return setError("Пароль должен содержать минимум 6 символов");
    }

    if (password !== confirmPassword) {
      return setError("Пароли не совпадают");
    }
    const data = {
        login: username,
        password,
    }
    console.log(data);
    
    try {
      await axios.post("http://localhost:3000/api/register", data);

      // Перенаправление на логин после регистрации
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error || "Ошибка при регистрации. Попробуйте позже"
      );
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <div className="login-icon">📝</div>
          <h2>Создайте аккаунт</h2>
          <p>Заполните форму, чтобы зарегистрироваться</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="username">Логин</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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

          <label htmlFor="confirm-password">Подтвердите пароль</label>
          <input
            type="password"
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button type="submit">Зарегистрироваться</button>
        </form>

        <div className="login-footer">
          Уже есть аккаунт? <a href="/login">Войдите</a>
        </div>
      </div>
    </div>
  );
};

export default Register;

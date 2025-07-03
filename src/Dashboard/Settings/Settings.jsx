import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Settings.css";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../../../api";

const Settings = () => {
  const userId = parseInt(localStorage.getItem("userId"));
  const navigate = useNavigate();

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!userId) return;

    axios.get(baseUrl+`/users/${userId}`)
      .then(res => {
        setLogin(res.data.login);
      })
      .catch(err => {
        console.error("Ошибка загрузки логина:", err);
      });
  }, [userId]);

  const handleSave = async () => {
    try {
      const res = await axios.put(`${baseUrl}/users/${userId}/settings`, {
        login,
        password
      });

      setMessage("Данные успешно обновлены");
    } catch (err) {
      if (err.response?.status === 409) {
        setMessage("Этот логин уже занят");
      } else {
        setMessage("Ошибка при обновлении данных");
        console.error(err);
      }
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    try {
      await axios.delete(`${baseUrl}/users/${userId}`);
      localStorage.removeItem("userId");
      navigate("/login");
      alert("Аккаунт удалён");
    } catch (err) {
      setMessage("Ошибка при удалении аккаунта");
      console.error(err);
    }
  };

  return (
    <div className="settings-page">
      <h2>Настройки аккаунта</h2>

      {message && <p className="message">{message}</p>}

      <div className="form-group">
        <label>Новый логин:</label>
        <input
          type="text"
          placeholder="Введите новый логин"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Новый пароль:</label>
        <input
          type="password"
          placeholder="Введите новый пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button className="save-btn" onClick={handleSave}>
        Сохранить изменения
      </button>

      <hr className="divider" />

      <div className="danger-zone">
        <h3>Опасная зона</h3>
        <p>Удаление аккаунта необратимо. Все данные будут удалены.</p>

        <button className="delete-btn" onClick={handleDelete}>
          {confirmDelete ? "Подтвердить удаление" : "Удалить аккаунт"}
        </button>
      </div>
    </div>
  );
};

export default Settings;

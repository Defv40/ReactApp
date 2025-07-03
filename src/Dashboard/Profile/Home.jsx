import React, { useEffect, useState } from "react";
import axios from "axios";
import CalendarSelector from "../../Components/CalendarSelector";
import "./Home.css";
import { baseUrl } from "../../../api";

const Home = () => {
  // Форматирует дату для input type="date" (YYYY-MM-DD)
  function formatDateToInput(dateStr) {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toISOString().split("T")[0];
  }

  const userId = parseInt(localStorage.getItem("userId"));
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [messengers, setMessengers] = useState([""]);
  const [workDays, setWorkDays] = useState([]); // массив строк 'YYYY-MM-DD'
  const [birthDate, setBirthDate] = useState("");

  useEffect(() => {
    if (!userId) return;

    axios.get(`${baseUrl}/users/${userId}`)
      .then(res => {
        const user = res.data;

        setName(user.fullName || "");
        setPhone(user.phone || "");
        setMessengers(user.messengers && user.messengers.length ? user.messengers : [""]);
        setWorkDays(user.workDays && Array.isArray(user.workDays) ? user.workDays : []);
        setBirthDate(user.birthDate || "");
      })
      .catch(err => {
        console.error("Ошибка загрузки данных пользователя", err);
      });
  }, [userId]);

  const handleMessengerChange = (index, value) => {
    const updated = [...messengers];
    updated[index] = value;
    setMessengers(updated);
  };

  const addMessenger = () => setMessengers([...messengers, ""]);

  const removeMessenger = (index) => {
    if (messengers.length === 1) {
      // Чтобы всегда был хотя бы один input
      setMessengers([""]);
      return;
    }
    const updated = messengers.filter((_, i) => i !== index);
    setMessengers(updated);
  };

  const handleSubmit = () => {
    // Подготовка данных к отправке
    const data = {
      fullName: name.trim(),
      phone: phone.trim(),
      messengers: messengers.map(m => m.trim()).filter(m => m.length > 0),
      workDays,        // массив строк формата YYYY-MM-DD
      birthDate: birthDate ? new Date(birthDate).toISOString() : null,
    };

    axios.put(`${baseUrl}/users/${userId}`, data)
      .then(() => {
        alert("Информация сохранена!");
      })
      .catch(err => {
        console.error("Ошибка при сохранении данных", err);
        alert("Ошибка при сохранении данных");
      });
  };

  return (
    <div className="home-page">
      <h2>Профиль</h2>

      <div className="form-group">
        <label>ФИО:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Введите полное имя"
        />
      </div>

      <div className="form-group">
        <label>Телефон:</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+7 (___) ___-__-__"
        />
      </div>

      <div className="form-group">
        <label>Мессенджеры:</label>
        {messengers.map((messenger, i) => (
          <div key={i} className="messenger-input">
            <input
              type="text"
              placeholder="Telegram, WhatsApp..."
              value={messenger}
              onChange={(e) => handleMessengerChange(i, e.target.value)}
            />
            <button
              type="button"
              onClick={() => removeMessenger(i)}
              aria-label="Удалить мессенджер"
            >
              ❌
            </button>
          </div>
        ))}
        <button type="button" onClick={addMessenger}>➕ Добавить мессенджер</button>
      </div>

      <div className="form-group">
        <label>Рабочие дни в этом месяце:</label>
        <CalendarSelector
          selectedDays={workDays}      // массив строк "YYYY-MM-DD"
          setSelectedDays={setWorkDays}
        />
      </div>

      <div className="form-group">
        <label>Дата рождения:</label>
        <input
          type="date"
          value={formatDateToInput(birthDate)}
          onChange={(e) => setBirthDate(e.target.value)}
        />
      </div>

      <button className="submit-btn" onClick={handleSubmit}>Сохранить</button>
    </div>
  );
};

export default Home;

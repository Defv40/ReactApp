import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Events.css";

const Events = () => {
  const userId = parseInt(localStorage.getItem("userId"));

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [invitee, setInvitee] = useState("");
  const [invitees, setInvitees] = useState([]);
  const [friends, setFriends] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [activeEvents, setActiveEvents] = useState([]);
  const [archivedEvents, setArchivedEvents] = useState([]);
  const [commonDays, setCommonDays] = useState([]);


  const fetchCommonDays = async (inviteeIds) => {
    try {
      const res = await axios.get(`http://localhost:3000/users/common-workdays`, {
        params: { ids: inviteeIds.join(',') }
      });
      setCommonDays(res.data.commonDays);
    } catch (err) {
      console.error("Ошибка при загрузке общих дней", err);
    }
  };

  useEffect(() => {
    const ids = invitees.map(user => user.id);
    if (ids.length > 0) fetchCommonDays(ids);
    else setCommonDays([]);
  }, [invitees]);

  useEffect(() => {
  if (!userId) return;

  // Получаем друзей
  axios.get(`http://localhost:3000/friends/list/${userId}`)
    .then(res => setFriends(res.data))
    .catch(console.error);

  // Получаем активные встречи
  axios.get(`http://localhost:3000/events/active/${userId}`)
    .then(res => setActiveEvents(res.data))
    .catch(console.error);

  // Получаем прошедшие встречи
  axios.get(`http://localhost:3000/events/past/${userId}`)
    .then(res => setArchivedEvents(res.data))
    .catch(console.error);
}, [userId]);


  const handleInviteeChange = (e) => {
    const value = e.target.value;
    setInvitee(value);

    if (value.trim()) {
      const filtered = friends.filter(f =>
        f.fullName?.toLowerCase().includes(value.toLowerCase()) ||
        f.login.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (friend) => {
    if (!invitees.find(i => i.id === friend.id)) {
      setInvitees([...invitees, friend]);
    }
    setInvitee("");
    setSuggestions([]);
  };

  const handleCreateEvent = async () => {
  if (!title.trim()) return alert("Введите название встречи");

  try {
    const res = await axios.post("http://localhost:3000/events", {
      creatorId: userId,
      title,
      description,
      inviteeIds: invitees.map(i => i.id),
    });

    setActiveEvents([res.data, ...activeEvents]);
    setTitle("");
    setDescription("");
    setInvitees([]);
  } catch (err) {
    alert("Ошибка при создании встречи");
  }
};


  const handleMarkAsPast = async (eventId) => {
  try {
    const res = await axios.put(`http://localhost:3000/events/${eventId}/mark-past`);
    const updated = res.data;

    setActiveEvents(prev => prev.filter(ev => ev.id !== eventId));
    setArchivedEvents(prev => [updated, ...prev]);
  } catch (err) {
    console.error("Ошибка при завершении встречи", err);
  }
};


  return (
    <div className="events-page">
      <h2>Создать встречу</h2>

      <div className="form-group">
        <label>Наименование встречи:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Описание:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Приглашённые:</label>
        <div className="invitee-input">
          <input
            type="text"
            value={invitee}
            onChange={handleInviteeChange}
            placeholder="Начните вводить имя или логин"
          />
        </div>

        {suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((f) => (
              <li key={f.id} onClick={() => handleSelectSuggestion(f)}>
                {f.fullName || f.login} (@{f.login})
              </li>
            ))}
          </ul>
        )}

        <div className="invitees-list">
          {invitees.map((f) => (
            <span key={f.id} className="invitee-tag">{f.fullName || f.login}</span>
          ))}
        </div>
      </div>

      <button className="create-btn" onClick={handleCreateEvent}>
        📅 Создать встречу
      </button>

      <hr className="divider" />

      <h2>Активные встречи</h2>
      {activeEvents.length === 0 && <p>Нет активных встреч</p>}
      <ul className="event-list">
        {activeEvents.map(ev => (
          <li key={ev.id} className="event-card">
            <h3>{ev.title}</h3>
            <p>{ev.description}</p>
            <p>👥 {ev.invitees?.map(i => i.user?.login || i.user?.fullName).join(", ")}</p>

            <button onClick={() => handleMarkAsPast(ev.id)}>Завершить</button>
          </li>
        ))}
      </ul>

      <h2>Архив встреч</h2>
      {archivedEvents.length === 0 && <p>Пока пусто</p>}
      <ul className="event-list">
        {archivedEvents.map(ev => (
          <li key={ev.id} className="event-card past">
            <h3>{ev.title}</h3>
            <p>{ev.description}</p>
            <p>👥 {ev.invitees?.map(i => i.user?.login || i.user?.fullName).join(", ")}</p>

            <p className="event-date">
              Создано: {new Date(ev.createdAt).toLocaleDateString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Events;

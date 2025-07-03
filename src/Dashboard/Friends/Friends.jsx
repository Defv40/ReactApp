import React, { useEffect, useState } from "react";
import axios from "axios";
import FriendCard from "../../Components/FriendCard";
import "./Friends.css";

const Friends = () => {
  const userId = parseInt(localStorage.getItem("userId"));
  const [user, setUser] = useState(null);
  const [friends, setFriends] = useState([]);
  const [friendCode, setFriendCode] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [message, setMessage] = useState("");

  // Новые состояния для заявок в друзья
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);

  const [selectedFriend, setSelectedFriend] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewProfile = (friend) => {
  setSelectedFriend(friend);
  setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFriend(null);
  };

  useEffect(() => {
    if (!userId) return;

    axios.get(`http://localhost:3000/users/${userId}`).then((res) => {
      setUser(res.data);
    });

    axios.get(`http://localhost:3000/friends/list/${userId}`).then((res) => {
      setFriends(res.data);
    });

    // Загрузить входящие заявки
    axios
      .get(`http://localhost:3000/friends/requests/incoming/${userId}`)
      .then((res) => setIncomingRequests(res.data));

    // Загрузить отправленные заявки
    axios
      .get(`http://localhost:3000/friends/requests/outgoing/${userId}`)
      .then((res) => setOutgoingRequests(res.data));
  }, [userId]);

  const handleRemove = async (id) => {
    try {
      await axios.post("http://localhost:3000/friends/remove", {
        userId,
        friendId: id,
      });
      setFriends((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      setMessage("Ошибка при удалении");
      console.error("Ошибка при удалении", err);
    }
  };

  const handleSearch = async () => {
    setMessage("");
    setSearchResult(null);
    try {
      const res = await axios.get(`http://localhost:3000/users/by-code/${friendCode}`);
      setSearchResult(res.data);
    } catch (err) {
      setMessage("Пользователь не найден");
    }
  };

  const handleSendRequest = async () => {
    if (!searchResult) return;
    try {
      await axios.post("http://localhost:3000/friends/request", {
        senderId: userId,
        receiverId: searchResult.id,
      });
      setMessage("Заявка отправлена!");
      setSearchResult(null);
      setFriendCode("");

      // Обновить список отправленных заявок
      axios.get(`http://localhost:3000/friends/requests/outgoing/${userId}`)
        .then((res) => setOutgoingRequests(res.data));
    } catch (err) {
      setMessage(err.response?.data?.error || "Ошибка при отправке заявки");
    }
  };

  // Принять входящую заявку
  const handleAcceptRequest = async (requestId) => {
    try {
      await axios.post("http://localhost:3000/friends/accept", { requestId });
      setMessage("Заявка принята!");

      // Обновляем списки
      axios.get(`http://localhost:3000/friends/list/${userId}`).then((res) => setFriends(res.data));
      axios.get(`http://localhost:3000/friends/requests/incoming/${userId}`).then((res) => setIncomingRequests(res.data));
    } catch (err) {
      setMessage("Ошибка при принятии заявки");
    }
  };

  // Отменить исходящую заявку (по желанию)
  const handleCancelRequest = async (requestId) => {
    try {
      await axios.post("http://localhost:3000/friends/request/cancel", { requestId });
      setMessage("Заявка отменена");

      axios.get(`http://localhost:3000/friends/requests/outgoing/${userId}`)
        .then((res) => setOutgoingRequests(res.data));
    } catch (err) {
      setMessage("Ошибка при отмене заявки");
    }
  };

  // const sortedFriends = [...friends].sort((a, b) => Number(b.online) - Number(a.online));

  return (
    <div className="friends-page">
      {user && (
        <div className="friend-code-box">
          <strong>Ваш код дружбы:</strong>{" "}
          <span className="friend-code">{user.friendCode}</span>
        </div>
      )}

      <h2>Друзья</h2>

      <div className="search-box">
        <input
          type="text"
          placeholder="Введите код друга"
          value={friendCode}
          onChange={(e) => setFriendCode(e.target.value)}
        />
        <button onClick={handleSearch}>Поиск</button>
      </div>

      {message && <p className="message">{message}</p>}

      {searchResult && (
        <div className="search-result">
          <p>Найден: {searchResult.fullName || searchResult.login}</p>
          <button onClick={handleSendRequest}>Добавить в друзья</button>
        </div>
      )}

      {/* Входящие заявки */}
      <section>
        <h3>Входящие заявки</h3>
        {incomingRequests.length === 0 && <p className="empty-message">Заявок нет</p>}
        {incomingRequests.map((req) => (
          <div key={req.id} className="friend-request">
            <span>{req.sender.fullName || req.sender.login}</span>
            <button onClick={() => handleAcceptRequest(req.id)}>Принять</button>
          </div>
        ))}
      </section>

      {/* Отправленные заявки */}
      <section>
        <h3>Отправленные заявки</h3>
        {outgoingRequests.filter(req => req.status === 'pending').length === 0 && (
          <p className="empty-message">Заявок нет</p>
        )}
        {outgoingRequests
          .filter(req => req.status === 'pending')
          .map((req) => (
            <div key={req.id} className="friend-request">
              <span>{req.receiver.fullName || req.receiver.login}</span>
              <button onClick={() => handleCancelRequest(req.id)}>Отменить</button>
            </div>
        ))}
      </section>


      <div className="friends-list">
        {friends.map((friend) => (
          <FriendCard
            key={friend.id}
            friend={friend}
            onRemove={handleRemove}
            onViewProfile={handleViewProfile}
          />

        ))}
        {friends.length === 0 && <p className="empty-message">У вас нет друзей.</p>}
      </div>

      {isModalOpen && selectedFriend && (
  <div className="modal-overlay" onClick={closeModal}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <h3>Профиль пользователя</h3>
      <p><strong>Логин:</strong> @{selectedFriend.login}</p>
      {selectedFriend.fullName && <p><strong>ФИО:</strong> {selectedFriend.fullName}</p>}
      {selectedFriend.phone && <p><strong>Телефон:</strong> {selectedFriend.phone}</p>}
      {selectedFriend.messengers?.length > 0 && (
        <p><strong>Мессенджеры:</strong> {selectedFriend.messengers.join(", ")}</p>
      )}
      <button onClick={closeModal}>Закрыть</button>
    </div>
  </div>
)}

    </div>
  );
};

export default Friends;

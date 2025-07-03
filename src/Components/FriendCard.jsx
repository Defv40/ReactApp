const FriendCard = ({ friend, onRemove, onViewProfile }) => {
  return (
    <div className="friend-card">
      <div className="friend-avatar">@{friend.login}</div>

      <div className="friend-info">
        <div className="friend-name">
          {friend.fullName || friend.login}
        </div>
        <button className="view-profile-btn" onClick={() => onViewProfile(friend)}>
          Посмотреть профиль
        </button>
      </div>

      <button className="remove-btn" onClick={() => onRemove(friend.id)}>
        ❌
      </button>
    </div>
  );
};
export default FriendCard
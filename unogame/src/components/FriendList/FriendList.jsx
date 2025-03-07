// FriendList.jsx
import { useState, useRef, useEffect } from 'react';
import './FriendList.css';

const FriendList = () => {
  // State management
  const [isOpen, setIsOpen] = useState(false);
  const [showAddFriend, setShowAddFriend] = useState(false); // Add this line
  const [searchInput, setSearchInput] = useState('');
  const [friends] = useState([
    { id: 1, name: 'John Doe', status: 'Online' },
    { id: 2, name: 'Jane Smith', status: 'In Game', gameId: 'uno-match-123' },
    { id: 3, name: 'Mike Johnson', status: 'Offline' },
    { id: 1, name: 'John Doe', status: 'Online' },
    { id: 2, name: 'Jane Smith', status: 'In Game', gameId: 'uno-match-123' },
    { id: 3, name: 'Mike Johnson', status: 'Offline' },
    { id: 1, name: 'John Doe', status: 'Online' },
    { id: 2, name: 'Jane Smith', status: 'In Game', gameId: 'uno-match-123' },
    { id: 3, name: 'Mike Johnson', status: 'Offline' },
    { id: 1, name: 'John Doe', status: 'Online' },
    { id: 2, name: 'Jane Smith', status: 'In Game', gameId: 'uno-match-123' },
    { id: 3, name: 'Mike Johnson', status: 'Offline' },
  ]);

  // Refs for click-outside detection
  const popupRef = useRef(null);
  const buttonRef = useRef(null);
  const addPopupRef = useRef(null);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && 
          !popupRef.current?.contains(event.target) && 
          !buttonRef.current?.contains(event.target) &&
          !addPopupRef.current?.contains(event.target)) {
        setIsOpen(false);
        setShowAddFriend(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, showAddFriend]); // Add showAddFriend to dependencies

  // Join game handler
  const handleJoinGame = (gameId) => {
    console.log('Joining game:', gameId);
    // Add actual join logic here
  };

  // Add friend handler
  const handleAddFriend = (e) => {
    e.preventDefault();
    console.log('Adding friend:', searchInput);
    setSearchInput('');
    setShowAddFriend(false);
  };

  return (
    <div className="friend-list-container">
      <button 
        ref={buttonRef}
        className="friend-list-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Friend list"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          height="24px" 
          viewBox="0 -960 960 960" 
          width="24px" 
          fill="#5f6368"
        >
          <path d="M40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm720 0v-120q0-44-24.5-84.5T666-434q51 6 96 20.5t84 35.5q36 20 55 44.5t19 53.5v120H760ZM360-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm400-160q0 66-47 113t-113 47q-11 0-28-2.5t-28-5.5q27-32 41.5-71t14.5-81q0-42-14.5-81T544-792q14-5 28-6.5t28-1.5q66 0 113 47t47 113ZM120-240h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0 320Zm0-400Z"/>
        </svg>
      </button>

      {isOpen && (
        <div className="friend-list-popup" ref={popupRef}>
          <div className="friend-list-header">
            <h3>Friend List</h3>
            <div className="header-buttons">
              <button 
                className="add-friend-icon"
                onClick={() => setShowAddFriend(true)}
                aria-label="Add friend"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#5f6368"
                >
                  <path d="M720-400v-120H600v-80h120v-120h80v120h120v80H800v120h-80Zm-360-80q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm80-80h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0-80Zm0 400Z"/>
                </svg>
              </button>
              <button 
                className="close-button"
                onClick={() => setIsOpen(false)}
              >
                ×
              </button>
            </div>
          </div>

          <div className="friends-list">
            {friends.map(friend => (
              <div key={friend.id} className="friend-item">
                <div className="friend-avatar"></div>
                <div className="friend-info">
                  <span className="friend-name">{friend.name}</span>
                  <span className={`friend-status ${friend.status.toLowerCase()}`}>
                    {friend.status}
                  </span>
                </div>
                {friend.status === 'In Game' && (
                  <button
                    className="join-button"
                    onClick={() => handleJoinGame(friend.gameId)}
                  >
                    Join
                  </button>
                )}
              </div>
            ))}
          </div>

          {showAddFriend && (
            <div className="add-friend-popup" ref={addPopupRef} style={{ backgroundColor: '#1789FC' }}>
              <div className="popup-header">
                <h4>Add Friend</h4>
                <button 
                  className="close-button"
                  onClick={() => setShowAddFriend(false)}
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleAddFriend} className="add-friend-form">
                <input
                  type="text"
                  placeholder="Enter player's id"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  autoFocus
                />
                <button type="submit" className="send-request-button">
                  Send Request
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FriendList;
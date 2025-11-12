import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import getCookie from './getCookie';
import './Chat.css'; // Assume this file holds all the styling

const App = () => {
  const [socket, setSocket] = useState(null);
  const [socketId, setSocketId] = useState(null);
  const [chats, setChats] = useState([]); // List of chat rooms/conversations
  const [activeChat, setActiveChat] = useState(null); // The currently open chat object
  const [messages, setMessages] = useState([]); // Messages for the active chat
  const [draft, setDraft] = useState("");
  const messagesEndRef = useRef(null);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showAddChat, setShowAddChat] = useState(false);

  useEffect(() => {
    // Check if user is already onboarded
    const userPhoneNumber = getCookie().phoneNumber;
    if (!userPhoneNumber) {
      setShowOnboarding(true);
      return;
    }

    // Initialize socket connection
    const s = io("http://localhost:8888", {
      transports: ["websocket"],
      query: { phoneNumber: userPhoneNumber }
    });
    setSocket(s);

    s.on("connect", () => setSocketId(s.id));

    s.on("initiate-chats", (data) => {
      setChats(data.chats);
      // Join all chat rooms on load
      data.chats.forEach(chat => s.emit("join-room", chat.roomId));
    });

    s.on("new-message", (data) => {
      // Update messages for the active chat
      if (activeChat && data.roomId === activeChat.roomId) {
        setMessages(prev => [...prev, data.message]);
      }
      // Also update the chat list to show the latest message
      setChats(prev => prev.map(chat =>
        chat.roomId === data.roomId ? { ...chat, lastMessage: data.message.text, timestamp: data.message.timestamp } : chat
      ));
    });

    // Cleanup
    return () => {
      s.disconnect();
    };
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Handler for sending a message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (socket && draft.trim() && activeChat) {
      const messageData = {
        roomId: activeChat.roomId,
        senderId: socketId,
        text: draft,
        timestamp: Date.now(),
        type: 'text',
      };
      socket.emit("send-message", messageData);
      setMessages(prev => [...prev, messageData]);
      setDraft("");
    }
  };

  // Handler for joining a chat
  const handleChatSelect = (chat) => {
    setActiveChat(chat);
    // Fetch message history from the backend for the selected chat
    // This is a new event to add to your backend
    socket.emit("fetch-messages", { roomId: chat.roomId }, (history) => {
      setMessages(history);
    });
  };

  // Onboarding submission
  const handleOnboardingSubmit = (e) => {
    e.preventDefault();
    // Logic to verify phone number with backend
    // On success:
    // setCookie({ phoneNumber: phoneNumber });
    // setShowOnboarding(false);
    // window.location.reload(); // Reloads to trigger the main app logic
  };

  // Main render function
  return (
    <div className="app-container">
      {showOnboarding ? (
        <div className="onboarding-modal">
          <form onSubmit={handleOnboardingSubmit}>
            <h2>Welcome to ChatApp 💻</h2>
            <p>Please enter your phone number to get started.</p>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Your phone number"
            />
            <button type="submit">Continue</button>
          </form>
        </div>
      ) : (
        <>
          <div className={`sidebar ${activeChat && isMobile ? 'hidden' : ''}`}>
            <header className="sidebar-header">
              <h1>Chats</h1>
              <button onClick={() => setShowAddChat(true)}>+</button>
            </header>
            <div className="chat-list">
              {chats.map(chat => (
                <div key={chat.roomId} className="chat-list-item" onClick={() => handleChatSelect(chat)}>
                  <div className="chat-avatar"></div>
                  <div className="chat-info">
                    <h3>{chat.name}</h3>
                    <p>{chat.lastMessage}</p>
                  </div>
                  <span className="chat-timestamp">{chat.timestamp}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={`chat-window ${activeChat ? 'active' : ''}`}>
            {activeChat ? (
              <>
                <header className="chat-header">
                  {isMobile && <button onClick={() => setActiveChat(null)}>&#8592;</button>}
                  <h2>{activeChat.name}</h2>
                  <div className="call-buttons">
                    <button>📞</button>
                    <button>📹</button>
                  </div>
                </header>
                <div className="message-area">
                  {messages.map((msg, index) => (
                    <div key={index} className={`message-bubble ${msg.senderId === socketId ? 'sent' : 'received'}`}>
                      {msg.text}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                <form className="message-input-form" onSubmit={handleSendMessage}>
                  <button type="button">📎</button>
                  <input
                    type="text"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Type a message..."
                  />
                  <button type="button">🎤</button>
                  <button type="submit">✈️</button>
                </form>
              </>
            ) : (
              <div className="no-chat-selected">
                <p>Select a chat to start a conversation</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default App;
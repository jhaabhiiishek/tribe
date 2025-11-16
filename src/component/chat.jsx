import React, { useState, useEffect, useRef } from "react";
import Peer from 'simple-peer';
import { io } from "socket.io-client";
import getCookie from './getCookie';
import './Chat.css'; // Assume this file holds all the styling
// import { set } from "mongoose";
import api from './api';
// Helper for formatting time (e.g., "10:30 AM")
const formatTimestamp = (timestamp) => {
  if (!timestamp) return "";
  return new Date(timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
};

const App = () => {
  const [socket, setSocket] = useState(null);
  const [socketId, setSocketId] = useState(null);
  const [chats, setChats] = useState([]); // List of chat rooms/conversations
  const chatsRef = useRef(chats);
  const [activeChat, setActiveChat] = useState(null); // The currently open chat object
  const [messages, setMessages] = useState([]); // Messages for the active chat
  const [activeMessages, setActiveMessages] = useState([]); // Messages for the active chat
  const [draft, setDraft] = useState("");
  const [online, setOnline] = useState([]);
  // --- ADDing NEW STATE FOR WEBRTC ---
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [receivingCall, setReceivingCall] = useState(false);
  const [callerSignal, setCallerSignal] = useState(null);
  const [isCalling, setIsCalling] = useState(false);
  const [callAccepted, setCallAccepted] = useState(false);
  const messagesEndRef = useRef(null);
  const peerRef = useRef(); // Ref to store the peer connection
  const localVideoRef = useRef(); // Ref for your <video> element
  const remoteVideoRef = useRef(); // Ref for the other user's <video> element

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showAddChat, setShowAddChat] = useState(false);
  const [newChatUserId, setNewChatUserId] = useState("");

  // --- New states for UI ---
  const [theme, setTheme] = useState('dark'); // 'light' or 'dark'

  // --- Effect for Responsive Mobile Check ---
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- Original Socket.io Effects (Unchanged) ---
  useEffect(() => {
    const chat_user_id = getCookie().user_id;
    if (!chat_user_id) {
      setShowOnboarding(true);
      return;
    }

    const s = io("https://tribe-chat-server.onrender.com/", {
      transports: ["websocket"],
      query: { user_id: chat_user_id }
    });
    setSocket(s);

    s.on("connect", () => {
      setSocketId(s.id)
    });

    s.emit("initiate", { user_id: chat_user_id });

    s.on("receive_messages", (data) => {
      setMessages(prev => [...prev, data]);
      setChats(prev => prev.map(chat =>
        chat.roomId === data.room_id ? { ...chat, lastMessage: data.messageContent, timestamp: data.sentAt } : chat
      ).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0)) // Sort by most recent
      );
    });

    s.on("load_chats_while_away", (loadedMessages) => {
        console.log("Loaded chats while away:", loadedMessages);
        setMessages(loadedMessages);
    });
    
    // Handle new chat creation response from server
    s.on("reload", (newChat) => {

        console.log("New chat created:", newChat);
        
        setChats(newChat);
        newChat.forEach(async(chat) =>{
          s.emit("join-room", chat.room_id);
          for(let participant of chat.participants){
            if(!online.includes(participant) && participant!==getCookie().user_id){
              console.log("emitting find for ",participant)
              await api.post('/search_user_id',{
                user_id:chat_user_id,
                key:participant
              },{
                withCredentials: true
              }).then(response => {
                if(response.data.data[0].last_seen==="online" && !online.includes(response.data.data[0].user_id)){
                  online.push(response.data.data[0].user_id);
                }
              })
            }
          }
        });
        // s.emit("join-room", newChat.roomId);
        //setActiveChat(newChat); // Automatically open the new chat
        
        setShowAddChat(false);
        setNewChatUserId("");
    });

    s.on("call-incoming", (data) => {
        // Check if the call is for the currently active chat
        // This logic assumes you only show one call at a time
        if (activeChat && activeChat.participants.includes(data.from)) {
            setReceivingCall(true);
            setCallerSignal(data.signal); // Save the "offer" signal
        }
        // If no chat is active, you could show a global notification
        console.log("Incoming call from:", data.from);
    });

    s.on("call-accepted", (data) => {
        if (peerRef.current) {
            setCallAccepted(true);
            setIsCalling(false);
            // Complete the connection by signaling with the "answer"
            peerRef.current.signal(data.signal);
        }
    });
    
    s.on("call-ended", (data) => {
        console.log("Call ended by:", data.from);
        hangUp(); // Clean up the call state
    });

    s.on('leftroom',(leftBy)=>{
      setOnline(online.filter(id=>id!==leftBy.user_id));
    })
    s.on('roomJoined',(joinBy)=>{
      setOnline(prevOnline => [...prevOnline, joinBy.user_id]);
    })

    return () => {
      s.disconnect();
    };
  }, []); // Added activeChat dependency

  // --- Original Scroll Effect (Unchanged) ---
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
    setActiveMessages(messages.filter(msg => activeChat && msg.room_id === activeChat.room_id));
  }, [messages, activeChat]);

  useEffect(() => {
    chatsRef.current = chats;
  }, [chats]);


  // --- Original Handlers (Unchanged) ---
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (socket && draft.trim() && activeChat) {
      const messageData = {
        sentBy:getCookie().user_id,
				room_id:activeChat.room_id,
				sentAt:new Date(),
				messageContent:draft,
				referencedTo:null,
      };
      socket.emit("message", messageData);
      setMessages(prev => [...prev, messageData]);
      setActiveMessages(prev => [...prev, messageData]);
      setDraft("");
    }
  };

  const handleChatSelect = (chat) => {
    console.log("Selected chat:", chat);
    setActiveChat(chat);

    console.log("Messages currently:", messages);
    setActiveMessages(messages.filter(msg => msg.room_id === chat.room_id));
    // write a function to filter the current message list for messages that belong to the selected chat room

  };

  const handleOnboardingSubmit = (e) => {
    e.preventDefault();
    // Logic to verify phone number...
    // On success:
    // setCookie({ user_id: phoneNumber, phoneNumber: phoneNumber });
    // setShowOnboarding(false);
    // window.location.reload(); 
    console.log("Onboarding submitted with:", phoneNumber);
    // This is a stub. You'd replace this with your actual API call.
    // For demo, let's just close the modal and set a cookie.
    document.cookie = `user_id=${phoneNumber}; path=/`;
    setShowOnboarding(false);
    window.location.reload();
  };

  // --- New Handlers for UI ---
  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleCreateChat = () => {
    if (socket && newChatUserId.trim()) {
        // Emit event to server to create/find chat
        socket.emit("create-chat", { user_id: getCookie().user_id, phoneNumber: newChatUserId });
    }
  };

  // ... (after your existing handleOnboardingSubmit, etc.)

  const getMedia = async () => {
    let stream = null;
    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);
        if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
        }
    } catch (err) {
        console.error("Failed to get media", err);
    }
    return stream; // Return the stream for the peer connection
  };

  const startCall = async () => {
    if (!activeChat) return;
    setIsCalling(true);
    
    const stream = await getMedia();
    if (!stream) {
        setIsCalling(false);
        return;
    }

    const peer = new Peer({
        initiator: true,
        trickle: false, // Bundles all ICE candidates into one signal
        stream: stream,
    });

    peer.on('signal', (signal) => {
        // Send the "offer" signal to the other user
        socket.emit("call-user", {
            room_id: activeChat.room_id,
            signal: signal,
            user_id:getCookie().user_id
        });
    });

    peer.on('stream', (remoteStream) => {
        // Got the remote stream!
        setRemoteStream(remoteStream);
        if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
        }
    });

    peer.on('close', hangUp);
    peer.on('error', (err) => {
        console.error("Peer error:", err);
        hangUp();
    });

    peerRef.current = peer;
  };

  const answerCall = async () => {
    setReceivingCall(false);
    setIsCalling(true);
    setCallAccepted(true);
    
    const stream = await getMedia();
    if (!stream) {
        setIsCalling(false);
        return;
    }

    const peer = new Peer({
        initiator: false,
        trickle: false,
        stream: stream,
    });

    peer.on('signal', (signal) => {
        // Send the "answer" signal back to the caller
        socket.emit("call-answered", {
            room_id: activeChat.room_id,
            signal: signal,
            user_id:getCookie().user_id
        });
    });

    peer.on('stream', (remoteStream) => {
        // Got the remote stream!
        setRemoteStream(remoteStream);
        if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
        }
    });

    peer.on('close', hangUp);
    peer.on('error', (err) => console.error("Peer error:", err));

    // This is the crucial step: signal with the "offer" we received
    peer.signal(callerSignal);

    peerRef.current = peer;
  };

  const hangUp = () => {
    if (peerRef.current) {
        peerRef.current.destroy(); // Close the peer connection
    }
    
    // Stop local camera/mic tracks
    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
    }

    // Inform the other user
    if (socket && activeChat) {
         socket.emit("hang-up", { room_id: activeChat.room_id });
    }
    
    // Reset all call-related state
    setLocalStream(null);
    setRemoteStream(null);
    setIsCalling(false);
    setReceivingCall(false);
    setCallAccepted(false);
    setCallerSignal(null);
    peerRef.current = null;
  };

  const getChatName = (chat) => {
    // Assuming 'chat.participants' is an array of user objects
    // And you want to show the name of the *other* user
    const chat_user_id = getCookie().user_id;
    const otherUser = chat.participants?chat.participants.find(p => p!== chat_user_id):"Unknown Chat";
    return otherUser;
  };
  
  const getChatAvatar = (chat) => {
    // const chat_user_id = getCookie().user_id;
    const otherUser = "https://i.pravatar.cc/100";
    return otherUser; // Default avatar
  };


  const AddUserFriend = (e)=>{
    e.preventDefault();
    handleCreateChat();
    setNewChatUserId("");
    setShowAddChat(false);
    // chats.push()
  }

  // --- Render Functions for Modals ---

  const renderOnboarding = () => (
    <div className="modal-overlay">
      <form className="modal-content glass-effect" onSubmit={handleOnboardingSubmit}>
        <h2>Welcome</h2>
        <p>Please enter your phone number to begin.</p>
        <input
          type="tel"
          className="modal-input"
          placeholder="e.g., +1234567890"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
        <button type="submit" className="modal-button">Start Chatting</button>
      </form>
    </div>
  );

  const renderAddChat = () => (
    <div className="modal-overlay">
      <form className="modal-content glass-effect">
        <h2>Start New Chat</h2>
        <p>Enter the user id of the person you want to chat with.</p>
        <input
          type="text"
          className="modal-input"
          placeholder="e.g., user123"
          value={newChatUserId}
          onChange={(e) => setNewChatUserId(e.target.value)}
          required
        />
        <div className="modal-actions">
            <button type="button" className="modal-button secondary" onClick={() => setShowAddChat(false)}>Cancel</button>
            <button type="submit" onClick={(e) => AddUserFriend(e)} className="modal-button">Create</button>
        </div>
      </form>
    </div>
  );

  // --- Main Render Function ---
  return (
    <div className={`chat-app-container ${theme}-theme`}>
      {showOnboarding && renderOnboarding()}
      {showAddChat && renderAddChat()}

      <div className={`chat-layout ${activeChat ? 'show-chat-window' : 'show-sidebar'}`}>
        
        {/* --- Sidebar (Chat List) --- */}
        <aside className="chat-sidebar">
          <header className="sidebar-header glass-effect">
            <div className="avatar">
              {/* User's avatar */}
              <img src="https://i.pravatar.cc/150?u=me" alt="My Profile" />
            </div>
            <div className="sidebar-actions">
              <button className="icon-button" onClick={() => setShowAddChat(true)} title="New Chat">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z"></path></svg>
              </button>
              <button className="icon-button" onClick={toggleTheme} title="Toggle Theme">
                {theme === 'dark' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-3.31 0-6-2.69-6-6 0-1.82.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"></path></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM12 9c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zM3.31 11H1v2h2.31c.15-1.16.59-2.23 1.18-3.19L3 8.32 4.41 6.91l1.49 1.49C6.54 7.6 7.7 6.79 9 6.3V4H7v-2h10v2h-2v2.3c1.3.49 2.46 1.3 3.19 2.19l1.49-1.49L21 8.32l-1.49 1.49c.59.96 1.03 2.03 1.18 3.19H23v-2h-2.31c-.15 1.16-.59 2.23-1.18 3.19l1.49 1.49L19.59 21l-1.49-1.49c-.96.59-2.03 1.03-3.19 1.18V23h2v2H7v-2h2v-2.3c-1.3-.49-2.46-1.3-3.19-2.19l-1.49 1.49L0 15.68l1.49-1.49c-.59-.96-1.03-2.03-1.18-3.19z"></path></svg>
                )}
              </button>
            </div>
          </header>
          
          <div className="chat-list">
            {chats&&chats.map(chat => (
              <div 
                className={`chat-list-item ${activeChat?.roomId === chat.roomId ? 'active' : ''}`} 
                key={chat.room_id}
                onClick={() => handleChatSelect(chat)}
              >
                <div className="avatar">
                  <img src={getChatAvatar(chat)} alt="Chat Avatar" />
                </div>
                <div className="chat-list-item-details">
                  <span className="chat-name">{getChatName(chat)}</span>
                  <span className="chat-last-message">{chat.last5Messages&&chat.last5Messages[0]}</span>
                </div>
                <span className="chat-timestamp">{formatTimestamp(chat.timestamp)}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* --- Main Chat Window --- */}
        <main className="chat-window">
          {!activeChat ? (
            <div className="no-chat-selected">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="100"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"></path></svg>
              <h2>Select a chat to start messaging</h2>
              <p>Or create a new chat from the sidebar.</p>
            </div>
          ) : (
            <>
              <header className="chat-header glass-effect">
                {isMobile && (
                  <button className="icon-button back-button" onClick={() => {setActiveChat(null)}}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path></svg>
                  </button>
                )}
                <div className="avatar">
                  <img src={getChatAvatar(activeChat)} alt="Chat Avatar" />
                </div>
                <div className="chat-header-details">
                  <span className="chat-name">{getChatName(activeChat)}</span>
                  <span className="chat-status">{online.includes(getChatName(activeChat)) ? "Online" : "Offline"}</span>
                </div>
                {/* <div className="chat-header-actions">
                    {!isCalling && !receivingCall && !callAccepted && (
                        <button className="icon-button" onClick={startCall} title="Start Call">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.24.2 2.45.57 3.57.11.35.03.74-.24 1.02l-2.2 2.2z"></path></svg>
                        </button>
                    )}
                    {(isCalling || callAccepted) && (
                        <button className="icon-button hang-up-button" onClick={hangUp} title="Hang Up">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.1-2.66 1.82-.73.66-1.36 1.4-1.85 2.2L.7 19.37c-.23.38-.03.88.42 1.06.31.13.66.1.9.04 2.18-.54 4.43-1.36 6.7-2.45.39-.19.83-.17 1.21.05C10.6 18.58 11.29 19 12 19c6.08 0 11.02-4.94 11-11 0-1.42-.27-2.77-.78-4.01l-1.42 1.42C20.9 6.49 21 7.47 21 8.5c0 4.97-4.03 9-9 9-1.03 0-2.01-.17-2.9-.48l1.6-1.6c.59.09 1.19.15 1.8.15 3.86 0 7-3.14 7-7s-3.14-7-7-7c-.61 0-1.21.08-1.79.22l1.6 1.6c.15-.31.2-.65.2-1.01V3.19C8.85 2.25 10.4 2 12 2c6.08 0 11.02 4.94 11 11 0 3.3-1.48 6.25-3.8 8.19l-1.42-1.42C19.2 16.51 20 14.6 20 12.5c0-4.41-3.59-8-8-8-2.1 0-4.01.82-5.48 2.16l1.42 1.42C9.07 7.21 10.46 6.5 12 6.5c1.18 0 2.29.29 3.26.8l-1.42 1.42C13.26 8.29 12.65 8 12 8c-.55 0-1.08.07-1.59.18L8.3 6.07C9.75 5.25 11.3 5 13 5c.07 0 .14 0 .2 0L12 3.8V3c0-.55-.45-1-1-1z"></path></svg>
                        </button>
                    )}
                </div> */}
              </header>

              <div className="video-container">
                  {localStream && (
                      <video 
                          playsInline 
                          muted 
                          ref={localVideoRef} 
                          autoPlay 
                          className="local-video" 
                      />
                  )}
                  {remoteStream && (
                      <video 
                          playsInline 
                          ref={remoteVideoRef} 
                          autoPlay 
                          className="remote-video" 
                      />
                  )}
                  {receivingCall && !callAccepted && (
                      <div className="incoming-call-toast">
                          <h4>{getChatName(activeChat)} is calling...</h4>
                          <button className="modal-button" onClick={answerCall}>Answer</button>
                          <button className="modal-button secondary" onClick={hangUp}>Decline</button>
                      </div>
                  )}
              </div>

              <div className="message-list">
                {activeMessages.map((msg, index) => (
                  <div 
                    key={index} 
                    className={`message-item ${msg.sentBy === getCookie().user_id ? 'sent' : 'received'}`}
                  >
                    <div className="message-bubble">
                      <p>{msg.messageContent}</p>
                      <span className="message-timestamp">{formatTimestamp(msg.sentAt)}</span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <form className="message-form glass-effect" onSubmit={handleSendMessage}>
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                />
                <button type="submit" className="icon-button send-button">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path></svg>
                </button>
              </form>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
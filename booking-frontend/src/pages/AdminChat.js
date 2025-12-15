// src/pages/AdminChat.js
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';
import API_URL from "../config";

import './AdminChat.css';

export default function AdminChat() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [chatList, setChatList] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }

    const userData = JSON.parse(storedUser);
    if (userData.role !== 'admin') {
      alert('Akses ditolak! Hanya admin yang bisa mengakses halaman ini.');
      navigate('/');
      return;
    }

    setUser(userData);
  }, [navigate]);

  useEffect(() => {
    if (!user) return;

    // Initialize socket connection
    socketRef.current = io(API_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true
    });

    const socket = socketRef.current;

    // Load chat list
    const loadChats = async () => {
      try {
        const res = await axios.get(`${API_URL}/admin/chats`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setChatList(res.data);
      } catch (err) {
        console.error('Error loading chats:', err);
      }
    };

    loadChats();

    // Socket connection
    socket.on('connect', () => {
      console.log('Admin socket connected:', socket.id);
      setIsConnected(true);
      socket.emit('admin_join');
    });

    socket.on('disconnect', () => {
      console.log('Admin socket disconnected');
      setIsConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('Admin connection error:', error);
      setIsConnected(false);
    });

    // Listen for new messages from users
    socket.on('new_user_message', (data) => {
      loadChats(); // Reload chat list
      
      // If currently viewing this chat, update messages
      if (selectedChat && selectedChat.booking_id === data.booking_id) {
        setMessages(prev => [...prev, data.message]);
      }
    });

    // Refresh chat list every 30 seconds
    const interval = setInterval(loadChats, 30000);

    return () => {
      if (socket) {
        socket.off('connect');
        socket.off('disconnect');
        socket.off('connect_error');
        socket.off('new_user_message');
        socket.disconnect();
      }
      clearInterval(interval);
    };
  }, [user, selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async (booking_id) => {
    if (!socketRef.current) return;
    
    try {
      const res = await axios.get(`${API_URL}/messages/${booking_id}`);
      setMessages(res.data);
      
      const socket = socketRef.current;
      
      // Join room for this booking
      socket.emit('join_chat', booking_id);
      
      // Mark messages as read
      socket.emit('mark_read', { booking_id, user_id: user.id });
      
      // Listen for new messages in this room
      socket.off('receive_message'); // Remove previous listener
      socket.on('receive_message', (message) => {
        if (message.booking_id === booking_id) {
          setMessages(prev => [...prev, message]);
        }
      });
    } catch (err) {
      console.error('Error loading messages:', err);
    }
  };

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    loadMessages(chat.booking_id);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat || !socketRef.current) return;

    const messageData = {
      booking_id: selectedChat.booking_id,
      sender_id: user.id,
      sender_role: 'admin',
      message: newMessage.trim()
    };

    socketRef.current.emit('send_message', messageData);
    setNewMessage('');
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hari ini';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Kemarin';
    } else {
      return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    }
  };

  const groupedMessages = messages.reduce((groups, message) => {
    const date = new Date(message.created_at).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  if (!user) return null;

  return (
    <div className="admin-chat-page">
      <div className="admin-chat-container">
        {/* Sidebar - Chat List */}
        <div className="admin-chat-sidebar">
          <div className="admin-chat-header">
            <div>
              <h2>💬 Admin Chat</h2>
              <p className="header-subtitle">Kelola semua percakapan</p>
            </div>
            <button onClick={() => navigate('/')} className="back-btn-chat">
              ← Kembali
            </button>
          </div>

          <div className="chat-list">
            {chatList.length === 0 ? (
              <div className="no-chats">
                <p>📭</p>
                <span>Belum ada chat</span>
              </div>
            ) : (
              chatList.map((chat) => (
                <div
                  key={chat.booking_id}
                  className={`chat-list-item ${selectedChat?.booking_id === chat.booking_id ? 'active' : ''}`}
                  onClick={() => handleSelectChat(chat)}
                >
                  <div className="chat-item-avatar">
                    {chat.user_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="chat-item-info">
                    <div className="chat-item-header">
                      <h4>{chat.user_name}</h4>
                      {chat.unread_count > 0 && (
                        <span className="unread-badge">{chat.unread_count}</span>
                      )}
                    </div>
                    <p className="chat-item-field">{chat.field_name}</p>
                    <p className="chat-item-message">
                      {chat.latest_sender === 'admin' && '✓ '}
                      {chat.latest_message.substring(0, 40)}
                      {chat.latest_message.length > 40 && '...'}
                    </p>
                  </div>
                  <div className="chat-item-meta">
                    <span className="chat-item-time">{formatTime(chat.latest_message_time)}</span>
                    <span className={`status-badge ${chat.status}`}>{chat.status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="admin-chat-main">
          {selectedChat ? (
            <>
              <div className="chat-main-header">
                <div className="chat-user-info">
                  <div className="chat-user-avatar">
                    {selectedChat.user_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3>{selectedChat.user_name}</h3>
                    <p className="chat-user-details">
                      {selectedChat.field_name} • {new Date(selectedChat.booking_date).toLocaleDateString('id-ID')} • {selectedChat.booking_time}
                    </p>
                  </div>
                </div>
                <span className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
                  {isConnected ? '🟢 Online' : '🔴 Offline'}
                </span>
              </div>

              <div className="chat-main-messages">
                {Object.keys(groupedMessages).length === 0 ? (
                  <div className="no-messages-main">
                    <p>💬</p>
                    <span>Belum ada pesan dengan user ini</span>
                  </div>
                ) : (
                  Object.entries(groupedMessages).map(([date, msgs]) => (
                    <div key={date}>
                      <div className="message-date-separator">
                        {formatDate(msgs[0].created_at)}
                      </div>
                      {msgs.map((msg) => (
                        <div
                          key={msg.id}
                          className={`chat-message ${msg.sender_role === 'admin' ? 'sent' : 'received'}`}
                        >
                          <div className="chat-message-bubble">
                            {msg.sender_role !== 'admin' && (
                              <span className="message-sender-name">{msg.sender_name}</span>
                            )}
                            <p className="message-content">{msg.message}</p>
                            <span className="message-timestamp">{formatTime(msg.created_at)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              <form className="chat-main-input" onSubmit={handleSendMessage}>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Ketik pesan ke user..."
                  className="chat-input-field"
                  disabled={!isConnected}
                />
                <button
                  type="submit"
                  className="chat-send-button"
                  disabled={!isConnected || !newMessage.trim()}
                >
                  <span>➤</span>
                </button>
              </form>
            </>
          ) : (
            <div className="no-chat-selected">
              <div className="no-chat-icon">💬</div>
              <h3>Pilih Chat</h3>
              <p>Pilih chat dari daftar untuk mulai berkomunikasi dengan user</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

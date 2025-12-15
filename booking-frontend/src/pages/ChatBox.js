// src/pages/ChatBox.js
import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import API_URL from "../config";


import './ChatBox.css';

export default function ChatBox({ booking, user, onClose }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io(API_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true
    });

    const socket = socketRef.current;

    // Load existing messages
    const loadMessages = async () => {
      try {
        const res = await axios.get(`${API_URL}/messages/${booking.id}`);
        setMessages(res.data);
      } catch (err) {
        console.error('Error loading messages:', err);
      }
    };

    loadMessages();

    // Socket connection
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      setIsConnected(true);
      socket.emit('join_chat', booking.id);
      // Mark messages as read when opening chat
      socket.emit('mark_read', { booking_id: booking.id, user_id: user.id });
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setIsConnected(false);
    });

    // Listen for new messages
    socket.on('receive_message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    return () => {
      if (socket) {
        socket.off('connect');
        socket.off('disconnect');
        socket.off('connect_error');
        socket.off('receive_message');
        socket.disconnect();
      }
    };
  }, [booking.id, user.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socketRef.current) return;

    const messageData = {
      booking_id: booking.id,
      sender_id: user.id,
      sender_role: user.role,
      message: newMessage.trim()
    };

    socketRef.current.emit('send_message', messageData);
    setNewMessage('');
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hari ini';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Kemarin';
    } else {
      return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    }
  };

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = new Date(message.created_at).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  return (
    <div className="chatbox-overlay" onClick={onClose}>
      <div className="chatbox-container" onClick={(e) => e.stopPropagation()}>
        <div className="chatbox-header">
          <div className="chat-header-info">
            <h3>Chat Booking</h3>
            <p className="chat-booking-info">
              {booking.field_name} • {new Date(booking.date).toLocaleDateString('id-ID')} • {booking.start_time}
            </p>
          </div>
          <div className="chat-header-actions">
            <span className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
              {isConnected ? '🟢 Online' : '🔴 Offline'}
            </span>
            <button onClick={onClose} className="chat-close-btn">✕</button>
          </div>
        </div>

        <div className="chatbox-messages">
          {Object.keys(groupedMessages).length === 0 ? (
            <div className="no-messages">
              <p>💬 Belum ada pesan</p>
              <span>Mulai chat dengan admin untuk bertanya tentang booking Anda</span>
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
                    className={`message ${msg.sender_role === user.role ? 'sent' : 'received'}`}
                  >
                    <div className="message-bubble">
                      {msg.sender_role !== user.role && (
                        <span className="message-sender">{msg.sender_name || 'Admin'}</span>
                      )}
                      <p className="message-text">{msg.message}</p>
                      <span className="message-time">{formatTime(msg.created_at)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="chatbox-input-form" onSubmit={handleSendMessage}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Ketik pesan..."
            className="chat-input"
            disabled={!isConnected}
          />
          <button 
            type="submit" 
            className="chat-send-btn"
            disabled={!isConnected || !newMessage.trim()}
          >
            <span>➤</span>
          </button>
        </form>
      </div>
    </div>
  );
}

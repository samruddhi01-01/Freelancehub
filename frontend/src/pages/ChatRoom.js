import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const ChatRoom = () => {
  const { chatId } = useParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const bottomRef = useRef(null);

  const loadMessages = async () => {
    const res = await api.get(`/chats/${chatId}/messages`, { params: { limit: 100 } });
    setMessages(res.data.messages);
  };

  useEffect(() => {
    loadMessages();
    // Simple polling every 4s to simulate real-time updates
    const interval = setInterval(loadMessages, 4000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      await api.post(`/chats/${chatId}/messages`, { text });
      setText('');
      loadMessages();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container narrow">
      <h2>Conversation</h2>
      <div className="chat-window">
        {messages.map((m, i) => {
          const mine = m.sender?._id === user.id || m.sender === user.id;
          return (
            <div key={m._id || i} className={`chat-bubble ${mine ? 'mine' : ''}`}>
              {!mine && <span className="chat-sender">{m.sender?.name}</span>}
              <p>{m.text}</p>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
      <form className="chat-input-bar" onSubmit={handleSend}>
        <input
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatRoom;

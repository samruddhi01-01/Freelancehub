import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Send } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { EmptyState } from '../components/ui/Misc';

const Messages = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const bottomRef = useRef(null);

  const activeChat = chats.find((c) => c._id === chatId);

  const loadChats = async () => {
    const res = await api.get('/chats/mine');
    setChats(res.data.chats);
    if (!chatId && res.data.chats.length > 0) {
      navigate(`/chats/${res.data.chats[0]._id}`, { replace: true });
    }
  };

  const loadMessages = async () => {
    if (!chatId) return;
    const res = await api.get(`/chats/${chatId}/messages`, { params: { limit: 100 } });
    setMessages(res.data.messages);
  };

  useEffect(() => {
    loadChats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 4000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !chatId) return;
    try {
      await api.post(`/chats/${chatId}/messages`, { text });
      setText('');
      loadMessages();
    } catch (err) {
      console.error(err);
    }
  };

  const otherParticipant = (chat) => chat.participants.find((p) => p._id !== user.id);

  return (
    <div className="messages-layout">
      <div className="messages-col messages-list-col">
        <div className="messages-col-header">Messages</div>
        {chats.length === 0 ? (
          <EmptyState title="No conversations yet" subtitle="Start one from a project page" />
        ) : (
          chats.map((c) => {
            const other = otherParticipant(c);
            const last = c.messages?.[c.messages.length - 1];
            return (
              <Link
                key={c._id}
                to={`/chats/${c._id}`}
                className={`messages-chat-item ${c._id === chatId ? 'active' : ''}`}
              >
                <div className="messages-avatar">{other?.name?.[0]?.toUpperCase() || '?'}</div>
                <div className="messages-preview">
                  <strong>{other?.name || 'Unknown'}</strong>
                  <p className="muted">{last?.text?.slice(0, 40) || c.project?.title}</p>
                </div>
              </Link>
            );
          })
        )}
      </div>

      <div className="messages-col messages-chat-col">
        {!activeChat ? (
          <EmptyState title="Select a conversation" />
        ) : (
          <>
            <div className="messages-col-header">{otherParticipant(activeChat)?.name}</div>
            <div className="chat-window flex-grow">
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
              <input placeholder="Type a message..." value={text} onChange={(e) => setText(e.target.value)} />
              <button type="submit"><Send size={16} /></button>
            </form>
          </>
        )}
      </div>

      <div className="messages-col messages-info-col">
        <div className="messages-col-header">Project Info</div>
        {activeChat ? (
          <div className="surface-card" style={{ padding: 16 }}>
            <h4>{activeChat.project?.title}</h4>
            <Link to={`/projects/${activeChat.project?._id}`} className="muted">View project details →</Link>
          </div>
        ) : (
          <p className="muted" style={{ padding: 16 }}>No project selected</p>
        )}
      </div>
    </div>
  );
};

export default Messages;

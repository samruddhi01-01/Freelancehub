import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const ChatInbox = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    api
      .get('/chats/mine')
      .then((res) => setChats(res.data.chats))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container">
      <h2>Messages</h2>
      {loading ? (
        <p>Loading...</p>
      ) : chats.length === 0 ? (
        <p className="muted">No conversations yet. Start one from a project page.</p>
      ) : (
        <div className="chat-list">
          {chats.map((c) => {
            const other = c.participants.find((p) => p._id !== user.id);
            const lastMsg = c.messages?.[c.messages.length - 1];
            return (
              <Link to={`/chats/${c._id}`} key={c._id} className="chat-list-item">
                <strong>{other?.name || 'Unknown'}</strong>
                <span className="muted"> — {c.project?.title}</span>
                {lastMsg && <p className="muted">{lastMsg.text?.slice(0, 60)}</p>}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ChatInbox;

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import Button from '../components/ui/Button';
import { SkillBadge } from '../components/ui/Misc';

const initials = (name = '') => name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();

const FreelancerProfile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [freelancer, setFreelancer] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    api.get(`/users/${id}`).then((res) => setFreelancer(res.data.user));
    api.get(`/reviews/user/${id}`).then((res) => setReviews(res.data.reviews));
  }, [id]);

  const handleMessage = () => {
    if (!user) return navigate('/login');
    // Chats are tied to a project in this platform — send them to their inbox
    toast.info('Start a conversation from one of your shared project pages, or check your existing chats.');
    navigate('/chats');
  };

  const handleHire = () => {
    if (!user) return navigate('/login');
    if (user.role !== 'client') return toast.info('Only clients can hire freelancers directly.');
    navigate('/projects/new');
  };

  if (!freelancer) return <div className="page">Loading...</div>;

  return (
    <div className="page">
      <div className="profile-header surface-card">
        <div className="profile-avatar-lg">{initials(freelancer.name)}</div>
        <div style={{ flex: 1 }}>
          <h2>{freelancer.name}</h2>
          <p className="muted">Freelancer {freelancer.hourlyRate > 0 && `· $${freelancer.hourlyRate}/hr`}</p>
          {freelancer.ratingAvg > 0 && (
            <p><Star size={14} fill="#f5a623" color="#f5a623" style={{ verticalAlign: 'middle' }} /> {freelancer.ratingAvg.toFixed(1)} ({freelancer.ratingCount} reviews)</p>
          )}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Button onClick={handleHire}>Hire Me</Button>
          <Button variant="secondary" onClick={handleMessage}>Message</Button>
        </div>
      </div>

      <div className="surface-card" style={{ padding: 20, marginTop: 20 }}>
        <h4>About</h4>
        <p className="muted">{freelancer.bio || 'No bio yet.'}</p>
        <h4 style={{ marginTop: 16 }}>Skills</h4>
        <div className="tags">
          {(freelancer.skills || []).map((s) => <SkillBadge key={s}>{s}</SkillBadge>)}
        </div>
      </div>

      <div className="surface-card" style={{ padding: 20, marginTop: 20 }}>
        <h4>Reviews</h4>
        {reviews.length === 0 ? (
          <p className="muted">No reviews yet.</p>
        ) : (
          reviews.map((r) => (
            <div key={r._id} className="proposal-card">
              <p><strong>{r.reviewer.name}</strong> — {'⭐'.repeat(r.rating)}</p>
              <p className="muted">{r.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FreelancerProfile;

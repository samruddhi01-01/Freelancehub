import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { Star } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { SkillBadge } from '../components/ui/Misc';

const initials = (name = '') => name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();

const Profile = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: '', bio: '', skills: '', hourlyRate: 0 });
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (!user) return;
    api.get(`/users/${user.id}`).then((res) => {
      const u = res.data.user;
      setForm({
        name: u.name || '',
        bio: u.bio || '',
        skills: (u.skills || []).join(', '),
        hourlyRate: u.hourlyRate || 0,
      });
    });
    api.get(`/reviews/user/${user.id}`).then((res) => setReviews(res.data.reviews));
  }, [user]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await api.put('/users/me', {
        name: form.name,
        bio: form.bio,
        skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
        hourlyRate: Number(form.hourlyRate),
      });
      toast.success('Profile updated');
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  if (!user) return null;
  const skillList = form.skills.split(',').map((s) => s.trim()).filter(Boolean);

  return (
    <div className="page">
      <div className="profile-header surface-card">
        <div className="profile-avatar-lg">{initials(form.name)}</div>
        <div>
          <h2>{form.name}</h2>
          <p className="muted">{user.role === 'freelancer' ? 'Freelancer' : 'Client'}</p>
          {user.role === 'freelancer' && form.hourlyRate > 0 && <p><strong>${form.hourlyRate}/hr</strong></p>}
        </div>
      </div>

      <div className="grid-2" style={{ marginTop: 24 }}>
        <div>
          <div className="surface-card" style={{ padding: 20 }}>
            <h4>About</h4>
            <p className="muted">{form.bio || 'No bio yet.'}</p>
            {user.role === 'freelancer' && skillList.length > 0 && (
              <>
                <h4 style={{ marginTop: 16 }}>Skills</h4>
                <div className="tags">
                  {skillList.map((s) => <SkillBadge key={s}>{s}</SkillBadge>)}
                </div>
              </>
            )}
          </div>

          <div className="surface-card" style={{ padding: 20, marginTop: 20 }}>
            <h4>Reviews</h4>
            {reviews.length === 0 ? (
              <p className="muted">No reviews yet.</p>
            ) : (
              reviews.map((r) => (
                <div key={r._id} className="proposal-card">
                  <p><strong>{r.reviewer.name}</strong> — {Array(r.rating).fill(0).map((_, i) => (
                    <Star key={i} size={13} fill="#f5a623" color="#f5a623" style={{ display: 'inline' }} />
                  ))}</p>
                  <p className="muted">{r.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <aside className="surface-card" style={{ padding: 20 }}>
          <h4>Edit Profile</h4>
          <form className="stacked-form" onSubmit={handleSave} style={{ boxShadow: 'none', padding: 0 }}>
            <Input label="Name" name="name" value={form.name} onChange={handleChange} />
            <Input label="Bio" textarea rows={4} name="bio" value={form.bio} onChange={handleChange} />
            {user.role === 'freelancer' && (
              <>
                <Input label="Skills (comma separated)" name="skills" value={form.skills} onChange={handleChange} />
                <Input label="Hourly Rate ($)" name="hourlyRate" type="number" value={form.hourlyRate} onChange={handleChange} />
              </>
            )}
            <Button type="submit">Save Changes</Button>
          </form>
        </aside>
      </div>
    </div>
  );
};

export default Profile;

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Bookmark, Clock, Star } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { SkillBadge } from '../components/ui/Misc';
import Button from '../components/ui/Button';

const ProjectDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [bidForm, setBidForm] = useState({ coverLetter: '', bidAmount: '', estimatedDuration: '' });
  const [loading, setLoading] = useState(true);

  const isOwner = user && project && String(project.client._id || project.client) === user.id;
  const isHiredFreelancer = user && project && project.hiredFreelancer && String(project.hiredFreelancer._id) === user.id;

  const loadProject = async () => {
    const res = await api.get(`/projects/${id}`);
    setProject(res.data.project);
  };

  const loadProposals = async () => {
    try {
      const res = await api.get(`/proposals/project/${id}`);
      setProposals(res.data.proposals);
    } catch {
      // not the owner, ignore
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([loadProject(), loadProposals()]).finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleBid = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/proposals/${id}`, {
        ...bidForm,
        bidAmount: Number(bidForm.bidAmount),
      });
      toast.success('Proposal submitted!');
      setBidForm({ coverLetter: '', bidAmount: '', estimatedDuration: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit proposal');
    }
  };

  const handleHire = async (proposalId) => {
    try {
      await api.put(`/projects/${id}/hire/${proposalId}`);
      toast.success('Freelancer hired!');
      loadProject();
      loadProposals();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to hire');
    }
  };

  const handleSubmitWork = async () => {
    const fileUrl = prompt('Paste a link to your completed work (or leave blank):') || '';
    const note = prompt('Add a note for the client:') || '';
    try {
      await api.post(`/projects/${id}/submit`, { fileUrl, note });
      toast.success('Work submitted!');
      loadProject();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit work');
    }
  };

  const handleComplete = async () => {
    try {
      await api.put(`/projects/${id}/complete`);
      toast.success('Project marked as completed!');
      loadProject();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to complete project');
    }
  };

  const openChat = async (participantId) => {
    try {
      const res = await api.post(`/chats/${id}/start`, { participantId });
      navigate(`/chats/${res.data.chat._id}`);
    } catch (err) {
      toast.error('Could not start chat');
    }
  };

  if (loading || !project) return <div className="page">Loading...</div>;

  return (
    <div className="page wide">
      <div className="job-detail-grid">
        <div className="job-detail-main surface-card">
          <div className="job-detail-header">
            <h2>{project.title}</h2>
            <span className={`status-badge ${project.status}`}>{project.status.replace('_', ' ')}</span>
          </div>
          <p className="muted"><Clock size={14} /> Posted by {project.client.name}</p>

          <h4>Description</h4>
          <p>{project.description}</p>

          <h4>Skills Required</h4>
          <div className="tags">
            {project.skillsRequired.map((s) => <SkillBadge key={s}>{s}</SkillBadge>)}
          </div>

          {/* Freelancer: submit a bid */}
          {user && user.role === 'freelancer' && project.status === 'open' && (
            <div className="panel">
              <h3>Submit a Proposal</h3>
              <form className="stacked-form" onSubmit={handleBid}>
                <textarea
                  placeholder="Cover letter"
                  rows={4}
                  value={bidForm.coverLetter}
                  onChange={(e) => setBidForm({ ...bidForm, coverLetter: e.target.value })}
                  required
                />
                <input
                  type="number"
                  placeholder="Your bid amount ($)"
                  value={bidForm.bidAmount}
                  onChange={(e) => setBidForm({ ...bidForm, bidAmount: e.target.value })}
                  required
                />
                <input
                  placeholder="Estimated duration (e.g. 1 week)"
                  value={bidForm.estimatedDuration}
                  onChange={(e) => setBidForm({ ...bidForm, estimatedDuration: e.target.value })}
                />
                <Button type="submit">Submit Proposal</Button>
              </form>
            </div>
          )}

          {/* Hired freelancer: submit work */}
          {isHiredFreelancer && project.status === 'in_progress' && (
            <div className="panel">
              <Button onClick={handleSubmitWork}>Submit Completed Work</Button>
              <Button variant="secondary" onClick={() => openChat(project.client._id)}>Message Client</Button>
            </div>
          )}

          {/* Client: view & manage proposals */}
          {isOwner && (
            <div className="panel">
              <h3>Proposals ({proposals.length})</h3>
              {project.status === 'submitted' && (
                <Button onClick={handleComplete}>Mark Project Completed</Button>
              )}
              {proposals.length === 0 && <p className="muted">No proposals yet.</p>}
              {proposals.map((p) => (
                <div key={p._id} className="proposal-card">
                  <p><strong>{p.freelancer.name}</strong> — ${p.bidAmount} — {p.estimatedDuration}</p>
                  <p className="muted">{p.coverLetter}</p>
                  <p className="muted">Status: {p.status}</p>
                  {project.status === 'open' && (
                    <Button size="sm" onClick={() => handleHire(p._id)}>Hire</Button>
                  )}
                  <Button size="sm" variant="secondary" onClick={() => openChat(p.freelancer._id)}>Message</Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <aside className="job-detail-sidebar surface-card">
          <div className="job-sidebar-budget">${project.budget}</div>
          <p className="muted">Fixed Price</p>
          <div className="job-sidebar-row"><span>Duration</span><strong>{project.duration || 'n/a'}</strong></div>
          <div className="job-sidebar-row"><span>Client</span><strong>{project.client.name}</strong></div>
          {project.client.ratingAvg > 0 && (
            <div className="job-sidebar-row"><span>Rating</span><strong><Star size={13} fill="#f5a623" color="#f5a623" /> {project.client.ratingAvg.toFixed(1)}</strong></div>
          )}
          {user && user.role === 'freelancer' && project.status === 'open' && (
            <>
              <Button className="full-width">Apply Now</Button>
              <Button variant="secondary" className="full-width" icon={Bookmark}>Save Job</Button>
            </>
          )}
        </aside>
      </div>
    </div>
  );
};

export default ProjectDetail;

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, Briefcase, FileText, Star } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/ui/StatCard';
import Button from '../components/ui/Button';
import { EmptyState, LoadingState } from '../components/ui/Misc';

const FreelancerDashboard = () => {
  const { user } = useAuth();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/proposals/mine')
      .then((res) => setProposals(res.data.proposals))
      .finally(() => setLoading(false));
  }, []);

  const active = proposals.filter((p) => p.project?.status === 'in_progress').length;
  const pending = proposals.filter((p) => p.status === 'pending').length;
  const earnings = proposals
    .filter((p) => p.status === 'accepted' && p.project?.status === 'completed')
    .reduce((sum, p) => sum + p.bidAmount, 0);

  return (
    <div className="page wide">
      <div className="dashboard-header">
        <div>
          <h2>Good morning, {user?.name} 👋</h2>
          <p className="section-subtitle">Here's an overview of your freelance activity</p>
        </div>
        <Link to="/projects"><Button icon={Briefcase}>Find Jobs</Button></Link>
      </div>

      <div className="stat-grid">
        <StatCard label="Total Earnings" value={`$${earnings}`} icon={DollarSign} tint="green" />
        <StatCard label="Active Projects" value={active} icon={Briefcase} tint="indigo" />
        <StatCard label="Pending Proposals" value={pending} icon={FileText} tint="orange" />
        <StatCard label="Average Rating" value={user?.ratingAvg ? user.ratingAvg.toFixed(1) : 'New'} icon={Star} tint="navy" />
      </div>

      <h3 className="section-title" style={{ fontSize: '1.2rem', marginTop: 32 }}>My Proposals</h3>

      {loading ? (
        <LoadingState />
      ) : proposals.length === 0 ? (
        <EmptyState title="No proposals submitted yet" subtitle="Browse open jobs and submit your first proposal" />
      ) : (
        <table className="table">
          <thead>
            <tr><th>Project</th><th>Your Bid</th><th>Project Status</th><th>Proposal Status</th><th></th></tr>
          </thead>
          <tbody>
            {proposals.map((p) => (
              <tr key={p._id}>
                <td>{p.project?.title}</td>
                <td>${p.bidAmount}</td>
                <td>{p.project?.status}</td>
                <td><span className={`status-badge ${p.status}`}>{p.status}</span></td>
                <td><Link to={`/projects/${p.project?._id}`}>View</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FreelancerDashboard;

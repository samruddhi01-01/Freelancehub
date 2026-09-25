import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, FileText, Clock, DollarSign, PlusCircle } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/ui/StatCard';
import Button from '../components/ui/Button';
import { EmptyState, LoadingState } from '../components/ui/Misc';

const ClientDashboard = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/projects/mine')
      .then((res) => setProjects(res.data.projects))
      .finally(() => setLoading(false));
  }, []);

  const active = projects.filter((p) => p.status === 'in_progress').length;
  const open = projects.filter((p) => p.status === 'open').length;
  const totalSpend = projects.filter((p) => p.status === 'completed').reduce((sum, p) => sum + p.budget, 0);

  return (
    <div className="page wide">
      <div className="dashboard-header">
        <div>
          <h2>Welcome back, {user?.name} 👋</h2>
          <p className="section-subtitle">Here's what's happening with your projects</p>
        </div>
        <Link to="/projects/new"><Button icon={PlusCircle}>Post a Job</Button></Link>
      </div>

      <div className="stat-grid">
        <StatCard label="Active Jobs" value={open} icon={Briefcase} tint="indigo" />
        <StatCard label="In Progress" value={active} icon={Clock} tint="orange" />
        <StatCard label="Total Projects" value={projects.length} icon={FileText} tint="navy" />
        <StatCard label="Total Spend" value={`$${totalSpend}`} icon={DollarSign} tint="green" />
      </div>

      <h3 className="section-title" style={{ fontSize: '1.2rem', marginTop: 32 }}>My Projects</h3>

      {loading ? (
        <LoadingState />
      ) : projects.length === 0 ? (
        <EmptyState title="No projects posted yet" subtitle="Post your first job to start hiring freelancers" />
      ) : (
        <table className="table">
          <thead>
            <tr><th>Title</th><th>Budget</th><th>Status</th><th></th></tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p._id}>
                <td>{p.title}</td>
                <td>${p.budget}</td>
                <td><span className={`status-badge ${p.status}`}>{p.status.replace('_', ' ')}</span></td>
                <td><Link to={`/projects/${p._id}`}>View</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ClientDashboard;

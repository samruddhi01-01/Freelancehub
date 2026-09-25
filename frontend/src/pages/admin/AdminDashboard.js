import { useEffect, useState } from 'react';
import { Users, Briefcase, CheckCircle, FolderOpen } from 'lucide-react';
import api from '../../api/axios';
import StatCard from '../../components/ui/StatCard';
import { LoadingState } from '../../components/ui/Misc';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/admin/analytics').then((res) => setStats(res.data));
  }, []);

  if (!stats) return <LoadingState />;

  return (
    <div className="page wide">
      <h2 className="section-title">Admin Overview</h2>
      <p className="section-subtitle">Platform-wide statistics and health</p>

      <div className="stat-grid">
        <StatCard label="Total Users" value={stats.totalUsers} icon={Users} tint="indigo" />
        <StatCard label="Clients" value={stats.totalClients} icon={Users} tint="navy" />
        <StatCard label="Freelancers" value={stats.totalFreelancers} icon={Users} tint="navy" />
        <StatCard label="Total Projects" value={stats.totalProjects} icon={FolderOpen} tint="indigo" />
        <StatCard label="Open Projects" value={stats.openProjects} icon={Briefcase} tint="orange" />
        <StatCard label="Completed Projects" value={stats.completedProjects} icon={CheckCircle} tint="green" />
      </div>
    </div>
  );
};

export default AdminDashboard;

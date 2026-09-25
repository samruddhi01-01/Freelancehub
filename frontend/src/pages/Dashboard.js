import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ClientDashboard from './ClientDashboard';
import FreelancerDashboard from './FreelancerDashboard';

const Dashboard = () => {
  const { user } = useAuth();
  if (user?.role === 'client') return <ClientDashboard />;
  if (user?.role === 'freelancer') return <FreelancerDashboard />;
  if (user?.role === 'admin') return <Navigate to="/admin" replace />;
  return <div className="page">No dashboard available for your role.</div>;
};

export default Dashboard;

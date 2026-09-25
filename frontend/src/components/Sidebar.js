import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Search, Briefcase, FileText, MessageSquare, Wallet, User, Settings, LogOut, PlusCircle, Users, ShieldCheck, Receipt,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const clientLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/projects/new', label: 'Post a Job', icon: PlusCircle },
  { to: '/freelancers', label: 'Find Freelancers', icon: Users },
  { to: '/dashboard', label: 'My Jobs', icon: Briefcase },
  { to: '/chats', label: 'Messages', icon: MessageSquare },
  { to: '/profile', label: 'Profile', icon: User },
];

const freelancerLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/projects', label: 'Find Jobs', icon: Search },
  { to: '/dashboard', label: 'Proposals', icon: FileText },
  { to: '/chats', label: 'Messages', icon: MessageSquare },
  { to: '/profile', label: 'Earnings', icon: Wallet },
  { to: '/profile', label: 'Profile', icon: User },
];

const adminLinks = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard },
  { to: '/admin/users', label: 'Users', icon: ShieldCheck },
  { to: '/admin/transactions', label: 'Transactions', icon: Receipt },
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const links = user?.role === 'client' ? clientLinks : user?.role === 'admin' ? adminLinks : freelancerLinks;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">FreelanceHub</div>
      <nav className="sidebar-nav">
        {links.map((l, i) => (
          <NavLink key={i} to={l.to} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} end={l.to === '/dashboard' || l.to === '/admin'}>
            <l.icon size={18} /> {l.label}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <button className="sidebar-link as-button"><Settings size={18} /> Settings</button>
        <button className="sidebar-link as-button" onClick={handleLogout}><LogOut size={18} /> Logout</button>
      </div>
    </aside>
  );
};

export default Sidebar;

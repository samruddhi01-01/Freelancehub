import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import DashboardLayout from './components/DashboardLayout';
import PrivateRoute from './components/PrivateRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProjectList from './pages/ProjectList';
import ProjectDetail from './pages/ProjectDetail';
import CreateProject from './pages/CreateProject';
import FindFreelancers from './pages/FindFreelancers';
import FreelancerProfile from './pages/FreelancerProfile';
import Profile from './pages/Profile';
import Messages from './pages/Messages';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminTransactions from './pages/admin/AdminTransactions';

import './styles/theme.css';
import './styles/components.css';
import './styles.css';

// Public pages get the top navbar; authenticated pages get the sidebar shell.
const Shell = ({ children }) => {
  const { user } = useAuth();
  return user ? <DashboardLayout>{children}</DashboardLayout> : (
    <>
      <Navbar />
      {children}
    </>
  );
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Shell><Home /></Shell>} />
      <Route path="/login" element={<Shell><Login /></Shell>} />
      <Route path="/register" element={<Shell><Register /></Shell>} />
      <Route path="/projects" element={<Shell><ProjectList /></Shell>} />
      <Route path="/projects/:id" element={<Shell><ProjectDetail /></Shell>} />
      <Route path="/freelancers" element={<Shell><FindFreelancers /></Shell>} />
      <Route path="/freelancers/:id" element={<Shell><FreelancerProfile /></Shell>} />
      <Route
        path="/projects/new"
        element={
          <PrivateRoute roles={['client']}>
            <Shell><CreateProject /></Shell>
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute roles={['client', 'freelancer']}>
            <Shell><Dashboard /></Shell>
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Shell><Profile /></Shell>
          </PrivateRoute>
        }
      />
      <Route
        path="/chats"
        element={
          <PrivateRoute>
            <Shell><Messages /></Shell>
          </PrivateRoute>
        }
      />
      <Route
        path="/chats/:chatId"
        element={
          <PrivateRoute>
            <Shell><Messages /></Shell>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <PrivateRoute roles={['admin']}>
            <Shell><AdminDashboard /></Shell>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <PrivateRoute roles={['admin']}>
            <Shell><AdminUsers /></Shell>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/transactions"
        element={
          <PrivateRoute roles={['admin']}>
            <Shell><AdminTransactions /></Shell>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <ToastContainer position="bottom-right" />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

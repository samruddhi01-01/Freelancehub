import { useEffect, useState } from 'react';
import { ShieldCheck, ShieldOff, BadgeCheck } from 'lucide-react';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import Button from '../../components/ui/Button';
import { LoadingState, EmptyState } from '../../components/ui/Misc';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const params = {};
      if (role) params.role = role;
      const res = await api.get('/admin/users', { params });
      setUsers(res.data.users);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  const handleVerify = async (id) => {
    try {
      await api.put(`/admin/users/${id}/verify`);
      toast.success('User verified');
      load();
    } catch {
      toast.error('Failed to verify user');
    }
  };

  const handleToggleBlock = async (id) => {
    try {
      await api.put(`/admin/users/${id}/block`);
      toast.success('User status updated');
      load();
    } catch {
      toast.error('Failed to update user');
    }
  };

  return (
    <div className="page wide">
      <h2 className="section-title">Users</h2>
      <p className="section-subtitle">Verify accounts and manage access</p>

      <div className="admin-role-filter">
        {['', 'client', 'freelancer', 'admin'].map((r) => (
          <button
            key={r || 'all'}
            className={`admin-role-tab ${role === r ? 'active' : ''}`}
            onClick={() => setRole(r)}
          >
            {r ? r.charAt(0).toUpperCase() + r.slice(1) + 's' : 'All'}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingState />
      ) : users.length === 0 ? (
        <EmptyState title="No users found" />
      ) : (
        <table className="table">
          <thead>
            <tr><th>Name</th><th>Email</th><th>Role</th><th>Verified</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.isVerified ? <BadgeCheck size={16} color="#12805c" /> : '—'}</td>
                <td><span className={`status-badge ${u.isBlocked ? 'submitted' : 'open'}`}>{u.isBlocked ? 'Blocked' : 'Active'}</span></td>
                <td className="admin-actions">
                  {!u.isVerified && (
                    <Button size="sm" variant="secondary" icon={ShieldCheck} onClick={() => handleVerify(u._id)}>Verify</Button>
                  )}
                  <Button
                    size="sm"
                    variant={u.isBlocked ? 'secondary' : 'ghost'}
                    icon={u.isBlocked ? ShieldCheck : ShieldOff}
                    onClick={() => handleToggleBlock(u._id)}
                  >
                    {u.isBlocked ? 'Unblock' : 'Block'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminUsers;

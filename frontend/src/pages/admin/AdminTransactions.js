import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import Button from '../../components/ui/Button';
import { LoadingState, EmptyState } from '../../components/ui/Misc';

const statusOptions = ['pending', 'held', 'released', 'refunded', 'disputed'];

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      const res = await api.get('/admin/transactions', { params });
      setTransactions(res.data.transactions);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleResolve = async (id, status) => {
    const note = prompt(`Add a note for this resolution (marking as "${status}"):`) || '';
    try {
      await api.put(`/admin/transactions/${id}/resolve`, { status, note });
      toast.success('Transaction updated');
      load();
    } catch {
      toast.error('Failed to update transaction');
    }
  };

  return (
    <div className="page wide">
      <h2 className="section-title">Transactions & Disputes</h2>
      <p className="section-subtitle">Review payments and resolve disputes</p>

      <div className="admin-role-filter">
        {['', ...statusOptions].map((s) => (
          <button
            key={s || 'all'}
            className={`admin-role-tab ${statusFilter === s ? 'active' : ''}`}
            onClick={() => setStatusFilter(s)}
          >
            {s ? s.charAt(0).toUpperCase() + s.slice(1) : 'All'}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingState />
      ) : transactions.length === 0 ? (
        <EmptyState title="No transactions found" subtitle="Transactions are created when payment flows are wired up" />
      ) : (
        <table className="table">
          <thead>
            <tr><th>Project</th><th>Client</th><th>Freelancer</th><th>Amount</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t._id}>
                <td>{t.project?.title}</td>
                <td>{t.client?.name}</td>
                <td>{t.freelancer?.name}</td>
                <td>${t.amount}</td>
                <td><span className="status-badge">{t.status}</span></td>
                <td className="admin-actions">
                  <Button size="sm" onClick={() => handleResolve(t._id, 'released')}>Release</Button>
                  <Button size="sm" variant="secondary" onClick={() => handleResolve(t._id, 'refunded')}>Refund</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminTransactions;

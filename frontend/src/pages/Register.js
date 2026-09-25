import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'client', skills: '' });
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        skills: form.role === 'freelancer' ? form.skills.split(',').map((s) => s.trim()).filter(Boolean) : [],
      };
      await register(payload);
      toast.success('Account created!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Create Account</h2>
        <input name="name" placeholder="Full name" value={form.name} onChange={handleChange} required />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password (min 6 chars)"
          value={form.password}
          onChange={handleChange}
          minLength={6}
          required
        />
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="client">I'm a Client (hiring)</option>
          <option value="freelancer">I'm a Freelancer (working)</option>
        </select>
        {form.role === 'freelancer' && (
          <input
            name="skills"
            placeholder="Skills, comma separated (e.g. React, Node, Figma)"
            value={form.skills}
            onChange={handleChange}
          />
        )}
        <button type="submit" disabled={submitting}>
          {submitting ? 'Creating...' : 'Register'}
        </button>
        <p>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;

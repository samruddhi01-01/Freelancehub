import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import api from '../api/axios';
import { toast } from 'react-toastify';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const steps = ['Job Details', 'Skills', 'Budget', 'Timeline', 'Review & Publish'];

const CreateProject = () => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    title: '',
    description: '',
    skillsRequired: '',
    budget: '',
    duration: '',
    category: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const canProceed = () => {
    if (step === 0) return form.title.trim() && form.description.trim();
    if (step === 2) return form.budget && Number(form.budget) > 0;
    return true;
  };

  const next = () => canProceed() && setStep((s) => Math.min(s + 1, steps.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        budget: Number(form.budget),
        skillsRequired: form.skillsRequired.split(',').map((s) => s.trim()).filter(Boolean),
      };
      const res = await api.post('/projects', payload);
      toast.success('Project posted!');
      navigate(`/projects/${res.data.project._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post project');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page narrow">
      <h2 className="section-title">Post a Job</h2>

      <div className="step-indicator">
        {steps.map((label, i) => (
          <div key={label} className={`step-dot ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
            <span className="step-circle">{i < step ? <Check size={13} /> : i + 1}</span>
            <span className="step-label">{label}</span>
          </div>
        ))}
      </div>

      <div className="surface-card step-panel">
        {step === 0 && (
          <>
            <Input label="Job Title" name="title" value={form.title} onChange={handleChange} placeholder="e.g. Build a React dashboard" />
            <Input
              label="Description"
              textarea
              rows={5}
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the project, deliverables, and expectations"
            />
            <Input label="Category" name="category" value={form.category} onChange={handleChange} placeholder="e.g. Web Development" />
          </>
        )}

        {step === 1 && (
          <Input
            label="Skills Required"
            name="skillsRequired"
            value={form.skillsRequired}
            onChange={handleChange}
            placeholder="React, Node, MongoDB (comma separated)"
          />
        )}

        {step === 2 && (
          <Input
            label="Budget ($)"
            name="budget"
            type="number"
            min="1"
            value={form.budget}
            onChange={handleChange}
            placeholder="e.g. 2500"
          />
        )}

        {step === 3 && (
          <Input label="Estimated Duration" name="duration" value={form.duration} onChange={handleChange} placeholder="e.g. 2-4 weeks" />
        )}

        {step === 4 && (
          <div className="review-summary">
            <h4>{form.title || 'Untitled project'}</h4>
            <p className="muted">{form.description}</p>
            <div className="tags">
              {form.skillsRequired.split(',').map((s) => s.trim()).filter(Boolean).map((s) => (
                <span key={s} className="ui-skill-badge">{s}</span>
              ))}
            </div>
            <p><strong>Budget:</strong> ${form.budget || 0} &nbsp; <strong>Duration:</strong> {form.duration || 'n/a'}</p>
            <p><strong>Category:</strong> {form.category || 'n/a'}</p>
          </div>
        )}

        <div className="step-actions">
          {step > 0 && <Button variant="secondary" onClick={back}>Back</Button>}
          {step < steps.length - 1 ? (
            <Button onClick={next} disabled={!canProceed()}>Continue</Button>
          ) : (
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Publishing...' : 'Publish Job'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateProject;

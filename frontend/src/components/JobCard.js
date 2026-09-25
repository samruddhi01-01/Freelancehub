import { Link } from 'react-router-dom';
import { Clock, Briefcase } from 'lucide-react';
import { SkillBadge, Rating } from './ui/Misc';
import Button from './ui/Button';

const timeAgo = (date) => {
  const diff = Math.floor((Date.now() - new Date(date)) / 60000);
  if (diff < 60) return `${diff}m ago`;
  if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
  return `${Math.floor(diff / 1440)}d ago`;
};

const JobCard = ({ job }) => (
  <div className="job-card">
    <div className="job-card-top">
      <h3>{job.title}</h3>
      <span className="job-card-time"><Clock size={13} /> {timeAgo(job.createdAt)}</span>
    </div>
    <p className="job-card-client muted">
      <Briefcase size={13} /> {job.client?.name || 'Client'}
      {job.client?.ratingAvg > 0 && <Rating value={job.client.ratingAvg} />}
    </p>
    <p className="job-card-desc">{job.description.slice(0, 130)}{job.description.length > 130 ? '...' : ''}</p>
    <div className="tags">
      {job.skillsRequired?.slice(0, 4).map((s) => <SkillBadge key={s}>{s}</SkillBadge>)}
    </div>
    <div className="job-card-meta">
      <span className="job-card-budget">${job.budget}</span>
      {job.duration && <span className="muted">{job.duration}</span>}
    </div>
    <div className="job-card-actions">
      <Link to={`/projects/${job._id}`}><Button variant="secondary" size="sm">View Job</Button></Link>
      <Link to={`/projects/${job._id}`}><Button variant="primary" size="sm">Apply Now</Button></Link>
    </div>
  </div>
);

export default JobCard;

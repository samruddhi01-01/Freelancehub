import { Link } from 'react-router-dom';
import { SkillBadge, Rating } from './ui/Misc';
import Button from './ui/Button';

const initials = (name = '') => name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();

const FreelancerCard = ({ freelancer, matchPercent }) => (
  <div className="freelancer-card">
    <div className="freelancer-avatar">{initials(freelancer.name)}</div>
    <div className="freelancer-info">
      <div className="freelancer-name-row">
        <h4>{freelancer.name}</h4>
        {matchPercent !== undefined && <span className="match-badge">{matchPercent}% Match</span>}
      </div>
      <p className="muted">{freelancer.bio ? freelancer.bio.slice(0, 60) : 'Freelancer'}</p>
      <div className="tags">
        {freelancer.skills?.slice(0, 4).map((s) => <SkillBadge key={s}>{s}</SkillBadge>)}
      </div>
      <div className="freelancer-meta">
        <Rating value={freelancer.ratingAvg} count={freelancer.ratingCount} />
        {freelancer.hourlyRate > 0 && <span className="muted">${freelancer.hourlyRate}/hr</span>}
      </div>
    </div>
    <Link to={`/freelancers/${freelancer._id}`}>
      <Button variant="secondary" size="sm">View Profile</Button>
    </Link>
  </div>
);

export default FreelancerCard;

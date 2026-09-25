import { Star, Inbox, Loader2 } from 'lucide-react';

export const SkillBadge = ({ children }) => <span className="ui-skill-badge">{children}</span>;

export const Rating = ({ value = 0, count }) => (
  <span className="ui-rating">
    <Star size={14} fill="#f5a623" color="#f5a623" />
    {value ? value.toFixed(1) : 'New'}
    {count !== undefined && <span className="ui-rating-count">({count})</span>}
  </span>
);

export const EmptyState = ({ title = 'Nothing here yet', subtitle }) => (
  <div className="ui-empty-state">
    <Inbox size={32} strokeWidth={1.5} />
    <p className="ui-empty-title">{title}</p>
    {subtitle && <p className="ui-empty-subtitle">{subtitle}</p>}
  </div>
);

export const LoadingState = ({ label = 'Loading...' }) => (
  <div className="ui-loading-state">
    <Loader2 size={22} className="ui-spin" />
    <span>{label}</span>
  </div>
);

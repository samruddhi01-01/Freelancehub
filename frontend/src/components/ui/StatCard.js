const StatCard = ({ label, value, icon: Icon, tint = 'indigo' }) => (
  <div className="ui-stat-card">
    <div className={`ui-stat-icon ui-stat-icon-${tint}`}>{Icon && <Icon size={20} />}</div>
    <div>
      <div className="ui-stat-value">{value}</div>
      <div className="ui-stat-label">{label}</div>
    </div>
  </div>
);

export default StatCard;

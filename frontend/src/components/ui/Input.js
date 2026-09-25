const Input = ({ label, error, textarea, className = '', ...rest }) => {
  const Field = textarea ? 'textarea' : 'input';
  return (
    <div className={`ui-field ${className}`}>
      {label && <label className="ui-label">{label}</label>}
      <Field className={`ui-input ${error ? 'ui-input-error' : ''}`} {...rest} />
      {error && <span className="ui-error-text">{error}</span>}
    </div>
  );
};

export default Input;

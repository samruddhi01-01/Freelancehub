const Button = ({ children, variant = 'primary', size = 'md', icon: Icon, className = '', ...rest }) => {
  return (
    <button className={`ui-btn ui-btn-${variant} ui-btn-${size} ${className}`} {...rest}>
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
};

export default Button;

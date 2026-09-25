import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import Button from './ui/Button';

const Navbar = () => (
  <div className="public-navbar-wrap">
    <header className="public-navbar">
      <Link to="/" className="public-brand">
        <span className="brand-icon"><CheckCircle2 size={18} /></span>
        FreelanceHub
      </Link>
      <nav className="public-nav-links">
        <Link to="/projects">Find Work</Link>
        <Link to="/freelancers">Find Talent</Link>
        <Link to="/#how-it-works">How It Works</Link>
        <Link to="/#pricing">Pricing</Link>
      </nav>
      <div className="public-nav-actions">
        <Link to="/login"><Button variant="secondary" size="sm">Log In</Button></Link>
        <Link to="/register"><Button variant="primary" size="sm">Get Started</Button></Link>
      </div>
    </header>
  </div>
);

export default Navbar;

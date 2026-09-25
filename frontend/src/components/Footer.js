import { Link } from 'react-router-dom';
import { CheckCircle2, Linkedin, Twitter, Instagram } from 'lucide-react';

const Footer = () => (
  <footer className="site-footer">
    <div className="footer-top">
      <div className="footer-brand-col">
        <div className="public-brand">
          <span className="brand-icon"><CheckCircle2 size={18} /></span>
          FreelanceHub
        </div>
        <p className="muted">The modern way to hire freelancers and get work done.</p>
        <div className="footer-socials">
          <Linkedin size={16} /> <Twitter size={16} /> <Instagram size={16} />
        </div>
      </div>
      <div className="footer-col">
        <h5>Product</h5>
        <Link to="/projects">Find Work</Link>
        <Link to="/freelancers">Find Talent</Link>
        <Link to="/#how-it-works">How It Works</Link>
      </div>
      <div className="footer-col">
        <h5>Company</h5>
        <Link to="/">About Us</Link>
        <Link to="/">Careers</Link>
        <Link to="/">Contact</Link>
      </div>
      <div className="footer-col">
        <h5>Support</h5>
        <Link to="/">Help Center</Link>
        <Link to="/">Privacy Policy</Link>
        <Link to="/">Terms of Service</Link>
      </div>
    </div>
    <p className="footer-bottom muted">© {new Date().getFullYear()} FreelanceHub. All rights reserved.</p>
  </footer>
);

export default Footer;

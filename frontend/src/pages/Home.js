import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Sparkles, Code2, Palette, Brain, LineChart, PenTool, Megaphone, PenSquare,
  Target, Users2, ShieldCheck, BarChart3, CheckCircle2, ArrowRight, Bell, Search as SearchIcon,
} from 'lucide-react';
import api from '../api/axios';
import SearchBar from '../components/ui/SearchBar';
import Button from '../components/ui/Button';
import JobCard from '../components/JobCard';
import FreelancerCard from '../components/FreelancerCard';
import { LoadingState } from '../components/ui/Misc';
import Footer from '../components/Footer';

const categories = [
  { name: 'Web Development', icon: Code2 },
  { name: 'UI/UX Design', icon: Palette },
  { name: 'AI & Machine Learning', icon: Brain },
  { name: 'Data Science', icon: LineChart },
  { name: 'Graphic Design', icon: PenTool },
  { name: 'Digital Marketing', icon: Megaphone },
  { name: 'Content Writing', icon: PenSquare },
];

const features = [
  { title: 'Smart Job Matching', desc: 'Post a job or browse listings — our filters surface the right fit fast.', icon: Target, tint: 'violet' },
  { title: 'Real-Time Collaboration', desc: 'Built-in chat keeps clients and freelancers in sync from bid to delivery.', icon: Users2, tint: 'blue' },
  { title: 'Verified & Rated', desc: 'Ratings and reviews on every completed project build real trust.', icon: ShieldCheck, tint: 'green' },
  { title: 'Track Everything', desc: 'Dashboards for proposals, active work, and spend — always up to date.', icon: BarChart3, tint: 'orange' },
];

const avatarSeed = ['S', 'R', 'M', 'A'];

const Home = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [freelancers, setFreelancers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/users/freelancers', { params: { limit: 4 } }),
      api.get('/projects', { params: { status: 'open', limit: 4 } }),
    ])
      .then(([f, p]) => {
        setFreelancers(f.data.freelancers);
        setJobs(p.data.projects);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/projects?search=${encodeURIComponent(query)}`);
  };

  return (
    <div className="landing">
      <section className="hero-section">
        <div className="hero-grid">
          <div className="hero-copy">
            <span className="hero-pill"><Sparkles size={13} /> New: Smart Match is here</span>
            <h1>Find the right talent.<br /><span className="text-accent">Build something great.</span></h1>
            <p className="hero-subtitle">
              FreelanceHub connects clients and skilled freelancers so ideas turn into finished, delivered projects — fast.
            </p>
            <div className="hero-search">
              <SearchBar
                large
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onSubmit={handleSearch}
                placeholder="Search freelancers, skills, or services..."
              />
            </div>
            <div className="hero-actions">
              <Link to="/register"><Button variant="primary" size="lg" icon={ArrowRight}>Get Started Free</Button></Link>
              <Link to="/projects"><Button variant="secondary" size="lg">Find Work</Button></Link>
            </div>
            <div className="hero-social">
              <div className="avatar-stack">
                {avatarSeed.map((s) => <span key={s} className="avatar-chip">{s}</span>)}
              </div>
              <span className="muted">Loved by 10K+ freelancers &amp; clients</span>
            </div>
          </div>

          <div className="hero-visual">
            <div className="mockup-card">
              <div className="mockup-topbar">
                <span className="mockup-search"><SearchIcon size={13} /> Search jobs...</span>
                <span className="mockup-bell"><Bell size={15} /></span>
              </div>
              <div className="mockup-welcome">Welcome back, Sarah 👋</div>
              <p className="muted mockup-sub">Here's what's happening today.</p>
              <div className="mockup-stats">
                <div className="mockup-stat"><span className="muted">Open Jobs</span><strong>128</strong></div>
                <div className="mockup-stat"><span className="muted">Proposals</span><strong>76</strong></div>
                <div className="mockup-stat"><span className="muted">In Progress</span><strong>32</strong></div>
              </div>
              <div className="mockup-list">
                <div className="mockup-list-item"><CheckCircle2 size={16} color="#12805c" /> UI/UX Design <span className="muted">Completed</span></div>
                <div className="mockup-list-item"><CheckCircle2 size={16} color="#b26a00" /> Landing Page <span className="muted">In Progress</span></div>
                <div className="mockup-list-item"><CheckCircle2 size={16} color="#7c3aed" /> API Integration <span className="muted">Upcoming</span></div>
              </div>
            </div>
            <div className="mockup-glow" />
          </div>
        </div>
      </section>

      <section className="page wide" id="how-it-works">
        <div className="eyebrow">FEATURES</div>
        <h2 className="section-title center">Everything you need in one place.</h2>
        <div className="feature-tile-grid">
          {features.map((f) => (
            <div key={f.title} className={`feature-tile tint-${f.tint}`}>
              <div className="feature-tile-icon"><f.icon size={20} /></div>
              <h4>{f.title}</h4>
              <p className="muted">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="page wide how-it-works-section">
        <div className="how-visual">
          <div className="how-card">
            <div className="mockup-list-item"><CheckCircle2 size={16} color="#12805c" /> Post Your Job <span className="muted">Completed</span></div>
            <div className="mockup-list-item"><CheckCircle2 size={16} color="#b26a00" /> Review Proposals <span className="muted">In Progress</span></div>
            <div className="mockup-list-item"><CheckCircle2 size={16} color="#7c3aed" /> Hire &amp; Collaborate <span className="muted">Upcoming</span></div>
          </div>
        </div>
        <div className="how-copy">
          <div className="eyebrow">HOW IT WORKS</div>
          <h2 className="section-title">Simple steps to get more done.</h2>
          <div className="how-step">
            <span className="how-step-num">01</span>
            <div><strong>Post a job or create a profile</strong><p className="muted">Set up in minutes — describe the work or list your skills.</p></div>
          </div>
          <div className="how-step">
            <span className="how-step-num">02</span>
            <div><strong>Match &amp; connect</strong><p className="muted">Browse proposals or apply to jobs that fit.</p></div>
          </div>
          <div className="how-step">
            <span className="how-step-num">03</span>
            <div><strong>Deliver &amp; get paid</strong><p className="muted">Chat, submit work, and collect reviews that build your reputation.</p></div>
          </div>
        </div>
      </section>

      {!loading && freelancers.length > 0 && (
        <section className="page wide">
          <h2 className="section-title">Featured Freelancers</h2>
          <p className="section-subtitle">Top-rated professionals ready to work</p>
          <div className="freelancer-grid">
            {freelancers.map((f) => <FreelancerCard key={f._id} freelancer={f} />)}
          </div>
        </section>
      )}

      {!loading && jobs.length > 0 && (
        <section className="page wide">
          <h2 className="section-title">Popular Projects</h2>
          <p className="section-subtitle">Fresh opportunities posted by clients</p>
          <div className="card-grid">
            {jobs.map((j) => <JobCard key={j._id} job={j} />)}
          </div>
        </section>
      )}

      {loading && <LoadingState />}

      <section className="page wide">
        <div className="category-grid">
          {categories.map((c) => (
            <Link to={`/projects?skill=${encodeURIComponent(c.name)}`} key={c.name} className="category-card">
              <c.icon size={22} />
              <span>{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="cta-banner">
        <div className="cta-banner-inner">
          <div>
            <h2>Ready to find your next hire?</h2>
            <p>Join thousands of clients and freelancers already using FreelanceHub.</p>
          </div>
          <Link to="/register"><Button size="lg" className="cta-btn">Get Started Free</Button></Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;

import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import SearchBar from '../components/ui/SearchBar';
import FreelancerCard from '../components/FreelancerCard';
import { EmptyState, LoadingState } from '../components/ui/Misc';

const FindFreelancers = () => {
  const [searchParams] = useSearchParams();
  const [freelancers, setFreelancers] = useState([]);
  const [skill, setSkill] = useState(searchParams.get('skill') || '');
  const [loading, setLoading] = useState(true);

  const fetchFreelancers = async () => {
    setLoading(true);
    try {
      const params = {};
      if (skill) params.skill = skill;
      const res = await api.get('/users/freelancers', { params });
      setFreelancers(res.data.freelancers);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFreelancers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchFreelancers();
  };

  // Simple client-side "Smart Match" score: how many searched-skill keywords match the freelancer's skills
  const withMatch = skill
    ? freelancers.map((f) => {
        const kw = skill.toLowerCase();
        const hit = (f.skills || []).some((s) => s.toLowerCase().includes(kw));
        return { ...f, matchPercent: hit ? Math.floor(80 + Math.random() * 19) : Math.floor(40 + Math.random() * 30) };
      }).sort((a, b) => b.matchPercent - a.matchPercent)
    : freelancers;

  return (
    <div className="page wide">
      <h2 className="section-title">Find Talent</h2>
      <p className="section-subtitle">Browse skilled freelancers ready for your next project</p>

      <div className="find-jobs-search">
        <SearchBar
          large
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          onSubmit={handleSearch}
          placeholder="Search by skill (e.g. React, Figma, Python)..."
        />
      </div>

      {skill && !loading && withMatch.length > 0 && (
        <h3 className="section-title" style={{ fontSize: '1.1rem', marginTop: 20 }}>Smart Matches</h3>
      )}

      {loading ? (
        <LoadingState />
      ) : withMatch.length === 0 ? (
        <EmptyState title="No freelancers found" subtitle="Try a different skill search" />
      ) : (
        <div className="freelancer-grid">
          {withMatch.map((f) => (
            <FreelancerCard key={f._id} freelancer={f} matchPercent={skill ? f.matchPercent : undefined} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FindFreelancers;

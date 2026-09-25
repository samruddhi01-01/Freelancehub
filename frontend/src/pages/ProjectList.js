import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import SearchBar from '../components/ui/SearchBar';
import JobCard from '../components/JobCard';
import { EmptyState, LoadingState } from '../components/ui/Misc';

const categoryOptions = ['Web Development', 'AI / ML', 'Data Science', 'UI/UX', 'Mobile Development', 'Digital Marketing'];
const budgetOptions = [
  { label: '$0 – $500', min: 0, max: 500 },
  { label: '$500 – $2,000', min: 500, max: 2000 },
  { label: '$2,000 – $5,000', min: 2000, max: 5000 },
  { label: '$5,000+', min: 5000, max: Infinity },
];

const ProjectList = () => {
  const [searchParams] = useSearchParams();
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [skill, setSkill] = useState(searchParams.get('skill') || '');
  const [category, setCategory] = useState('');
  const [budgetRange, setBudgetRange] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const params = { status: 'open' };
      if (search) params.search = search;
      if (skill) params.skill = skill;
      if (category) params.category = category;
      const res = await api.get('/projects', { params });
      setProjects(res.data.projects);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProjects();
  };

  // Budget filtering is applied client-side since the API doesn't support range filters yet
  const visibleProjects = budgetRange
    ? projects.filter((p) => p.budget >= budgetRange.min && p.budget <= budgetRange.max)
    : projects;

  return (
    <div className="page wide">
      <h2 className="section-title">Find Jobs</h2>
      <p className="section-subtitle">Browse open projects that match your skills</p>

      <div className="find-jobs-search">
        <SearchBar
          large
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onSubmit={handleSearch}
          placeholder="Search jobs, skills, or keywords..."
        />
      </div>

      <div className="grid-2">
        <aside className="surface-card filter-panel">
          <h4>Category</h4>
          {categoryOptions.map((c) => (
            <label key={c} className="filter-option">
              <input
                type="radio"
                name="category"
                checked={category === c}
                onChange={() => { setCategory(c); }}
              />
              {c}
            </label>
          ))}
          {category && <button className="clear-filter" onClick={() => setCategory('')}>Clear category</button>}

          <h4>Budget</h4>
          {budgetOptions.map((b) => (
            <label key={b.label} className="filter-option">
              <input
                type="radio"
                name="budget"
                checked={budgetRange?.label === b.label}
                onChange={() => setBudgetRange(b)}
              />
              {b.label}
            </label>
          ))}
          {budgetRange && <button className="clear-filter" onClick={() => setBudgetRange(null)}>Clear budget</button>}

          <button className="ui-btn ui-btn-secondary ui-btn-sm" style={{ marginTop: 14, width: '100%' }} onClick={fetchProjects}>
            Apply Filters
          </button>
        </aside>

        <div>
          {loading ? (
            <LoadingState />
          ) : visibleProjects.length === 0 ? (
            <EmptyState title="No open projects found" subtitle="Try adjusting your search or filters" />
          ) : (
            <div className="card-grid">
              {visibleProjects.map((p) => <JobCard key={p._id} job={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectList;

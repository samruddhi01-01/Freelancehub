import { Search } from 'lucide-react';

const SearchBar = ({ value, onChange, onSubmit, placeholder = 'Search...', large }) => (
  <form className={`ui-searchbar ${large ? 'ui-searchbar-lg' : ''}`} onSubmit={onSubmit}>
    <Search size={large ? 20 : 16} className="ui-searchbar-icon" />
    <input value={value} onChange={onChange} placeholder={placeholder} />
    <button type="submit">Search</button>
  </form>
);

export default SearchBar;

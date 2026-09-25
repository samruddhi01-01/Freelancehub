import Sidebar from './Sidebar';

const DashboardLayout = ({ children }) => (
  <div className="app-shell">
    <Sidebar />
    <main className="app-main">{children}</main>
  </div>
);

export default DashboardLayout;

import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Users, 
  Briefcase, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  Star,
  Heart,
  LogOut,
  Menu,
  X
} from 'lucide-react';

interface AdminShellProps {
  children: React.ReactNode;
}

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: 'Participants', path: '/admin/participants', icon: <Users size={20} /> },
  { label: 'Cases', path: '/admin/cases', icon: <Briefcase size={20} /> },
  { label: 'Broadcasts', path: '/admin/broadcasts', icon: <MessageSquare size={20} /> },
  { label: 'Reporting', path: '/admin/reporting', icon: <BarChart3 size={20} /> },
  { label: 'Starred', path: '/admin/starred', icon: <Star size={20} /> },
  { label: 'Volunteer Network', path: '/admin/volunteer-network', icon: <Heart size={20} /> },
  { label: 'Settings', path: '/admin/settings', icon: <Settings size={20} /> },
];

export const AdminShell: React.FC<AdminShellProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <div className="admin-header-left">
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h1 className="admin-title">Medicaid CE Admin</h1>
        </div>
        <div className="admin-header-right">
          {user && (
            <>
              <span className="admin-user-name">{user.name || user.email}</span>
              <button 
                className="btn btn--secondary btn--sm"
                onClick={handleLogout}
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </>
          )}
        </div>
      </header>

      <div className="admin-body">
        <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <nav className="admin-nav">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`admin-nav-item ${isActive(item.path) ? 'active' : ''}`}
              >
                <span className="admin-nav-icon">{item.icon}</span>
                {sidebarOpen && <span className="admin-nav-label">{item.label}</span>}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
};

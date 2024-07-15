import { useDashboardContext } from '../pages/DashboardLayout';
import links from '../utils/link';
import { NavLink } from 'react-router-dom';

export default function NavLinks({ isBigSidebar }) {
  const { toggleSidebar } = useDashboardContext();
  return (
    <div className='nav-links'>
      {links.map((link) => {
        const { text, path, icon } = link;
        // admin user
        return (
          <NavLink
            to={path}
            key={text}
            onClick={isBigSidebar ? null : toggleSidebar}
            className='nav-link'
            end
          >
            <span className='icon'>{icon}</span>
            {text}
          </NavLink>
        );
      })}
    </div>
  );
}

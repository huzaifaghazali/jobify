import NavLinks from './NavLinks';
import Logo from '../components/Logo';
import { useDashboardContext } from '../pages/DashboardLayout';
import Wrapper from '../assets/wrappers/BigSidebar';

export default function BigSidebar() {
  const { showSidebar } = useDashboardContext();
  console.log(showSidebar);

  return (
    <Wrapper>
      <div
        className={
          showSidebar ? 'sidebar-container ' : 'sidebar-container show-sidebar'
        }
      >
        <div className='content'>
          <header>
            <Logo />
          </header>
          <NavLinks isBigSidebar />
        </div>
      </div>
    </Wrapper>
  );
}

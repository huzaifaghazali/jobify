import { useState, createContext, useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { BigSidebar, SmallSidebar, Navbar } from '../components';
import Wrapper from '../assets/wrappers/Dashboard';

const DashboardContext = createContext();

const DashboardLayout = () => {
  // temp
  const user = { name: 'huzaifa' };

  const [showSidebar, setShowSidebar] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const toggleDarkTheme = () => {
    console.log('toggle dark theme');
  };

  const toggleSidebar = () => {
    setShowSidebar((prev) => !prev);
  };

  const logoutUser = async () => {
    console.log('Logout User');
  };

  return (
    <DashboardContext.Provider
      value={{
        user,
        showSidebar,
        isDarkTheme,
        toggleDarkTheme,
        toggleSidebar,
        logoutUser,
      }}
    >
      <Wrapper>
        <main className='dashboard'>
          <SmallSidebar />
          <BigSidebar />
          <div>
            <Navbar />
            <div className='dashboard-page'>
              <Outlet />
            </div>
          </div>
        </main>
      </Wrapper>
    </DashboardContext.Provider>
  );
};

export const useDashboardContext = () => useContext(DashboardContext);
export default DashboardLayout;

import { useState, createContext, useContext, useEffect } from 'react';
import { Outlet, redirect, useNavigate, useNavigation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BigSidebar, SmallSidebar, Navbar, Loading } from '../components';
import Wrapper from '../assets/wrappers/Dashboard';
import customFetch from '../utils/customFetch';
import { checkDefaultTheme } from '../App';
import { useQuery } from '@tanstack/react-query';

const userQuery = {
  queryKey: ['user'],
  queryFn: async () => {
    const { data } = await customFetch('/users/current-user');
    return data;
  },
};

export const loader = (queryClient) => async () => {
  try {
    return await queryClient.ensureQueryData(userQuery);
  } catch (error) {
    return redirect('/');
  }
};

const DashboardContext = createContext();

const DashboardLayout = ({ queryClient }) => {
  const { user } = useQuery(userQuery).data;
  const navigation = useNavigation();
  const navigate = useNavigate();
  const isPageLoading = navigation.state === 'loading';

  const [showSidebar, setShowSidebar] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(checkDefaultTheme());
  const [isAuthError, setIsAuthError] = useState(false);

  const toggleDarkTheme = () => {
    const newDarkTheme = !isDarkTheme;
    setIsDarkTheme(newDarkTheme);
    document.body.classList.toggle('dark-theme', newDarkTheme);
    localStorage.setItem('darkTheme', newDarkTheme);
  };

  const toggleSidebar = () => {
    setShowSidebar((prev) => !prev);
  };

  const logoutUser = async () => {
    navigate('/');
    await customFetch('/auth/logout');
    queryClient.invalidateQueries();
    toast.success('Logging out...');
  };

  // This is an interceptor function that will be called whenever a response is
  // received from the server. It checks if the response has a status of 401 (Unauthorized),
  // and if so, it sets the isAuthError state to true.
  // If the response does not have a 401 status, it simply returns the response.
  customFetch.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      // Check if the response has a status of 401 (Unauthorized)
      if (error?.response?.status === 401) {
        // If so, set the isAuthError state to true
        setIsAuthError(true);
      }
      // Return a rejected promise with the error
      return Promise.reject(error);
    }
  );

  // This useEffect hook is triggered whenever the isAuthError state changes.
  // If the isAuthError state is true, it means that the user has tried to access
  // a protected resource and was unauthorized. In this case, the logoutUser function
  // is called to log the user out.
  useEffect(() => {
    // Check if the isAuthError state is true
    if (!isAuthError) {
      // If not, do nothing
      return;
    }

    logoutUser();
  }, [isAuthError]);

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
              {isPageLoading ? <Loading /> : <Outlet context={{ user }} />}
            </div>
          </div>
        </main>
      </Wrapper>
    </DashboardContext.Provider>
  );
};

export const useDashboardContext = () => useContext(DashboardContext);
export default DashboardLayout;

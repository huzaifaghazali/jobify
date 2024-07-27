import { toast } from 'react-toastify';
import JobsContainer from '../components/JobsContainer';
import SearchContainer from '../components/SearchContainer';
import customFetch from '../utils/customFetch';
import { useLoaderData } from 'react-router-dom';
import { createContext, useContext } from 'react';

const AllJobsContext = createContext();

export const loader = async ({ request }) => {
  try {
    const { data } = await customFetch('/jobs');
    return {
      data,
    };
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return error;
  }
};

const AllJobs = () => {
  const { data } = useLoaderData();

  return (
    <AllJobsContext.Provider value={{ data }}>
      <SearchContainer />
      <JobsContainer />
    </AllJobsContext.Provider>
  );
};

export default AllJobs;
export const useAllJobsContext = () => useContext(AllJobsContext);

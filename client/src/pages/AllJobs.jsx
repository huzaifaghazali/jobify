import { toast } from 'react-toastify';
import JobsContainer from '../components/JobsContainer';
import SearchContainer from '../components/SearchContainer';
import customFetch from '../utils/customFetch';
import { useLoaderData } from 'react-router-dom';
import { createContext, useContext } from 'react';

const AllJobsContext = createContext();

export const loader = async ({ request }) => {
  try {
    // Create an object to store the search parameters from the request URL
    const params = Object.fromEntries([
      ...new URL(request.url).searchParams.entries(),
    ]);

    // Use the customFetch function to make a GET request to the '/jobs' endpoint
    // with the search parameters as the request parameters
    const { data } = await customFetch('/jobs', {
      params,
    });

    // Return an object containing the fetched job data and the search parameters
    return {
      data, // The fetched job data
      searchValues: { ...params }, // The search parameters
    };
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return error;
  }
};

const AllJobs = () => {
  const { data, searchValues } = useLoaderData();

  return (
    <AllJobsContext.Provider value={{ data, searchValues }}>
      <SearchContainer />
      <JobsContainer />
    </AllJobsContext.Provider>
  );
};

export default AllJobs;
export const useAllJobsContext = () => useContext(AllJobsContext);

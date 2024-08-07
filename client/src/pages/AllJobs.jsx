import JobsContainer from '../components/JobsContainer';
import SearchContainer from '../components/SearchContainer';
import customFetch from '../utils/customFetch';
import { useLoaderData } from 'react-router-dom';
import { createContext, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';

const allJobsQuery = (params) => {
  const { search, jobStatus, jobType, sort, page } = params;
  return {
    queryKey: [
      'jobs',
      search ?? '',
      jobStatus ?? 'all',
      jobType ?? 'all',
      sort ?? 'newest',
      page ?? '1',
    ],
    queryFn: async () => {
      const { data } = await customFetch('/jobs', {
        params,
      });
      return data;
    },
  };
};

export const loader =
  (queryClient) =>
  async ({ request }) => {
    // Create an object to store the search parameters from the request URL
    const params = Object.fromEntries([
      ...new URL(request.url).searchParams.entries(),
    ]);

    await queryClient.ensureQueryData(allJobsQuery(params));

    // Return an object containing the search parameters
    return {
      searchValues: { ...params }, // The search parameters
    };
  };

const AllJobsContext = createContext();
const AllJobs = () => {
  const { searchValues } = useLoaderData();
  const { data } = useQuery(allJobsQuery(searchValues));

  return (
    <AllJobsContext.Provider value={{ data, searchValues }}>
      <SearchContainer />
      <JobsContainer />
    </AllJobsContext.Provider>
  );
};

export default AllJobs;
export const useAllJobsContext = () => useContext(AllJobsContext);

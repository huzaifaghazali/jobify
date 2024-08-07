import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import day from 'dayjs';
import Job from '../models/JobModel.js';

export const getAllJobs = async (req, res) => {
  const { search, jobStatus, jobType, sort } = req.query;

  // Create an object to hold the query criteria
  const queryObject = {
    createdBy: req.user.userId, // Only fetch jobs created by the authenticated user
  };

  // If there is a search query, add it to the query criteria
  if (search) {
    queryObject.$or = [
      { position: { $regex: search, $options: 'i' } }, // Search for jobs with matching position
      { company: { $regex: search, $options: 'i' } }, // Search for jobs with matching company
    ];
  }

  // If a job status is provided, add it to the query criteria
  if (jobStatus && jobStatus !== 'all') {
    queryObject.jobStatus = jobStatus;
  }

  // If a job type is provided, add it to the query criteria
  if (jobType && jobType !== 'all') {
    queryObject.jobType = jobType;
  }

  // Define the available sort options
  const sortOptions = {
    newest: '-createdAt', // Sort by creation date in descending order
    oldest: 'createdAt', // Sort by creation date in ascending order
    'a-z': 'position', // Sort by position in ascending order
    'z-a': '-position', // Sort by position in descending order
  };

  // Determine the sorting criteria based on the provided sort parameter
  const sortKey = sortOptions[sort] || sortOptions.newest;

  // Setup pagination
  const page = Number(req.query.page) || 1; // Get the page number from the query parameters, default to 1
  const limit = Number(req.query.limit) || 10; // Get the number of jobs per page from the query parameters, default to 10
  const skip = (page - 1) * limit; // Calculate the number of jobs to skip based on the page number and limit

  // Fetch the jobs from the database based on the query criteria, sorting, and pagination
  const jobs = await Job.find(queryObject)
    .sort(sortKey)
    .skip(skip)
    .limit(limit);

  // Count the total number of jobs matching the query criteria
  const totalJobs = await Job.countDocuments(queryObject);

  // Calculate the number of pages based on the total number of jobs and the limit per page
  const numOfPages = Math.ceil(totalJobs / limit);

  res
    .status(StatusCodes.OK)
    .json({ totalJobs, numOfPages, currentPage: page, jobs });
};

export const getJob = async (req, res) => {
  const { id } = req.params;
  const job = await Job.findById(id);
  res.status(StatusCodes.OK).json({ job });
};

export const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

export const updateJob = async (req, res) => {
  const { id } = req.params;

  const updatedJob = await Job.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  });

  res.status(StatusCodes.OK).json({ msg: 'job modified', job: updatedJob });
};

export const deleteJob = async (req, res) => {
  const { id } = req.params;
  const removedJob = await Job.findOneAndDelete({ _id: id });
  res.status(StatusCodes.OK).json({ msg: 'job deleted', job: removedJob });
};

export const showStats = async (req, res) => {
  // Retrieve job statistics for the user
  let stats = await Job.aggregate([
    // Match jobs created by the authenticated user
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
    // Group jobs by jobStatus and count them
    { $group: { _id: '$jobStatus', count: { $sum: 1 } } },
  ]);

  // Reduce the stats array to an object with jobStatus as keys and count as values
  stats = stats.reduce((acc, curr) => {
    const { _id: title, count } = curr;
    acc[title] = count;
    return acc;
  }, {});

  // Create an object with default job statistics
  const defaultStats = {
    // Set pending to the count of pending jobs or 0 if there are none
    pending: stats.pending || 0,
    // Set interview to the count of interview jobs or 0 if there are none
    interview: stats.interview || 0,
    // Set declined to the count of declined jobs or 0 if there are none
    declined: stats.declined || 0,
  };

  // Retrieve the count of jobs created by the authenticated user grouped by year and month
  let monthlyApplications = await Job.aggregate([
    // Match jobs created by the authenticated user
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
    // Group jobs by year and month of creation
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    // Sort the groups by year and month in descending order
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    // Limit the results to 6
    { $limit: 6 },
  ]);

  // Map the monthlyApplications array to a new array with date and count properties
  monthlyApplications = monthlyApplications
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;

      // Format the date based on the month and year
      const date = day()
        .month(month - 1)
        .year(year)
        .format('MMM YY');
      return { date, count };
    })
    // Reverse the order of the array
    .reverse();

  // Send the defaultStats and monthlyApplications as the response
  res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
};

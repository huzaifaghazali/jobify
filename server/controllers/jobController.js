import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import day from 'dayjs';
import Job from '../models/JobModel.js';

export const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId });
  res.status(StatusCodes.OK).json({ jobs });
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

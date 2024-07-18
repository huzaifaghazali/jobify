import Job from '../models/JobModel.js';
import { StatusCodes } from 'http-status-codes';

export const getAllJobs = async (req, res) => {
  const jobs = await Job.find({});
  res.status(StatusCodes.OK).json({ jobs });
};

export const getJob = async (req, res) => {
  const { id } = req.params;
  const job = await Job.findById(id);
  if (!job) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: `no job with id ${id}` });
  }
  res.status(StatusCodes.OK).json({ job });
};

export const createJob = async (req, res) => {
  const { company, position } = req.body;

  const job = await Job.create({ company, position });
  res.status(StatusCodes.CREATED).json({ job });
};

export const updateJob = async (req, res) => {
  const { id } = req.params;

  const updatedJob = await Job.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  });

  if (!updatedJob) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: `no job with id ${id}` });
  }

  res.status(StatusCodes.OK).json({ msg: 'job modified', job: updatedJob });
};

export const deleteJob = async (req, res) => {
  const { id } = req.params;
  const removedJob = await Job.findOneAndDelete({ _id: id });
  if (!removedJob) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: `no job with id ${id}` });
  }
  res.status(StatusCodes.OK).json({ msg: 'job deleted', job: removedJob });
};

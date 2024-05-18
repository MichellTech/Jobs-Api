const Job = require("../models/job");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors/index");
const { findOne } = require("../models/user");
const { json } = require("express");

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId }).sort("createdAt");
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

const getSingleJob = async (req, res) => {
  const { params, user } = req;

  const singleJob = await Job.findOne({
    _id: params.id,
    createdBy: user.userId,
  });
  if (!singleJob) {
    throw new NotFoundError(`job with id: ${params.id} , does not exist`);
  }
  res.status(StatusCodes.OK).json({ singleJob });
};

const editJob = async (req, res) => {
  const { params, user, body } = req;
  if (!body.company || !body.position) {
    throw new BadRequestError("company and position fields cannot be empty");
  }

  const editJob = await Job.findByIdAndUpdate(
    {
      _id: params.id,
      createdBy: user.userId,
    },
    req.body,
    { new: true, runValidators: true }
  );

  if (!editJob) {
    throw new NotFoundError(`job with id: ${params.id} , does not exist`);
  }
  res.status(StatusCodes.OK).json({ editJob });
};

const deleteJob = async (req, res) => {
  const { params, user } = req;
  const deleteJob = await Job.findOneAndDelete({
    _id: params.id,
    createdBy: user.userId,
  });
  if (!deleteJob) {
    throw new NotFoundError(`job with id: ${params.id} , does not exist`);
  }
  res
    .status(StatusCodes.OK)
    .send(`job with id: ${params.id} deleted successfully`);
};

module.exports = {
  getAllJobs,
  getSingleJob,
  createJob,
  editJob,
  deleteJob,
};

const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const BadRequestError = require("../errors/bad-request");
const NotFoundError = require("../errors/not-found");

// only we will get that job which are associated with that user
const getAllJob = async (req, res) => {
  // getting only those jobs which are associated with that user
  const jobs = await Job.find({ createdBy: req.user.userId }).sort("createdAt");

  // to get all jobs
  // const jobs = await Job.find({}).sort('createdAt')

  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

const getJob = async (req, res) => {
  // nested destruturing
  // userId is which we are passing through middleware
  // and jobId is which we are taking as params in route
  const {
    user: { userId },
    params: { id: jobId },
  } = req;

  const job = await Job.findOne({
    _id: jobId,
    createdBy: userId,
  });

  if (!job) {
    console.log(job);
    throw new NotFoundError(`No job found with id ${jobId} `);
  }

  res.status(StatusCodes.OK).json({ job });
};

const createJob = async (req, res) => {
  // we are setting the createdBy field to the user req from the authentication middleware
  req.body.createdBy = req.user.userId;

  const job = await Job.create(req.body);

  // console.log(req.user);

  res.status(StatusCodes.CREATED).json({ job });
};

const updateJob = async (req, res) => {
    
  // params --> from the route that is id of job
  // user --> from middleware auth
  // body --> data which we are passing to update the current doucment

  const {
    body: { company, position },
    user: { userId },
    params: { id: jobId },
  } = req;

  if (company === "" || position === "") {
    throw new BadRequestError("Position or comapany can note be empty");
  }
  //   1) find document
  //   2) the data from the req
  //   3) the updated document
  const job = await Job.findByIdAndUpdate(
    { _id: jobId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!job) {
    console.log(job);
    throw new NotFoundError(`No job found with id ${jobId} `);
  }

  res.status(StatusCodes.OK).json({ job });

};

const deleteJob = async (req, res) => {

  const {
    user: { userId },
    params: { id: jobId },
  } = req;

  const job = await Job.findByIdAndRemove({
    _id : jobId,
    createdBy: userId
  });

  if (!job) {
    console.log(job);
    throw new NotFoundError(`No job found with id ${jobId} `);
  }

  res.status(StatusCodes.OK).send();

};

module.exports = {
  getAllJob,
  getJob,
  createJob,
  updateJob,
  deleteJob,
};

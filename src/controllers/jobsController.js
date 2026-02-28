const sql = require("../config/db").sql;
const AppError = require("../utils/AppError");
const sendResponse = require("../utils/response");

exports.getAllJobs = async (req, res, next) => {
  try {
    const { search, location, category } = req.query;

    let query = sql`
      SELECT * FROM jobs
      WHERE 1=1
    `;

    if (search) {
      query = sql`
        SELECT * FROM jobs
        WHERE title ILIKE ${"%" + search + "%"}
      `;
    }

    if (location) {
      query = sql`
        SELECT * FROM jobs
        WHERE location ILIKE ${"%" + location + "%"}
      `;
    }

    if (category) {
      query = sql`
        SELECT * FROM jobs
        WHERE category ILIKE ${"%" + category + "%"}
      `;
    }

    const jobs = await query;

    return sendResponse(res, 200, true, "Jobs fetched successfully", jobs);
  } catch (error) {
    next(error);
  }
};

exports.getSingleJob = async (req, res, next) => {
  try {
    const { id } = req.params;

    const job = await sql`
      SELECT * FROM jobs WHERE id = ${id}
    `;

    if (job.length === 0) {
      throw new AppError("Job not found", 404);
    }

    return sendResponse(res, 200, true, "Job fetched successfully", job[0]);
  } catch (error) {
    next(error);
  }
};

exports.createJob = async (req, res, next) => {
  try {
    const { title, company, location, category, description } = req.body;

    const newJob = await sql`
      INSERT INTO jobs (title, company, location, category, description)
      VALUES (${title}, ${company}, ${location}, ${category}, ${description})
      RETURNING *
    `;

    return sendResponse(res, 201, true, "Job created successfully", newJob[0]);
  } catch (error) {
    next(error);
  }
};

exports.deleteJob = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleted = await sql`
      DELETE FROM jobs WHERE id = ${id}
      RETURNING *
    `;

    if (deleted.length === 0) {
      throw new AppError("Job not found", 404);
    }

    return sendResponse(res, 200, true, "Job deleted successfully", deleted[0]);
  } catch (error) {
    next(error);
  }
};

const sql = require("../config/db").sql;
const AppError = require("../utils/AppError");
const sendResponse = require("../utils/response");

exports.createApplication = async (req, res, next) => {
  try {
    const { job_id, name, email, resume_link, cover_note } = req.body;

    const job = await sql`
      SELECT id FROM jobs WHERE id = ${job_id}
    `;

    if (job.length === 0) {
      throw new AppError("Job not found", 404);
    }

    const application = await sql`
      INSERT INTO applications (job_id, name, email, resume_link, cover_note)
      VALUES (${job_id}, ${name}, ${email}, ${resume_link}, ${cover_note})
      RETURNING *
    `;

    return sendResponse(
      res,
      201,
      true,
      "Application submitted successfully",
      application[0],
    );
  } catch (error) {
    next(error);
  }
};

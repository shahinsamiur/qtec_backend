const yup = require("yup");

const createApplicationSchema = yup.object({
  job_id: yup.string().uuid("Invalid job ID").required("Job ID is required"),
  name: yup.string().required("Name is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  resume_link: yup
    .string()
    .url("Resume link must be a valid URL")
    .required("Resume link is required"),
  cover_note: yup.string().optional(),
});

module.exports = {
  createApplicationSchema,
};

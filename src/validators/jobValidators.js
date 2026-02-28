const yup = require("yup");

const createJobSchema = yup.object({
  title: yup.string().required("Job title is required"),
  company: yup.string().required("Company name is required"),
  location: yup.string().required("Location is required"),
  category: yup.string().required("Category is required"),
  description: yup.string().required("Job description is required"),
});

module.exports = {
  createJobSchema,
};

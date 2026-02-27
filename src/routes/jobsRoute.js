const express = require("express");
const jobController = require("../controllers/jobsController");
const { createJobSchema } = require("../validators/jobValidators");
const validate = require("../middleware/validate");

const router = express.Router();

router.get("/", jobController.getAllJobs);
router.get("/:id", jobController.getSingleJob);
router.post("/", validate(createJobSchema), jobController.createJob);
router.delete("/:id", jobController.deleteJob);

module.exports = router;

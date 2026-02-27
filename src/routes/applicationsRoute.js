const express = require("express");
const validate = require("../middleware/validate");
const applicationController = require("../controllers/applicationsController");
const router = express.Router();

router.post(
  "/",
  //   validate(createApplicationSchema),
  applicationController.createApplication,
);

module.exports = router;

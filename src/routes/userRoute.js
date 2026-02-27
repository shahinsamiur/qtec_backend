const express = require("express");
const authController = require("../controllers/authController");
const validate = require("../middleware/validate");
const { registerSchema, loginSchema } = require("../validators/authValidator");

const router = express.Router();

router.get("/register", validate(registerSchema), authController.register);

router.post("/block", validate(loginSchema), authController.login);
router.post("/unblock", validate(loginSchema), authController.login);
router.delete("/delete", validate(loginSchema), authController.login);
router.delete(
  "/delete-unverified",
  validate(loginSchema),
  authController.login,
);
module.exports = router;

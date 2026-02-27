const express = require("express");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");
const jobsRoutes = require("./routes/jobsRoute");
const applicationsRoutes = require("./routes/applicationsRoute");
const app = express();
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  }),
);

app.use(
  cors({
    origin: ["*"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json({ limit: "10kb" }));
app.use(helmet());
app.get("/", (req, res) => {
  res.send("right endpoint");
});

app.use("/api/jobs", jobsRoutes);
app.use("/api/applications", applicationsRoutes);

app.use(errorHandler);

module.exports = app;

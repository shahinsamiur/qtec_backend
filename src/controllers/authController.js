const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sql = require("../config/db").sql;
const AppError = require("../utils/AppError");
const sendResponse = require("../utils/response");

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, solver } = req.body;

    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email}
    `;

    if (existingUser.length > 0) {
      throw new AppError("Email already registered", 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const role = solver ? "solver" : "user";

    const user = await sql`
      INSERT INTO users (name, email, password, role)
      VALUES (${name}, ${email}, ${hashedPassword}, ${role})
      RETURNING id, name, email, role
    `;

    const token = jwt.sign(
      { id: user[0].id, role: user[0].role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
    });

    return sendResponse(
      res,
      201,
      true,
      "User registered successfully",
      user[0],
    );
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const users = await sql`
      SELECT * FROM users WHERE email = ${email}
    `;

    if (users.length === 0) {
      throw new AppError("Invalid email or password", 401);
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new AppError("Invalid email or password", 401);
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return sendResponse(res, 200, true, "Login successful", {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    next(error);
  }
};

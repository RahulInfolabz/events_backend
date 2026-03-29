const connectDB = require("../../db/dbConnect");

async function Login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const db = await connectDB();
    const collection = db.collection("users");
    const user = await collection.findOne({ email, password });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (user.status === "Inactive") {
      return res.status(401).json({
        success: false,
        message: "Your account has been deactivated. Please contact support.",
      });
    }

    // Create session
    req.session.user = { session: user, isAuth: true };
    const userData = req.session.user;

    return res.status(200).json({
      userData,
      success: true,
      message: "Login successful",
    });
  } catch (error) {
    console.error("login.js: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

module.exports = { Login };

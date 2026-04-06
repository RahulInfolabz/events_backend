const express = require("express");
const cors = require("cors");
const session = require("express-session");
const connectDB = require("./db/dbConnect");
require("dotenv").config();

// ── Multer Instances ──────────────────────────────────────────────────────────
const { categoryUpload, eventUpload, profileUpload } = require("./multer/multer");

// ── Common APIs ───────────────────────────────────────────────────────────────
const Logout = require("./apis/common/logout");
const Session = require("./apis/common/session");
const { Login } = require("./apis/common/login");
const { Signup } = require("./apis/common/signup");
const { ChangePassword } = require("./apis/common/changePassword");

// ── Public APIs ───────────────────────────────────────────────────────────────
const { GetCategories } = require("./apis/user/GetCategories");
const { GetEvents } = require("./apis/user/GetEvents");
const { GetEventDetails } = require("./apis/user/GetEventDetails");
const { GetReviews } = require("./apis/user/GetReviews");

// ── User APIs ─────────────────────────────────────────────────────────────────
const { GetProfile } = require("./apis/user/GetProfile");
const { UpdateProfile } = require("./apis/user/UpdateProfile");
const { BookEvent } = require("./apis/user/BookEvent");
const { MyBookings } = require("./apis/user/MyBookings");
const { CancelBooking } = require("./apis/user/CancelBooking");
const { GenOrderId } = require("./apis/user/GenOrderId");
const { VerifyPayment } = require("./apis/user/VerifyPayment");
const { AddReview } = require("./apis/user/AddReview");
const { AddComplaint } = require("./apis/user/AddComplaint");
const { MyComplaints } = require("./apis/user/MyComplaints");

// ── Admin APIs ────────────────────────────────────────────────────────────────
const { GetUsers } = require("./apis/admin/GetUsers");
const { UpdateUserStatus } = require("./apis/admin/UpdateUserStatus");
const { AddCategory } = require("./apis/admin/AddCategory");
const { UpdateCategory } = require("./apis/admin/UpdateCategory");
const { DeleteCategory } = require("./apis/admin/DeleteCategory");
const { GetAdminCategories } = require("./apis/admin/GetCategories");
const { AddEvent } = require("./apis/admin/AddEvent");
const { UpdateEvent } = require("./apis/admin/UpdateEvent");
const { DeleteEvent } = require("./apis/admin/DeleteEvent");
const { GetAdminEvents } = require("./apis/admin/GetEvents");
const { GetBookings } = require("./apis/admin/GetBookings");
const { UpdateBooking } = require("./apis/admin/UpdateBooking");
const { GetPayments } = require("./apis/admin/GetPayments");
const { GetAdminReviews } = require("./apis/admin/GetReviews");
const { GetComplaints } = require("./apis/admin/GetComplaints");
const { ResolveComplaint } = require("./apis/admin/ResolveComplaint");
const { DashboardStats } = require("./apis/admin/DashboardStats");

// ─────────────────────────────────────────────────────────────────────────────

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:5173", "http://localhost:5174"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);


app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// ── Static File Serving ───────────────────────────────────────────────────────
app.use("/uploads/categories", express.static("uploads/categories"));
app.use("/uploads/events", express.static("uploads/events"));
app.use("/uploads/artists", express.static("uploads/artists"));
app.use("/uploads/profiles", express.static("uploads/profiles"));

// ── DB Connect ────────────────────────────────────────────────────────────────
connectDB();

// ─────────────────────────────────────────────────────────────────────────────
//  COMMON APIs
// ─────────────────────────────────────────────────────────────────────────────
app.post("/signup", Signup);
app.post("/login", Login);
app.get("/logout", Logout);
app.get("/session", Session);
app.post("/changePassword", ChangePassword);

// ─────────────────────────────────────────────────────────────────────────────
//  PUBLIC APIs (no auth required)
// ─────────────────────────────────────────────────────────────────────────────
app.get("/categories", GetCategories);
// filters: ?category_id= ?min_price= ?max_price=
app.get("/events", GetEvents);
app.get("/events/:id", GetEventDetails);
app.get("/reviews", GetReviews);

// ─────────────────────────────────────────────────────────────────────────────
//  USER APIs (session required)
// ─────────────────────────────────────────────────────────────────────────────
app.get("/user/profile", GetProfile);
app.post("/user/updateProfile", profileUpload.single("profile_pic"), UpdateProfile);
app.post("/user/bookEvent", BookEvent);
app.get("/user/myBookings", MyBookings);
app.post("/user/cancelBooking", CancelBooking);
app.post("/user/genOrderId", GenOrderId);
app.post("/user/verifyPayment", VerifyPayment);
app.post("/user/addReview", AddReview);
app.post("/user/addComplaint", AddComplaint);
app.get("/user/myComplaints", MyComplaints);

// ─────────────────────────────────────────────────────────────────────────────
//  ADMIN APIs (session required)
// ─────────────────────────────────────────────────────────────────────────────

// Users
app.get("/admin/users", GetUsers);
app.post("/admin/updateUserStatus", UpdateUserStatus);

// Categories
app.post("/admin/addCategory", categoryUpload.single("image"), AddCategory);
app.post("/admin/updateCategory", categoryUpload.single("image"), UpdateCategory);
app.get("/admin/deleteCategory/:id", DeleteCategory);
app.get("/admin/categories", GetAdminCategories);

// Events — event_img + artist_image both handled via eventUpload
app.post(
  "/admin/addEvent",
  eventUpload.fields([
    { name: "event_img", maxCount: 1 },
    { name: "artist_image", maxCount: 1 },
  ]),
  AddEvent
);
app.post(
  "/admin/updateEvent",
  eventUpload.fields([
    { name: "event_img", maxCount: 1 },
    { name: "artist_image", maxCount: 1 },
  ]),
  UpdateEvent
);
app.get("/admin/deleteEvent/:id", DeleteEvent);
app.get("/admin/events", GetAdminEvents);

// Bookings
app.get("/admin/bookings", GetBookings);
app.post("/admin/updateBooking", UpdateBooking);

// Reports
app.get("/admin/payments", GetPayments);
app.get("/admin/reviews", GetAdminReviews);
app.get("/admin/complaints", GetComplaints);
app.post("/admin/resolveComplaint/:id", ResolveComplaint);
app.get("/admin/dashboardStats", DashboardStats);

app.get("/", (req, res) => {
  res.send("Welcome to Events Service Platform API!");
});


// ─────────────────────────────────────────────────────────────────────────────
app.listen(PORT, () =>
  console.log(`✅ Event & Ticket Reservation server started on PORT ${PORT}!`)
);

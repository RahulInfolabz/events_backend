const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = "event_platform";

async function seed() {
  const client = await MongoClient.connect(MONGO_URI);
  const db = client.db(DB_NAME);

  console.log("🌱 Starting seed...");

  // ── Clear existing data ───────────────────────────────────────────────────
  await db.collection("users").deleteMany({});
  await db.collection("categories").deleteMany({});
  await db.collection("events").deleteMany({});
  await db.collection("event_bookings").deleteMany({});
  await db.collection("event_payments").deleteMany({});
  await db.collection("reviews").deleteMany({});
  await db.collection("complaints").deleteMany({});

  console.log("🗑️  Cleared existing collections");

  // ── Users ─────────────────────────────────────────────────────────────────
  const usersResult = await db.collection("users").insertMany([
    {
      name: "Admin User",
      email: "admin@events.com",
      phone_no: "9900000001",
      address: "101, Event Hub, Ahmedabad",
      password: "Admin@123",
      profile_pic: "",
      role: "Admin",
      status: "Active",
      created_at: new Date(),
    },
    {
      name: "Rohan Mehta",
      email: "rohan@gmail.com",
      phone_no: "9900000002",
      address: "22, Satellite Road, Ahmedabad",
      password: "Rohan@123",
      profile_pic: "",
      role: "User",
      status: "Active",
      created_at: new Date(),
    },
    {
      name: "Pooja Shah",
      email: "pooja@gmail.com",
      phone_no: "9900000003",
      address: "45, Vastrapur, Ahmedabad",
      password: "Pooja@123",
      profile_pic: "",
      role: "User",
      status: "Active",
      created_at: new Date(),
    },
  ]);

  const userIds = Object.values(usersResult.insertedIds);
  console.log("✅ Users seeded");

  // ── Categories ────────────────────────────────────────────────────────────
  const categoriesResult = await db.collection("categories").insertMany([
    {
      name: "Singing",
      image: "",
      created_at: new Date(),
    },
    {
      name: "Stand-Up Comedy",
      image: "",
      created_at: new Date(),
    },
    {
      name: "Dance",
      image: "",
      created_at: new Date(),
    },
    {
      name: "Sports",
      image: "",
      created_at: new Date(),
    },
    {
      name: "Theatre",
      image: "",
      created_at: new Date(),
    },
    {
      name: "Food Festival",
      image: "",
      created_at: new Date(),
    },
  ]);

  const categoryIds = Object.values(categoriesResult.insertedIds);
  console.log("✅ Categories seeded");

  // ── Events ────────────────────────────────────────────────────────────────
  const eventsResult = await db.collection("events").insertMany([
    {
      category_id: categoryIds[0], // Singing
      event_name: "Arijit Singh Live Concert",
      event_img: "",
      artist_name: "Arijit Singh",
      artist_image: "",
      price_per_seat: 1500,
      total_seats: 500,
      available_seats: 498,
      address: "GMDC Ground, Ahmedabad, Gujarat",
      lattitute: "23.0562",
      longitude: "72.5922",
      datetime: new Date("2025-12-20T19:00:00"),
      status: "Active",
      created_at: new Date(),
    },
    {
      category_id: categoryIds[0], // Singing
      event_name: "Shreya Ghoshal Musical Night",
      event_img: "",
      artist_name: "Shreya Ghoshal",
      artist_image: "",
      price_per_seat: 1200,
      total_seats: 300,
      available_seats: 300,
      address: "Tagore Hall, Ahmedabad, Gujarat",
      lattitute: "23.0330",
      longitude: "72.5830",
      datetime: new Date("2026-01-15T18:30:00"),
      status: "Active",
      created_at: new Date(),
    },
    {
      category_id: categoryIds[1], // Stand-Up Comedy
      event_name: "Fun Friday - Comedy Night",
      event_img: "",
      artist_name: "Zakir Khan",
      artist_image: "",
      price_per_seat: 800,
      total_seats: 200,
      available_seats: 199,
      address: "Rajpath Club, Ahmedabad, Gujarat",
      lattitute: "23.0204",
      longitude: "72.5067",
      datetime: new Date("2025-12-27T20:00:00"),
      status: "Active",
      created_at: new Date(),
    },
    {
      category_id: categoryIds[2], // Dance
      event_name: "Garba Mahotsav 2025",
      event_img: "",
      artist_name: "Falguni Pathak",
      artist_image: "",
      price_per_seat: 500,
      total_seats: 1000,
      available_seats: 1000,
      address: "Sardar Patel Stadium, Ahmedabad, Gujarat",
      lattitute: "23.0395",
      longitude: "72.5847",
      datetime: new Date("2026-02-05T17:00:00"),
      status: "Active",
      created_at: new Date(),
    },
    {
      category_id: categoryIds[3], // Sports
      event_name: "IPL 2026 — GT vs MI",
      event_img: "",
      artist_name: "Gujarat Titans vs Mumbai Indians",
      artist_image: "",
      price_per_seat: 2500,
      total_seats: 5000,
      available_seats: 5000,
      address: "Narendra Modi Stadium, Ahmedabad, Gujarat",
      lattitute: "23.0907",
      longitude: "72.5960",
      datetime: new Date("2026-03-10T19:30:00"),
      status: "Active",
      created_at: new Date(),
    },
    {
      category_id: categoryIds[5], // Food Festival
      event_name: "Ahmedabad Street Food Festival",
      event_img: "",
      artist_name: "Various Local Chefs",
      artist_image: "",
      price_per_seat: 250,
      total_seats: 800,
      available_seats: 800,
      address: "Law Garden, Ahmedabad, Gujarat",
      lattitute: "23.0251",
      longitude: "72.5619",
      datetime: new Date("2026-01-20T11:00:00"),
      status: "Active",
      created_at: new Date(),
    },
  ]);

  const eventIds = Object.values(eventsResult.insertedIds);
  console.log("✅ Events seeded");

  // ── Bookings ──────────────────────────────────────────────────────────────
  const bookingsResult = await db.collection("event_bookings").insertMany([
    {
      event_id: eventIds[0], // Arijit Singh Concert
      user_id: userIds[1], // Rohan
      seats: 2,
      total_price: 3000,
      date: new Date("2025-12-10T10:30:00"),
      status: "Booked",
      payment_status: "Success",
    },
    {
      event_id: eventIds[2], // Fun Friday Comedy
      user_id: userIds[2], // Pooja
      seats: 1,
      total_price: 800,
      date: new Date("2025-12-15T14:00:00"),
      status: "Booked",
      payment_status: "Success",
    },
    {
      event_id: eventIds[1], // Shreya Ghoshal
      user_id: userIds[1], // Rohan
      seats: 3,
      total_price: 3600,
      date: new Date(),
      status: "Booked",
      payment_status: "Pending",
    },
  ]);

  const bookingIds = Object.values(bookingsResult.insertedIds);
  console.log("✅ Bookings seeded");

  // ── Payments ──────────────────────────────────────────────────────────────
  await db.collection("event_payments").insertMany([
    {
      booking_id: bookingIds[0],
      user_id: userIds[1],
      payment: 3000,
      date: new Date("2025-12-10T10:35:00"),
      razorpay_order_id: "order_demo_001",
      razorpay_payment_id: "pay_demo_001",
      razorpay_signature: "sig_demo_001",
      status: "Success",
    },
    {
      booking_id: bookingIds[1],
      user_id: userIds[2],
      payment: 800,
      date: new Date("2025-12-15T14:05:00"),
      razorpay_order_id: "order_demo_002",
      razorpay_payment_id: "pay_demo_002",
      razorpay_signature: "sig_demo_002",
      status: "Success",
    },
  ]);

  console.log("✅ Payments seeded");

  // ── Reviews ───────────────────────────────────────────────────────────────
  await db.collection("reviews").insertMany([
    {
      user_id: userIds[1],
      booking_id: bookingIds[0],
      review: "Absolutely amazing concert! Arijit Singh's voice was magical. Loved every moment!",
      rating: 5.0,
      created_at: new Date("2025-12-21"),
    },
    {
      user_id: userIds[2],
      booking_id: bookingIds[1],
      review: "Zakir Khan was hilarious! Great venue and well-managed event. Will attend again.",
      rating: 4.5,
      created_at: new Date("2025-12-28"),
    },
  ]);

  console.log("✅ Reviews seeded");

  // ── Complaints ────────────────────────────────────────────────────────────
  await db.collection("complaints").insertMany([
    {
      booking_id: bookingIds[0],
      user_id: userIds[1],
      subject: "Seat Allocation Issue",
      message: "We were assigned seats in the back row despite booking premium category tickets.",
      status: "Pending",
      timestamp: new Date("2025-12-21"),
    },
  ]);

  console.log("✅ Complaints seeded");

  console.log("\n🎉 Seed completed successfully!");
  console.log("──────────────────────────────────────────");
  console.log("👤 Admin   → admin@events.com   / Admin@123");
  console.log("👤 User 1  → rohan@gmail.com    / Rohan@123");
  console.log("👤 User 2  → pooja@gmail.com    / Pooja@123");
  console.log("──────────────────────────────────────────");

  await client.close();
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});

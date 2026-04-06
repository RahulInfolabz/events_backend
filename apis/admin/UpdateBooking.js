const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function UpdateBooking(req, res) {
  try {
    const admin = req.session.user;
    if (!admin || admin.session.role !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const { id, status } = req.body;

    if (!id || !ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Valid booking ID is required",
      });
    }

    if (!["Booked", "Cancelled"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be Booked or Cancelled",
      });
    }

    const db = await connectDB();
    const bookingCollection = db.collection("event_bookings");
    const eventCollection = db.collection("events");

    const booking = await bookingCollection.findOne({ _id: new ObjectId(id) });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // If admin cancels a previously booked ticket → restore seats
    if (status === "Cancelled" && booking.status === "Booked") {
      await eventCollection.updateOne(
        { _id: booking.event_id },
        { $inc: { available_seats: booking.seats } }
      );
    }

    await bookingCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status, updated_at: new Date() } }
    );

    return res.status(200).json({
      success: true,
      message: "Booking updated successfully",
    });
  } catch (error) {
    console.error("UpdateBooking.js: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

module.exports = { UpdateBooking };

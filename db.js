require("dotenv").config();
const mongoose = require("mongoose");

const Trip = require("./models/schemes"); // Import Trip model from your schema file

// MongoDB Atlas connection URI using environment variables
const dbURI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_LINK}`;

mongoose.connect(dbURI);

const db = mongoose.connection;

// Event listeners for MongoDB connection status
db.on("connected", () => console.log("✅ MongoDB connected!"));
db.on("error", (err) => console.error("❌ MongoDB connection error:", err));
db.on("disconnected", () => console.log("⚠️ MongoDB disconnected!"));

// Function to insert a new trip document into the database
async function insertTrip(driver, a, b, when, seats) {
  try {
    const newTrip = new Trip({ driver, a, b, when, seats });
    await newTrip.save();
    console.log("✅ Trip added:", newTrip);
    return newTrip;
  } catch (error) {
    console.error("❌ Error inserting trip:", error);
  }
}

// Function to retrieve all trips from the database
async function getAllTrips() {
  try {
    const rides = await Trip.find(); // Fetch all trips
    return rides;
  } catch (error) {
    console.error("❌ Error fetching rides:", error);
    return [];
  }
}

module.exports = { mongoose, insertTrip, getAllTrips }; // Export functions and mongoose connection

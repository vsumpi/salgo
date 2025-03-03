require("dotenv").config();
const mongoose = require("mongoose");
const Trip = require("./models/schemes"); // Import Trip model

const dbURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@salgo-db.irx0k.mongodb.net/salgo-db?retryWrites=true&w=majority`;

mongoose.connect(dbURI);

const db = mongoose.connection;

db.on("connected", () => console.log("✅ MongoDB connected!"));
db.on("error", (err) => console.error("❌ MongoDB connection error:", err));
db.on("disconnected", () => console.log("⚠️ MongoDB disconnected!"));

// Function to insert a trip
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

async function getAllTrips() {
    try {
      const rides = await Trip.find(); // Fetch all trips
      return rides;
    } catch (error) {
      console.error("❌ Error fetching rides:", error);
      return [];
    }
  }
  
  module.exports = { mongoose, insertTrip, getAllTrips }; // Export the function
  
const mongoose = require("mongoose"); // Import Mongoose

const tripSchema = new mongoose.Schema({  // ✅ Correct way to use Schema
  driver: { type: String, required: true },
  a: { type: String, required: true },
  b: { type: String, required: false },
  when: { type: Date, required: true },
  seats: { type: Number, required: true }
}, { strict: false });  // Allows extra fields

const Trip = mongoose.model("Trip", tripSchema);
module.exports = Trip; // ✅ Export the model correctly

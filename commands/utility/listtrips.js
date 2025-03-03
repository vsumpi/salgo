const { SlashCommandBuilder } = require("discord.js");
const { getAllTrips } = require("../../db");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("listtrips")
    .setDescription("Kilistázza az összes utat"),

  async execute(interaction) {
    console.log("📌 Fetching all trips...");
    const trips = await getAllTrips();

    if (trips.length === 0) {
      await interaction.reply("🚫 No trips found.");
      console.log("🚫 No trips found.");
      return;
    }

    // Format trips as a list
    const tripList = trips.map(trip =>
      `🚗 **Sofőr:** ${trip.driver}\n📍 **Honnan:** ${trip.a} → **Hova:** ${trip.b}\n📅 **Mikor:** ${trip.when.toDateString()}\n🪑 **Férőhely(ek):** ${trip.seats}`
    ).join("\n\n");

    await interaction.reply({ content: `📜 **Elérhető utak:**\n\n${tripList}`});
    console.log(`📜 **Elérhető utak:**\n\n${tripList}`);
  },
};

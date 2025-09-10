const { SlashCommandBuilder } = require("discord.js");
const { insertTrip } = require("../../db");
const dayjs = require("dayjs");

dayjs.locale("hu");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("addtrip")
    .setDescription("Adds a new trip")
    .addStringOption(option =>
      option.setName("a").setDescription("Starting location").setRequired(true))
    .addStringOption(option =>
      option.setName("when").setDescription("Date YYYY.MM.DD hh:mm").setRequired(true))
    .addIntegerOption(option =>
      option.setName("seats").setDescription("Number of seats").setRequired(true))
    .addStringOption(option =>
      option.setName("b").setDescription("Destination").setRequired(false)),

  async execute(interaction) {
    const driver = interaction.user;
    const a = interaction.options.getString("a");

    // Use let for b since it might be reassigned below
    let b = interaction.options.getString("b");
    if (!b) {
      b = process.env.UNIVERSITY_ADDRESS;
    }

    // Parse the date from string input
    const date = dayjs(interaction.options.getString("when"));
    if (!date.isValid()) {
      return await interaction.reply({ content: "❌ Invalid date format. Please use YYYY.MM.DD hh:mm"});
    }

    const seats = interaction.options.getInteger("seats");

    await insertTrip(driver, a, b, date.toDate(), seats);

    await interaction.reply({ content: "✅ Trip added!" });
  },
};

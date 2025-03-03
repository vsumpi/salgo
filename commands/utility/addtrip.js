const { SlashCommandBuilder } = require("discord.js");
const { insertTrip } = require("../../db"); // Import insertTrip

module.exports = {
  data: new SlashCommandBuilder()
    .setName("addtrip")
    .setDescription("Adds a new trip")
    .addStringOption(option =>
      option.setName("a").setDescription("Starting location").setRequired(true))
    .addStringOption(option =>
      option.setName("b").setDescription("Destination").setRequired(true))
    .addStringOption(option =>
      option.setName("when").setDescription("Destination").setRequired(true))
    .addIntegerOption(option =>
      option.setName("seats").setDescription("Number of seats").setRequired(true)),

  async execute(interaction) {
    const driver = interaction.user;
    const a = interaction.options.getString("a");
    const b = interaction.options.getString("b");
    const when = Date.parse(interaction.options.getString("when"));
    const seats = interaction.options.getInteger("seats");

    await insertTrip(driver, a, b, when, seats);
    await interaction.reply({ content: "✅ Trip added!"});
  },
};
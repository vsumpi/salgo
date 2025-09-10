const { SlashCommandBuilder, EmbedBuilder, ThreadMember, GuildMember } = require("discord.js");
const { getAllTrips } = require("../../db");
const dayjs = require("dayjs");


dayjs.locale("hu");

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

    // Format trips as a list string
    const tripList = trips.map(trip =>
      `🚗 **Sofőr:** ${trip.driver}\n` +
      `📍 **Honnan:** ${trip.a} → **Hova:** ${trip.b}\n` +
      `📅 **Mikor:** ${dayjs(trip.when).format("YYYY.MM.DD hh:mm")}\n` +
      `🪑 **Férőhely(ek):** ${trip.seats}`
    ).join("\n\n");


    const ListRidesEmbed = new EmbedBuilder()
      .setTitle("Fuvarok")
      .setDescription("A szerveren meghirdetett fuvarok:")
      .setThumbnail("https://uni-obuda.hu/wp-content/uploads/2024/09/Hir_Kep01.jpg")
      .setColor('#38a8ff')
    // Add each trip as a field in the embed
    trips.forEach((trip, index) => {
      ListRidesEmbed.addFields({
          name: `#${index + 1}\n`,
        value:
            `${trip.driver}\n`+
          `📍 **Kiindulás:** ${trip.a} → *${trip.b}*\n` +
          `📅 **Időpont:** ${dayjs(trip.when).format("YYYY.MM.DD HH:mm")}\n` +
          `🪑 **Férőhely(ek):** ${trip.seats}`,
          inline: true,
        });
    });

    await interaction.reply({ embeds: [ListRidesEmbed] }); //BEKELL CSOMAGOLNI BASZOD, ÉRTED???

    //await interaction.reply({ content: `📜 **Elérhető utak:**\n\n${tripList}` });
    console.log(`📜 **Elérhető utak:**\n\n${tripList}`);
  },
};

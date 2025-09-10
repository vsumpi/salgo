require("dotenv").config();
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { mongoose } = require("./db");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

(async () => {
  try {
    console.log(`⚙️ Connecting to MongoDB...`);
    // Connect mongoose and catch immediate connect errors
    await mongoose.connect(process.env.DB_URI);

    mongoose.connection.once("open", () => {
      console.log("✅ Database connected!");
      console.log("⚙️ Starting Discord bot...");
      client.login(process.env.DC_TOKEN)
        .then(() => console.log("✅ Discord client logged in"))
        .catch(console.error);
    });

    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err);
    });
  } catch (error) {
    console.error("❌ Fatal error:", error);
    process.exit(1);
  }
})();

// Load commands dynamically
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  }
}

// Event handlers
client.once(Events.ClientReady, readyClient => {
  console.log(`✅ salGO started! Logged in as "${readyClient.user.tag}"`);
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) {
    console.error(`⚠️ No command named "${interaction.commandName}" found. Run deploy-commands.js to sync.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'There was an error while executing this command!'});
    } else {
      await interaction.reply({ content: 'There was an error while executing this command!'});
    }
  }
});

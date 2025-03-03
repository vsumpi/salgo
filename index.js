const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, MessageFlags } = require('discord.js');
require("dotenv").config(); // Load .env file
const { mongoose } = require("./db"); // Fix import

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

(async () => {
  try {
    console.log(`⚙️ Connecting to MongoDB...`);
    
    mongoose.connection.once("open", async () => {
      console.log("✅ Database connected!");
      
      console.log("⚙️ Starting Discord bot...");
      client.login(process.env.TOKEN);
    });

  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1); // Stop execution if there's a fatal error
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
	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`⚠️ No command named "${interaction.commandName}" was found. Use <node ./deploy-commands.js> to sync with Discord.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		}
	}
});

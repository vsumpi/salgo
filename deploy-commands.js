const { REST, Routes } = require('discord.js');
require("dotenv").config(); // Load .env file
const { mongoose } = require("./db"); // Fix import to destructure mongoose
const fs = require("fs");
const path = require("path");

const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const token = process.env.TOKEN;

const commands = [];
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const rest = new REST({ version: "10" }).setToken(token);

// Wait for MongoDB connection before deploying commands
mongoose.connection.once("open", async () => { // Fix import usage here
	try {
		console.log("✅ MongoDB connected! Deploying commands...");

		console.log(`⚡ Refreshing ${commands.length} application (/) commands.`);
		const data = await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands }
		);

		console.log(`✅ Successfully reloaded ${data.length} application (/) commands.`);
		process.exit(0); // Exit script after successful deployment
	} catch (error) {
		console.error("❌ Error deploying commands:", error);
		process.exit(1);
	}
});

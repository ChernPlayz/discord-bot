import { Client, IntentsBitField } from "discord.js";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.on("clientReady", async (c) => {
  console.log(`${c.user.username} is online`);
});

client.on("messageCreate", (msg) => {
  if (msg.author.bot) return;

  if (msg.content === "Hi! :D") {
    msg.reply(`Hi! ${msg.author.username}`);
  }
});

client.on("interactionCreate", (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  console.log(interaction);

  if (interaction.commandName === "hello") {
    interaction.reply(`Hello, ${interaction.user.username}!`);
  }

  if (interaction.commandName === "add") {
    const num1 = interaction.options.getNumber("first-number") ?? 0;
    const num2 = interaction.options.getNumber("second-number") ?? 0;

    interaction.reply(`${num1+num2}`);
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
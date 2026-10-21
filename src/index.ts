import { Client, IntentsBitField } from "discord.js";
import dotenv from "dotenv";
import path from "path";
import eventHandler from "./handlers/eventHandler.ts";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

eventHandler(client);

client.login(process.env.DISCORD_BOT_TOKEN);
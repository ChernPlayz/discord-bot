import { Client, IntentsBitField } from "discord.js";
import dotenv from "dotenv";
import path from "path";
import eventHandler from "./handlers/eventHandler";
import connectDB from "./lib/db";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

(async (): Promise<void> => {
  try {
    await connectDB();
    console.log("Connected to DB");

    eventHandler(client);

    await client.login(process.env.DISCORD_BOT_TOKEN);

  } catch (error) {
    console.error(`Error: ${error}`);
  }
})();
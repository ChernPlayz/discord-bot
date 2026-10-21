import { REST, Routes } from "discord.js";
import dotenv from "dotenv";
import path from "path";
import { commands } from "./commands/commands";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

async function RegisterCommands() {
  const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
  const CLIENT_ID = process.env.CLIENT_ID;
  const GUILD_ID = process.env.GUILD_ID;

  if (!DISCORD_BOT_TOKEN) {
    throw new Error("Missing DISCORD_BOT_TOKEN in env variables");
  }
  if (!CLIENT_ID) {
    throw new Error("Missing CLIENT_ID in env variables");
  }
  if (!GUILD_ID) {
    throw new Error("Missing GUILD_ID in env variables");
  }

  const rest = new REST({ version: "10" }).setToken(DISCORD_BOT_TOKEN);

  try{
    console.log("Registering slash commands...");
    commands.forEach((cmd) => {
      console.log(`- Registering command: /${cmd.name}`);
    });
    
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands }
    )

    console.log("Slash commands were registered successfully");
  } catch (err) {
    console.log(`There was an error occured: ${err}`);
  }
};

RegisterCommands();
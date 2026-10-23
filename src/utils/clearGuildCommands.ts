import { Client } from "discord.js";

export default async (client: Client, guildId: string): Promise<void> => {
  try {
    const guild = await client.guilds.fetch(guildId);

    if (!guild) {
      console.log("Guild not found or bot is no longer in it.");
      return;
    }

    await guild.commands.set([]);
    console.log(`Successfully wiped all duplicate guild commands from server: ${guildId}`);

  } catch (error) {
    console.error(`Failed to clear guild commands: ${error}`);
  }
}
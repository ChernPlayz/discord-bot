import { ApplicationCommandManager, Client, GuildApplicationCommandManager } from "discord.js";

export default async (client: Client, guildId?: string): Promise<GuildApplicationCommandManager | ApplicationCommandManager | undefined> => {
  let applicationCommands: GuildApplicationCommandManager | ApplicationCommandManager | undefined;

  if (guildId) {
    // If a guild ID is provided, fetch commands specific to that test server (instant updates)
    const guild = await client.guilds.fetch(guildId);
    applicationCommands = guild.commands;
  } else {
    // Global application commands (takes up to an hour to update globally)
    applicationCommands = await client.application?.commands;
  }

  // Fetch commands to populate the cache
  await applicationCommands?.fetch({});

  return applicationCommands;
}
import { Client, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import path from "path";
import getAllFiles from "./getAllFiles";

interface LocalCommand {
  data: SlashCommandBuilder;
  run: (client: Client, interaction: ChatInputCommandInteraction) => Promise<void> | void;
  deleted?: boolean,
  devOnly?: boolean;
  testOnly?: boolean;
}

export default (exceptions: string[] = []): LocalCommand[] => {
  const localCommands: LocalCommand[] = [];

  const commandCategories: string[] = getAllFiles(
    path.join(__dirname, "..", "commands"),
    true
  )

  for (const commandCategory of commandCategories) {
    const commandFiles: string[] = getAllFiles(commandCategory);

    for (const commandFile of commandFiles) {
      const commandModule = require(commandFile);
      const commandObject = commandModule.default || commandModule;

      if (exceptions.includes(commandObject.data?.name)) {
        continue;
      }

      localCommands.push(commandObject);
    }
  }

  return localCommands;
}
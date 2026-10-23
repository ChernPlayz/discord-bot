import { Client, ChatInputCommandInteraction, SlashCommandBuilder, MessageFlags } from "discord.js";
import { devs, testServer } from "../../../config.json";
import getLocalCommands from "../../utils/getLocalCommands";

interface LocalCommand {
  data: SlashCommandBuilder;
  run: (client: Client, interaction: ChatInputCommandInteraction) => Promise<void> | void;
  deleted?: boolean,
  devOnly?: boolean;
  testOnly?: boolean;
}

export default async (client: Client, interaction: ChatInputCommandInteraction): Promise<void> => {
  // Check if it's a slash cmd
  if (!interaction.isChatInputCommand()) return;

  // Slash commands
  const localCommands: LocalCommand[] = getLocalCommands();

  try {
    const commandObject = localCommands.find(
      (cmd) => cmd.data.name === interaction.commandName
    );

    if (!commandObject) return;

    if (commandObject.devOnly) {
      if (!devs.includes(interaction.user.id)) {
        await interaction.reply({
          content: "Only devs are allowed to run this command",
          flags: [MessageFlags.Ephemeral],
        });
        return;
      }
    }

    if (commandObject.testOnly) {
      if (interaction.guild?.id !== testServer) {
        await interaction.reply({
          content: "This command cannot be run here",
          flags: [MessageFlags.Ephemeral],
        });
        return;
      }
    }

    await commandObject.run(client, interaction);

  } catch (error) {
    console.error(`There was an errror running this command: ${error}`)
  }
}
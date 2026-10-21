import { Client, ChatInputCommandInteraction, PermissionResolvable } from "discord.js";
import { devs, testServer } from "../../../config.json";
import getLocalCommands from "../../utils/getLocalCommands";

interface LocalCommand {
  name: string;
  description: string;
  devOnly?: boolean;
  testOnly?: boolean;
  permissionsRequired?: PermissionResolvable[];
  botPermissions?: PermissionResolvable[];
  callback: (client: Client, interaction: ChatInputCommandInteraction) => Promise<void> | void;
}

export default async (client: Client, interaction: ChatInputCommandInteraction) => {
  if (!interaction.isChatInputCommand()) return;

  // Slash commands
  const localCommands: LocalCommand[] = getLocalCommands();

  try {
    const commandObject = localCommands.find(
      (cmd) => cmd.name === interaction.commandName
    );

    if (!commandObject) return;

    if (commandObject.devOnly) {
      if (!devs.includes(interaction.user.id)) {
        await interaction.reply({
          content: "Only devs are allowed to run this command",
          ephemeral: true,
        });
        return;
      }
    }

    if (commandObject.testOnly) {
      if (interaction.guild?.id !== testServer) {
        await interaction.reply({
          content: "This command cannot be run here",
          ephemeral: true,
        });
        return;
      }
    }

    if (commandObject.permissionsRequired?.length) {
      for (const permission of commandObject.permissionsRequired) {
        const memberPermissions = interaction.member?.permissions;
        if (typeof memberPermissions === "string" || !memberPermissions || !memberPermissions.has(permission)) {
          await interaction.reply({
            content: "Not enough permissions",
            ephemeral: true,
          });
          return;
        }
      }
    }

    if (commandObject.botPermissions?.length) {
      for (const permission of commandObject.botPermissions) {
        const bot = interaction.guild?.members.me;

        if (!bot?.permissions.has(permission)) {
          await interaction.reply({
            content: "I don't have enough permissions",
            ephemeral: true,
          })
          return;
        }
      }
    }

    await commandObject.callback(client, interaction);

  } catch (error) {
    console.error(`There was an errror running this command: ${error}`)
  }
}
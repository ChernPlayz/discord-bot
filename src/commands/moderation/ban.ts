import { ChatInputCommandInteraction, Client, ApplicationCommandOptionType, PermissionFlagsBits } from "discord.js";

export default {
  name: "ban",
  description: "Bans a member from a server",
  options: [
    {
      name: "user",
      description: "The user to ban",
      required: true,
      type: ApplicationCommandOptionType.Mentionable,
    },
    {
      name: "reason",
      description: "The reason for banning",
      type: ApplicationCommandOptionType.String,
    }
  ],
  permissionsRequired: [
    PermissionFlagsBits.Administrator,
  ],
  botPermissions: [
    PermissionFlagsBits.Administrator,
  ],
  callback: async (client: Client, interaction: ChatInputCommandInteraction) => {
    interaction.reply(`Banning...`);
  },
};
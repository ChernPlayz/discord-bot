import { ApplicationCommandOptionType, ChatInputCommandInteraction, Client, Interaction, PermissionFlagsBits } from "discord.js";

export default {
  /**
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client: Client, interaction: ChatInputCommandInteraction) => {
    const userId = interaction.options.getString("user_id");
    const reason = interaction.options.getString("reason") || "No reason provided";
    
    if (!userId) {
      await interaction.reply({
        content: "Please provide a valid user ID.", 
        ephemeral: true
      });
      return;
    }

    await interaction.deferReply({ ephemeral: true });

    if (userId === interaction.guild?.ownerId) {
      await interaction.editReply("You can't unban that user because they're the server owner.");
      return;
    }

    // Unban the user
    try {
      await interaction.guild?.members.unban(userId, reason);
      await interaction.editReply(`Successfully unbanned user with ID: ${userId}\nReason: ${reason}`);

    } catch (error) {
      console.error(`There was an error when unbanning: ${error}`);
      await interaction.editReply("There was an error trying to unban this user.");
    }
  },

  name: "unban",
  description: "Unbans a member from the server",
  options: [
    {
      name: "user_id",
      description: "The userId to unban",
      required: true,
      type: ApplicationCommandOptionType.String,
    },
    {
      name: "reason",
      description: "The reason for unbanning",
      type: ApplicationCommandOptionType.String,
    }
  ],
  permissionsRequired: [
    PermissionFlagsBits.BanMembers,
  ],
  botPermissions: [
    PermissionFlagsBits.BanMembers,
  ],
};
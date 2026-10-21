import { ApplicationCommandOptionType, ChatInputCommandInteraction, Client, Interaction, PermissionFlagsBits } from "discord.js";

export default {
  /**
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client: Client, interaction: ChatInputCommandInteraction) => {
    const targetMemberInput = interaction.options.getUser("member");
    const reason = interaction.options.getString("reason") || "No reason provided";
    
    if (!targetMemberInput) {
      await interaction.reply({
        content: "Please provide a valid user to kick.", 
        ephemeral: true
      });
      return;
    }

    await interaction.deferReply({ ephemeral: true });

    const targetMember = await interaction.guild?.members.fetch(targetMemberInput.id);

    if (!targetMember) {
      await interaction.editReply("That user doesn't exit in this server.");
      return;
    }

    if (targetMember.id === interaction.guild?.ownerId) {
      await interaction.editReply("You can't kick that user because they're the server owner.");
      return;
    }

    // Check role hierarchies
    const targetMemberRolePosition = targetMember.roles.highest.position; // Highest role of the user
    const requestMember = interaction.guild?.members.cache.get(interaction.user.id);
    const requestMemberRolePosition = requestMember?.roles.highest.position ?? 0; // Highest role of user running this cmd
    const botRolePosition = interaction.guild?.members.me?.roles.highest.position ?? 0; // Highest role of the bot

    if (targetMemberRolePosition >= requestMemberRolePosition) {
      await interaction.editReply("You can't kick that user because they have the same/higher role than you.");
      return;
    }

    if (targetMemberRolePosition >= botRolePosition) {
      await interaction.editReply("I can't kick that user because they have the same/higher role than me.");
      return;
    }

    // Kick the user
    try {
      await targetMember.kick(reason);
      await interaction.editReply(`${targetMemberInput} was kicked from the server\nReason: ${reason}`)

    } catch (error) {
      console.error(`There was an error when kicking: ${error}`);
      await interaction.editReply("There was an error trying to kick this user.");
    }
  },

  name: "kick",
  description: "Kicks a member from the server",
  options: [
    {
      name: "member",
      description: "The member to kick",
      required: true,
      type: ApplicationCommandOptionType.User,
    },
    {
      name: "reason",
      description: "The reason for kicking",
      type: ApplicationCommandOptionType.String,
    }
  ],
  permissionsRequired: [
    PermissionFlagsBits.KickMembers,
  ],
  botPermissions: [
    PermissionFlagsBits.KickMembers,
  ],
};
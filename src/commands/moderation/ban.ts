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
        content: "Please provide a valid user to ban.", 
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
      await interaction.editReply("You can't ban that user because they're the server owner.");
      return;
    }

    // Check role hierarchies
    const targetMemberRolePosition = targetMember.roles.highest.position; // Highest role of the user
    const requestMember = interaction.guild?.members.cache.get(interaction.user.id);
    const requestMemberRolePosition = requestMember?.roles.highest.position ?? 0; // Highest role of user running this cmd
    const botRolePosition = interaction.guild?.members.me?.roles.highest.position ?? 0; // Highest role of the bot

    if (targetMemberRolePosition >= requestMemberRolePosition) {
      await interaction.editReply("You can't ban that user because they have the same/higher role than you.");
      return;
    }

    if (targetMemberRolePosition >= botRolePosition) {
      await interaction.editReply("I can't ban that user because they have the same/higher role than me.");
      return;
    }

    // Ban the user
    try {
      await targetMember.ban({ reason });
      await interaction.editReply(`${targetMemberInput} was banned from the server\nReason: ${reason}`)

    } catch (error) {
      console.error(`There was an error when banning: ${error}`);
      await interaction.editReply("There was an error trying to ban this user.");
    }
  },

  name: "ban",
  description: "Bans a member from the server",
  options: [
    {
      name: "member",
      description: "The member to ban",
      required: true,
      type: ApplicationCommandOptionType.User,
    },
    {
      name: "reason",
      description: "The reason for banning",
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
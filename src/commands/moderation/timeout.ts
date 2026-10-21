import { ApplicationCommandOptionType, ChatInputCommandInteraction, Client, Interaction, PermissionFlagsBits, User } from "discord.js";
import ms, { type StringValue } from "ms";

export default {
  /**
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client: Client, interaction: ChatInputCommandInteraction) => {
    const targetMemberInput: User | null = interaction.options.getUser("member");
    const duration = (interaction.options.getString("duration") || "1w") as StringValue;
    const reason: string = interaction.options.getString("reason") || "No reason provided";

    if (!targetMemberInput) {
      await interaction.reply({
        content: "Please provide a valid user to timeout.", 
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
      await interaction.editReply("You can't timeout that user because they're the server owner.");
      return;
    }

    const msDuration = ms(duration);
    if (isNaN(msDuration)) {
      await interaction.editReply("Please provide a valid timeout duration");
      return;
    }

    if (msDuration < 5000 || msDuration > 2.419e9) {
      await interaction.editReply("Timeout duration cannot be less than 5 seconds or more than 28 days");
      return;
    }

    // Check role hierarchies
    const targetMemberRolePosition = targetMember.roles.highest.position; // Highest role of the user
    const requestMember = interaction.guild?.members.cache.get(interaction.user.id);
    const requestMemberRolePosition = requestMember?.roles.highest.position ?? 0; // Highest role of user running this cmd
    const botRolePosition = interaction.guild?.members.me?.roles.highest.position ?? 0; // Highest role of the bot

    if (targetMemberRolePosition >= requestMemberRolePosition) {
      await interaction.editReply("You can't timeout that user because they have the same/higher role than you.");
      return;
    }

    if (targetMemberRolePosition >= botRolePosition) {
      await interaction.editReply("I can't timeout that user because they have the same/higher role than me.");
      return;
    }

    // Timeout the user
    try {
      const { default: prettyMs } = await import("pretty-ms");

      // If user alrd timeout
      if (targetMember.isCommunicationDisabled()) {
        await targetMember.timeout(msDuration, reason);
        await interaction.editReply(`${targetMemberInput}'s timeout has been updated to ${prettyMs(msDuration, { verbose: true })}\nReason: ${reason}`)
      } else {
        await targetMember.timeout(msDuration, reason);
        await interaction.editReply(`${targetMemberInput} was timed out for ${prettyMs(msDuration, { verbose: true })}\nReason: ${reason}`)
      }

    } catch (error) {
      console.error(`There was an error when timeout: ${error}`);
      await interaction.editReply("There was an error trying to timeout this user.");
    }
  },
  name: "timeout",
  description: "Timeout a member from the server",
  options: [
    {
      name: "member",
      description: "The member to timeout",
      required: true,
      type: ApplicationCommandOptionType.User,
    },
    {
      name: "duration",
      description: "Timeout duration (30m, 1h, 1 day)",
      required: true,
      type: ApplicationCommandOptionType.String,
    },
    {
      name: "reason",
      description: "The reason for timeout",
      type: ApplicationCommandOptionType.String,
    },
  ],
  permissionsRequired: [
    PermissionFlagsBits.MuteMembers,
  ],
  botPermissions: [
    PermissionFlagsBits.MuteMembers,
  ],
}
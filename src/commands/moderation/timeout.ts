import { ApplicationIntegrationType, ChatInputCommandInteraction, Client, InteractionContextType, MessageFlags, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import ms, { type StringValue } from "ms";

const data = new SlashCommandBuilder()
  .setName("timeout")
  .setDescription("Timeout a member from the server")
  .setIntegrationTypes(
    ApplicationIntegrationType.GuildInstall
  )
  .setContexts(
    InteractionContextType.Guild
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers)
  .addUserOption((option) =>
    option
      .setName("member")
      .setDescription("The member to timeout")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("duration")
      .setDescription("Timeout duration (30m, 1h, 1 day)")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("reason")
      .setDescription("The reason for timeout")
  )

async function run(client: Client, interaction: ChatInputCommandInteraction) {
  const targetMemberInput = interaction.options.getUser("member", true);
  const duration = (interaction.options.getString("duration", true) || "1w") as StringValue;
  const reason= interaction.options.getString("reason") || "No reason provided";

  if (!targetMemberInput) {
    await interaction.reply({
      content: "Please provide a valid user to timeout.", 
      flags: [MessageFlags.Ephemeral]
    });
    return;
  }

  await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

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
}

export default { 
  data,
  run,
}
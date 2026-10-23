import { ApplicationIntegrationType, ChatInputCommandInteraction, Client, InteractionContextType, MessageFlags, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

const data = new SlashCommandBuilder()
  .setName("kick")
  .setDescription("Kicks a member from the server")
  .setIntegrationTypes(
    ApplicationIntegrationType.GuildInstall
  )
  .setContexts(
    InteractionContextType.Guild
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
  .addUserOption((option) =>
    option
      .setName("member")
      .setDescription("The member to kick")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("reason")
      .setDescription("The reason for kicking")
  )

async function run(client: Client, interaction: ChatInputCommandInteraction) {
  const targetMemberInput = interaction.options.getUser("member", true);
  const reason = interaction.options.getString("reason") || "No reason provided";
  
  if (!targetMemberInput) {
    await interaction.reply({
      content: "Please provide a valid user to kick.", 
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
}

export default { 
  data,
  run,
}
import { ApplicationIntegrationType, ChatInputCommandInteraction, Client, InteractionContextType, MessageFlags, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

const data = new SlashCommandBuilder()
  .setName("unban")
  .setDescription("Unbans a member from the server")
  .setIntegrationTypes(
    ApplicationIntegrationType.GuildInstall
  )
  .setContexts(
    InteractionContextType.Guild
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
  .addStringOption((option) =>
    option
      .setName("user_id")
      .setDescription("The userId to unban")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("reason")
      .setDescription("The reason for unbanning")
  )

async function run(client: Client, interaction: ChatInputCommandInteraction) {
  const userId = interaction.options.getString("user_id", true);
  const reason = interaction.options.getString("reason") || "No reason provided";
  
  if (!userId) {
    await interaction.reply({
      content: "Please provide a valid user ID.", 
      flags: [MessageFlags.Ephemeral]
    });
    return;
  }

  await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

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
}

export default { 
  data,
  run,
}
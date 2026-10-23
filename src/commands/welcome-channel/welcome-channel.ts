import { ApplicationIntegrationType, ChannelType, ChatInputCommandInteraction, Client, InteractionContextType, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import welcomeChannelSetup from "./subcmd-scripts/welcome-channel-setup";
import removeChannelSetup from "./subcmd-scripts/welcome-channel-remove";

const data = new SlashCommandBuilder()
  .setName("welcome-channel")
  .setDescription("A welcome channel for your server")
  .setIntegrationTypes(
    ApplicationIntegrationType.GuildInstall
  )
  .setContexts(
    InteractionContextType.Guild
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .addSubcommand((subcmd) => 
    subcmd
      .setName("setup")
      .setDescription("Setup a channel to send welcome messages in")
      .addChannelOption((option) =>
        option
          .setName("channel")
          .setDescription("The channel to send welcome messages in")
          .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName("custom-message")
          .setDescription("TEMPLATES: {mention-member} {username} {server-name}")
      )
  )
  .addSubcommand((subcmd) =>
    subcmd
      .setName("remove")
      .setDescription("Remove a welcome channel")
      .addChannelOption((option) =>
        option
          .setName("channel")
          .setDescription("The welcome channel to remove")
          .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
          .setRequired(true)
      )
  );

async function run(client: Client, interaction: ChatInputCommandInteraction) {
  const subcommand = interaction.options.getSubcommand();
  if (subcommand === "setup") await welcomeChannelSetup(interaction);
  if (subcommand === "remove") await removeChannelSetup(interaction);
}

export default { 
  data,
  run,
}
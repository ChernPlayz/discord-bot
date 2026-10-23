import { ApplicationIntegrationType, ChatInputCommandInteraction, Client, InteractionContextType, SlashCommandBuilder } from "discord.js";

const data = new SlashCommandBuilder()
  .setName("hello")
  .setDescription("Replies with hello!")
  .setIntegrationTypes(
    ApplicationIntegrationType.GuildInstall,
    ApplicationIntegrationType.UserInstall
  )
  .setContexts(
    InteractionContextType.Guild,
    InteractionContextType.BotDM,
    InteractionContextType.PrivateChannel
  )

async function run(client: Client, interaction: ChatInputCommandInteraction) {
  interaction.reply(`Hello, ${interaction.user}!`);
}

export default { 
  data,
  run,
  // deleted: true,
  // devOnly: true,
  // testOnly: true
}
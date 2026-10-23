import { ApplicationIntegrationType, ChatInputCommandInteraction, Client, InteractionContextType, SlashCommandBuilder } from "discord.js";

const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Pong!")
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
  await interaction.deferReply();
  const reply = await interaction.fetchReply();
  const ping = reply.createdTimestamp - interaction.createdTimestamp;
  
  interaction.editReply(`Pong! Client: ${ping}ms | Websocket: ${client.ws.ping}ms`);
}

export default { 
  data,
  run,
}
import { ApplicationIntegrationType, ChatInputCommandInteraction, Client, EmbedBuilder, InteractionContextType, SlashCommandBuilder } from "discord.js";

const data = new SlashCommandBuilder()
  .setName("embed")
  .setDescription("Send an embed")
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
  const embed = new EmbedBuilder()
    .setTitle("Embed title")
    .setDescription("This is an embed description")
    .setColor("#ff77f1")
    .addFields(
      {
        name: "Field title",
        value: "Some random value",
        inline: true,
      },
      {
        name: "Field title 2",
        value: "Some random value",
        inline: true,
      },
      {
        name: "Field title 3",
        value: "Some random value"
      },
    );
  
  interaction.reply({ embeds: [embed] });
}

export default { 
  data,
  run,
}
import { ApplicationIntegrationType, ChatInputCommandInteraction, Client, InteractionContextType, SlashCommandBuilder } from "discord.js";

const data = new SlashCommandBuilder()
  .setName("add")
  .setDescription("Add 2 numbers")
  .setIntegrationTypes(
    ApplicationIntegrationType.GuildInstall,
    ApplicationIntegrationType.UserInstall
  )
  .setContexts(
    InteractionContextType.Guild,
    InteractionContextType.BotDM,
    InteractionContextType.PrivateChannel
  )
  .addNumberOption((option) =>
    option
      .setName("first-number")
      .setDescription("The first number")
      .setRequired(true)
  )
  .addNumberOption((option) =>
    option
      .setName("second-number")
      .setDescription("The second number")
      .setRequired(true)
  )

async function run(client: Client, interaction: ChatInputCommandInteraction) {
  const num1 = interaction.options.getNumber("first-number", true) ?? 0;
  const num2 = interaction.options.getNumber("second-number", true) ?? 0;

  interaction.reply(`${num1+num2}`);
}

export default { 
  data,
  run,
}
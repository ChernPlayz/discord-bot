import { ChatInputCommandInteraction, Client, EmbedBuilder } from "discord.js";

export default {
  name: "embed",
  description: "Send an embed",
  callback: async (client: Client, interaction: ChatInputCommandInteraction) => {
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
}
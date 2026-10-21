import { ChatInputCommandInteraction, Client } from "discord.js";

export default {
  name: "hello",
  description: "Replies with hello!",
  // devOnly: Boolean,
  // testOnly: Boolean,
  // options: Object[],
  // deleted: Boolean,
  // permissionsRequired,
  // botPermissions,
  callback: async (client: Client, interaction: ChatInputCommandInteraction) => {
    interaction.reply(`Hello, ${interaction.user.username}!`);
  }
}
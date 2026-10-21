import { ChatInputCommandInteraction, Client } from "discord.js";

export default {
  name: "ping",
  description: "Pong!",
  callback: async (client: Client, interaction: ChatInputCommandInteraction) => {
    await interaction.deferReply();
    const reply = await interaction.fetchReply();
    const ping = reply.createdTimestamp - interaction.createdTimestamp;
    
    interaction.editReply(`Pong! Client ${ping}ms | Websocket: ${client.ws.ping}ms`);
  }
};
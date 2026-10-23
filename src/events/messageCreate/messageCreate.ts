import { Client, Message } from "discord.js";

export default (client: Client, msg: Message): void => {
  if (msg.author.bot) return;

  if (msg.content === "Hi! :D") {
    msg.reply(`Hi! ${msg.author.username}`);
  }
}
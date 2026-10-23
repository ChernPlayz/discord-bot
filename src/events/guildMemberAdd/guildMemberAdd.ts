import { GuildMember } from "discord.js";
import welcomeChannelSchema from "../../models/welcomeChannel";

export default async (guildMember: GuildMember): Promise<void> => {
  try {
    if (guildMember.user.bot) return;

    const welcomeConfigs = await welcomeChannelSchema.find({
      guildId: guildMember.guild.id,
    });

    if (!welcomeConfigs.length) return;

    for (const welcomeConfig of welcomeConfigs) {
      const targetChannel = 
        guildMember.guild.channels.cache.get(welcomeConfig.channelId) ||
        (await guildMember.guild.channels.fetch(welcomeConfig.channelId));
      
      // If channel was deleted or not a text-based channel, delete from DB
      if (!targetChannel || !targetChannel.isTextBased()) {
        await welcomeChannelSchema.findOneAndDelete({
          guildId: guildMember.guild.id,
          channelId: welcomeConfig.channelId,
        });
        continue;
      }

      const customMsg = 
        welcomeConfig.customMessage || 
        "Hi, {username}! Welcome to {server-name}";

      const welcomeMsg = customMsg
        .replace("{mention-member}", `${guildMember.user}`)
        .replace("{username}", guildMember.user.username)
        .replace("{server-name}", guildMember.guild.name)

      await targetChannel.send(welcomeMsg);
    }

  } catch (error) {
    console.error(`Error in ${__filename}:\n${error}`)
  }
}
import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import welcomeChannelSchema from "../../../models/welcomeChannel";

export default async (interaction: ChatInputCommandInteraction) => {
  // Remove welcome channel
  try {
    const targetChannel = interaction.options.getChannel("channel", true);
  
    await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

    const query = {
      guildId: interaction.guildId,
      channelId: targetChannel?.id,
    };

    const channelExistsInDB = await welcomeChannelSchema.exists(query);

    if (!channelExistsInDB) {
      await interaction.editReply(`This channel has not been configured for welcome messages`);
      return;
    }

    try {
      await welcomeChannelSchema.findOneAndDelete(query);
      await interaction.editReply(`Removed ${targetChannel} from receiving welcome messages.`);

    } catch (error) {
      await interaction.editReply(`Database error. Please try again in a moment.`);
      console.error(`DB error in ${__filename}:\n${error}`);
    }

  } catch (error) {
    console.error(`There was an error when removing welcome channel: ${error}`);
    await interaction.editReply("There was an error trying to remove welcome channel.");
  }
}
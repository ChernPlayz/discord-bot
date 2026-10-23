import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import welcomeChannelSchema from "../../../models/welcomeChannel";

export default async (interaction: ChatInputCommandInteraction) => {
  // Setup channel
  try {
    const targetChannel = interaction.options.getChannel("channel", true);
    const customMsg = interaction.options.getString("custom-message");

    await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

    const query = {
      guildId: interaction.guildId,
      channelId: targetChannel?.id,
    };

    const channelExistsInDB = await welcomeChannelSchema.exists(query);

    if (channelExistsInDB) {
      await interaction.editReply(`This channel has already been configured for welcome messages`);
      return;
    }

    const newWelcomeChannel = new welcomeChannelSchema({
      ...query,
      customMessage: customMsg,
    });

    try {
      await newWelcomeChannel.save();
      await interaction.editReply(`Configured ${targetChannel} to receive welcome messages.`);

    } catch (error) {
      await interaction.editReply(`Database error. Please try again in a moment.`);
      console.error(`DB error in ${__filename}:\n${error}`);
    }

  } catch (error) {
    console.error(`There was an error when setting up welcome channel: ${error}`);
    await interaction.editReply("There was an error trying to set up welcome channel.");
  }
}
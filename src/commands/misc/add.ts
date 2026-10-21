import { ApplicationCommandOptionType, ChatInputCommandInteraction, Client } from "discord.js";

export default {
  name: "add",
  description: "Add 2 numbers",
  options: [
    {
      name: "first-number",
      description: "The first number.",
      type: ApplicationCommandOptionType.Number,
      choices: [
        {
          name: "one",
          value: 1,
        },
        {
          name: "two",
          value: 2,
        },
        {
          name: "three",
          value: 3,
        },
      ],
      required: true,
    },
    {
      name: "second-number",
      description: "The second number.",
      type: ApplicationCommandOptionType.Number,
      required: true,
    },
  ],
  callback: async (client: Client, interaction: ChatInputCommandInteraction) => {
    const num1 = interaction.options.getNumber("first-number") ?? 0;
    const num2 = interaction.options.getNumber("second-number") ?? 0;

    interaction.reply(`${num1+num2}`);
  }
};
import { ApplicationCommandOptionType, RESTPostAPIApplicationCommandsJSONBody } from "discord.js";

export const commands: RESTPostAPIApplicationCommandsJSONBody[] = [
  {
    name: "hello",
    description: "Replies with hello!",
  },
  {
    name: "add",
    description: "Add 2 numbers.",
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
    ]
  },
];
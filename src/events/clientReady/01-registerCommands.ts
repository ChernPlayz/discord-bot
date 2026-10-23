import { ChatInputCommandInteraction, Client, SlashCommandBuilder } from "discord.js";
import { testServer } from "../../../config.json";
import getLocalCommands from "../../utils/getLocalCommands";
import getApplicationCommands from "../../utils/getApplicationCommands";
import areCommandsDifferent from "../../utils/areCommandsDifferent";

interface LocalCommand {
  data: SlashCommandBuilder;
  run: (client: Client, interaction: ChatInputCommandInteraction) => Promise<void> | void;
  deleted?: boolean,
  devOnly?: boolean;
  testOnly?: boolean;
}

export default async (client: Client): Promise<void> => {
  try {
    const localCommands: LocalCommand[] = getLocalCommands();
    const applicationCommands = await getApplicationCommands(client); // Add testServer for testing
    
    if (!applicationCommands) return;
    
    for (const localCommand of localCommands) {
      const localCommandData = localCommand.data.toJSON();
      if (!localCommandData) continue;

      const { name } = localCommandData;
      
      const existingCommand = await applicationCommands.cache.find(
        (cmd) => cmd.name === name
      );

      const commandPayload = {
        name: localCommandData.name,
        description: localCommandData.description,
        options: localCommandData.options || [],
        defaultMemberPermissions: localCommandData.default_member_permissions,
        type: localCommandData.type,
        integrationTypes: localCommandData.integration_types,
        contexts: localCommandData.contexts,
      }

      if (existingCommand) {
        // Exist in app cmds
        if (localCommand.deleted) {
          await applicationCommands.delete(existingCommand.id);
          console.log(`Deleted command /${name}`);
          continue;
        }

        if (areCommandsDifferent(existingCommand, localCommand)) {
          await applicationCommands.edit(existingCommand.id, commandPayload);
          console.log(`Edited command /${name}`);
        }
      } else {
        // Not exist in app cmds
        if (localCommand.deleted) {
          console.log(`Skipping registering command /${name} as it's set to deleted`);
          continue;
        }

        await applicationCommands.create(commandPayload);
        console.log(`Registered command /${name}`);
      }
    }

  } catch (error) {
    console.log(`There was an error registering command:\n${error}`);
  }
}
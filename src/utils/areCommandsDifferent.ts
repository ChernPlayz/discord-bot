import { ApplicationCommand, ChatInputCommandInteraction, Client, SlashCommandBuilder } from "discord.js";

interface LocalCommand {
  data: SlashCommandBuilder;
  run: (client: Client, interaction: ChatInputCommandInteraction) => Promise<void> | void;
  deleted?: boolean,
  devOnly?: boolean;
  testOnly?: boolean;
}

const areArraysDifferent = (arr1: any[] | null | undefined, arr2: any[] | null | undefined): boolean => {
  const a = arr1 || [];
  const b = arr2 || [];
  if (a.length !== b.length) return true;
  return a.some((val, idx) => val !== b[idx]);
};

const areChoicesDifferent = (existingChoices: any[], localChoices: any[]): boolean => {
  for (const localChoice of localChoices) {
    const existingChoice = existingChoices?.find(
      (choice) => choice.name === localChoice.name
    );

    if (!existingChoice) return true; // Option choices are different

    // Compare choices (Option choices are different)
    if (localChoice.value !== existingChoice.value) {
      console.log(`Option ${existingChoice.name}: "value" is different`);
      return true;
    }
  }
  
  return false; // Option choices are same
};

const areOptionsDifferent = (existingOptions: any[], localOptions: any[]): boolean => {
  for (const localOption of localOptions) {
    const existingOption = existingOptions?.find(
      (option) => option.name === localOption.name
    );

    if (!existingOption) return true; // Cmd options are different
    
    // If have subcmds
    if (localOption.options) {
      if (areOptionsDifferent((existingOption.options || []), localOption.options)) return true;
    }

    // Compare options (Cmd options are different)
    if (localOption.name !== existingOption.name) {
      console.log(`Option ${existingOption.name}: "name" is different`);
      return true;
    }
    if (localOption.description !== existingOption.description) {
      console.log(`Option ${existingOption.name}: "description" is different`);
      return true;
    }
    if (localOption.type !== existingOption.type) {
      console.log(`Option ${existingOption.name}: "type" is different`);
      return true;
    }
    if (Boolean(localOption.required) !== Boolean(existingOption.required)) {
      console.log(`Option ${existingOption.name}: "required" is different`);
      return true;
    }
    if ((localOption.choices?.length || 0) !== (existingOption.choices?.length || 0)) {
      console.log(`Option ${existingOption.name}: "choices length" is different`);
      return true;
    }
    if (areChoicesDifferent((existingOption.choices || []), (localOption.choices || []))) {
      console.log(`Option ${existingOption.name}: "choices" is different`);
      return true;
    }
  }

  return false; // Cmd options are same
};

export default (existingCommand: ApplicationCommand, localCommand: LocalCommand): boolean => {
  /* (BigInt.prototype as any).toJSON = function () {
    return this.toString();
  };
  
  console.log(`
    ----Existing command:
    \n${JSON.stringify(existingCommand)}
    \n----Local command:
    \n${JSON.stringify(localCommand)}
    \n\n`
  ) */
  
  // Compare Discord app cmds & local cmds
  const localCommandData = localCommand.data.toJSON();

  // Compare commands (Cmds are different)
  if (existingCommand.name !== localCommandData.name) {
    console.log(`Command /${existingCommand.name}: "name" is different`);
    return true;
  }
  if (existingCommand.description !== localCommandData.description) {
    console.log(`Command /${existingCommand.name}: "description" is different`);
    return true;
  }
  if (existingCommand.options?.length !== (localCommandData.options?.length || 0)) {
    console.log(`Command /${existingCommand.name}: "options length" is different`);
    return true;
  }
  if (areOptionsDifferent(existingCommand.options, (localCommandData.options || []))) {
    console.log(`Command /${existingCommand.name}: "options" is different`);
    return true;
  }
  if ((existingCommand.defaultMemberPermissions?.bitfield ?? 0).toString() !== (localCommandData.default_member_permissions ?? 0).toString()) {
    console.log(`Command /${existingCommand.name}: "default member permissions" is different`);
    return true;
  }
  if (existingCommand.type !== localCommandData.type) {
    console.log(`Command /${existingCommand.name}: "type" is different`);
    return true;
  }
  // Note: Integration types & contexts doesnt work on test server
  if(areArraysDifferent(existingCommand.integrationTypes, localCommandData.integration_types)) {
    console.log(`Command /${existingCommand.name}: "integration types" is different`);
    return true;
  }
  if (areArraysDifferent(existingCommand.contexts, localCommandData.contexts)) {
    console.log(`Command /${existingCommand.name}: "contexts" is different`);
    return true;
  }
  
  return false; // Cmds are same
};
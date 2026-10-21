import path from "path";
import { Client } from "discord.js";
import getAllFiles from "../utils/getAllFiles";

export default (client: Client) => {
  const eventFolders:string[] = getAllFiles(path.join(__dirname, "..", "events"), true);
  
  for (const eventFolder of eventFolders) {
    const eventFiles: string[] = getAllFiles(eventFolder);
    eventFiles.sort((a,b) => a.localeCompare(b));

    const eventName: string | undefined = eventFolder.replace(/\\/g, '/').split("/").pop();
    
    client.on(eventName as any, async (...args: any[]) => {
      for (const eventFile of eventFiles) {
        const eventModule = require(eventFile);
        const eventFunction = eventModule.default || eventModule;

        if (typeof eventFunction !== "function") {
          console.warn(`[EventHandler] File at ${eventFile} does not export a valid function.`);
          continue;
        }

        await eventFunction(client, ...args);
      }
    });
  }
};
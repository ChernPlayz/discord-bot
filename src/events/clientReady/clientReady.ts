import { Client, ActivityType } from "discord.js";

interface BotStatus {
  name: string;
  type: ActivityType;
  url?: string;
}

const status: BotStatus[] = [
  {
    name: "Chern",
    type: ActivityType.Streaming,
    url: "https://www.youtube.com/@ChernPlayz",
  },
  {
    name: "over the server",
    type: ActivityType.Watching,
  },
  {
    name: "lo-fi beats",
    type: ActivityType.Listening,
  },
];

export default (client: Client): void => {
  console.log(`${client.user?.username} is online`);
  
  setInterval(() => {
    let randomStatusIndex: number = Math.floor(Math.random() * status.length);
    let randomStatus: BotStatus = status[randomStatusIndex];

    client.user?.setActivity(randomStatus);
  }, 10000)
}
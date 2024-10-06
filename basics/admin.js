import { kafka } from "./client.js";

async function init() {
  const admin = kafka.admin();
  console.log("Admin Connecting...!");
  await admin.connect();
  console.log("Admin Connected!");

  console.log("Creating topic...");
  await admin.createTopics({
    topics: [
      {
        topic: "rider-updates",
        numPartitions: 2,
      },
    ],
  });

  console.log("Topic created!");

  console.log("Disconnecting Admin...");
  await admin.disconnect();
  console.log("Admin Disconnected!");
}

init();

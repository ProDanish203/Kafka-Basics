import { kafka } from "./client.js";

const group = process.argv[2] || "user-1";

async function init() {
  const consumer = kafka.consumer({ groupId: group });

  await consumer.connect();
  console.log("Consumer Connected!");

  await consumer.subscribe({
    topics: ["rider-updates"],
    fromBeginning: true,
  });

  await consumer.run({
    eachMessage: async ({ topic, partition, message, heartbeat, pause }) => {
      console.log(
        `[GROUP: ${group}]:[TOPIC:${topic}]: Partition: {${partition}} Rider Update Received: ${message.value.toString()}`
      );
    },
  });

  //   await consumer.disconnect();
  //   console.log("Consumer Disconnected!");
}

init();

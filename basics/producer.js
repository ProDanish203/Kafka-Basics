import { kafka } from "./client.js";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function init() {
  const producer = kafka.producer();

  console.log("Producer Connecting...!");
  await producer.connect();
  console.log("Producer Connected!");

  rl.setPrompt("Enter Name _ Location: ");
  rl.prompt();

  rl.on("line", async (line) => {
    const [riderName, location] = line.split(" ");
    await producer.send({
      topic: "rider-updates",
      messages: [
        {
          key: "rider1",
          partition: location.toLowerCase() === "north" ? 0 : 1,
          value: JSON.stringify({
            riderName,
            location,
          }),
        },
      ],
    });
    rl.prompt();
  }).on("close", async () => {
    await producer.disconnect();
    console.log("Producer Disconnected!");
  });
}

init();

// await producer.send({
//   topic: "rider-updates",
//   messages: [
//     {
//       key: "rider1",
//       partition: 0,
//       value: JSON.stringify({
//         rider_id: 1,
//         location: {
//           lat: 18.558908,
//           lng: 73.791271,
//         },
//       }),
//     },
//   ],
// });

# Kafka - Getting Started

### Topics

- Topics - Channels for streaming data
- Producers - Applications that send data to topics
- Consumers - Applications that read data from topics
- Partitions - Divisions of topics for parallel processing

### Installation

```
docker pull apache/kafka
docker pull confluentinc/cp-kafka
docker pull zookeeper

# Run zookeeper
docker run -p 2181:2181 zookeeper

# Run Kafka
docker run -p 9092:9092 -e KAFKA_ZOOKEEPER_CONNECT=<PRIVATE_IP>:2181 -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://<PRIVATE_IP>:9092 -e KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1 confluentinc/cp-kafka
```

### Kafka Client

```
import { Kafka } from "kafkajs";

export const kafka = new Kafka({
  brokers: ["192.168.56.1:9092"],
  clientId: "basics",
});

```

### Admin

```
async function init() {
  const admin = kafka.admin();
  await admin.connect();

  await admin.createTopics({
    topics: [
      {
        topic: "rider-updates",
        numPartitions: 2,
      },
    ],
  });
  await admin.disconnect();
}
```

### Producer

```
async function init() {
    const producer = kafka.producer();
    await producer.connect();

    await producer.send({
        topic: "rider-updates",
        messages: [
        {
            key: "rider1",
            partition: 0,
            value: JSON.stringify({
                rider_id: 1,
                location: {
                lat: 18.558908,
                lng: 73.791271,
                },
            }),
        },
        ],
    });

    await producer.disconnect();
}

```

### Consumer

```
const group = "group-1";

async function init() {
  const consumer = kafka.consumer({ groupId: group });

  await consumer.connect();

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

  // await consumer.disconnect();

}

```

import { Kafka } from "kafkajs";
import { logger } from "../lib/logger.js";

const formatKey = (key?: string) => key?.replace(/\\n/g, "\n");

export const kafka = new Kafka({
  clientId: "chat-app",
  brokers: [process.env.KAFKA_BROKER!],
  ssl: {
    rejectUnauthorized: false,
    ca: [formatKey(process.env.KAFKA_CA)!],
    cert: formatKey(process.env.KAFKA_CERT)!,
    key: formatKey(process.env.KAFKA_KEY)!,
  },
});

export async function createTopic() {
  const admin = kafka.admin();

  try {
    await admin.connect();

    const topics = await admin.listTopics();

    if (!topics.includes("chat-messages")) {
      await admin.createTopics({
        topics: [
          {
            topic: "chat-messages",
            numPartitions: 2,
            replicationFactor: 1,
          },
        ],
      });

      logger.info("Kafka topic 'chat-messages' created");
    }
  } catch (error) {
    logger.error({ error }, "Kafka topic setup failed");
    throw error;
  } finally {
    await admin.disconnect();
  }
}

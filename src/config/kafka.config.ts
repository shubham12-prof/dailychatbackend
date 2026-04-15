import { Kafka } from "kafkajs";
import fs from "fs";
import path from "path";
import { logger } from "../lib/logger.js";

export const kafka = new Kafka({
  clientId: "chat-app",
  brokers: [process.env.KAFKA_BROKER!],
  ssl: {
    ca: [fs.readFileSync(path.join(process.cwd(), "ca.pem"), "utf-8")],
    cert: fs.readFileSync(path.join(process.cwd(), "service.cert"), "utf-8"),
    key: fs.readFileSync(path.join(process.cwd(), "service.key"), "utf-8"),
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

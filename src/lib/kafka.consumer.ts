import { kafka } from "../config/kafka.config.js";

const consumer = kafka.consumer({ groupId: "chat-group" });
let isConnected = false;

export async function consumeMessages(
  onMessage: (data: {
    id: string;
    message: string;
    name: string;
    group_id: string;
    created_at: string;
  }) => void,
) {
  if (!isConnected) {
    await consumer.connect();
    await consumer.subscribe({
      topic: "chat-messages",
      fromBeginning: false,
    });
    isConnected = true;
  }

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (message.value) {
        const parsed = JSON.parse(message.value.toString());
        onMessage(parsed);
      }
    },
  });
}

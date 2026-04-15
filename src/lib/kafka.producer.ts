import { kafka } from "../config/kafka.config.js";

const producer = kafka.producer();
let isConnected = false;

export async function produceMessage(data: {
  id: string;
  message: string;
  name: string;
  group_id: string;
  created_at: string;
}) {
  if (!isConnected) {
    await producer.connect();
    isConnected = true;
  }

  await producer.send({
    topic: "chat-messages",
    messages: [
      {
        key: data.group_id,
        value: JSON.stringify(data),
      },
    ],
  });
}

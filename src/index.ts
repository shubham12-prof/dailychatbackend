import express from "express";
import type { Application, Request, Response } from "express";
import "dotenv/config";
import cors from "cors";
import Routes from "./routes/index.js";
const app: Application = express();
const PORT = process.env.PORT || 8000;
import { Server } from "socket.io";
import { createServer } from "http";
import { setUpSocket } from "./socket.js";
import { createAdapter } from "@socket.io/redis-streams-adapter";
import redis from "./config/redis.config.js";
import { instrument } from "@socket.io/admin-ui";
import { createTopic } from "./config/kafka.config.js";
import { logger } from "./lib/logger.js";
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "https://admin.socket.io"],
    credentials: true,
  },
  adapter: createAdapter(redis),
});

instrument(io, {
  auth: false,
  mode: "development",
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req: Request, res: Response) => {
  return res.send("It's working");
});

app.use("/api", Routes);
createTopic()
  .then(() => {
    logger.info("Kafka setup complete ✅");
    setUpSocket(io);
    server.listen(PORT, () => logger.info(`Server is running on PORT ${PORT}`));
  })
  .catch((err) => {
    console.error("Kafka topic creation failed:", err);
    process.exit(1);
  });

export { io };

import { Config } from "https://edge.netlify.com";
import { kafka } from "./lib/kafka.ts";
import { EventEmitter } from "node:events";

const messageEmitter = new EventEmitter();

const consumer = kafka.consumer({
  groupId: crypto.randomUUID(),
});

await consumer.connect();
await consumer.subscribe({
  topic: "chat",
});
await consumer.run({
  async eachMessage({ message }) {
    const textMessage = message.value?.toString("utf-8");
    messageEmitter.emit("message", textMessage);
  },
});

export default () => {
  let listener: any = null;
  return new Response(
    new ReadableStream({
      start(controller) {
        listener = (message: string) => {
          controller.enqueue(
            new TextEncoder().encode(`event: message\ndata: ${message}\n\n`)
          );
        };
        messageEmitter.addListener("message", listener);
      },
      cancel() {
        messageEmitter.removeListener("message", listener);
      },
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream",
      },
    }
  );
};

export const config: Config = {
  path: "/api/listen",
};

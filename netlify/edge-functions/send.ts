import type { Config } from "https://edge.netlify.com";
import { kafka } from "./lib/kafka.ts";

const producer = kafka.producer();
await producer.connect();

export default async (request: Request) => {
  await producer.send({
    topic: "chat",
    messages: [{ value: await request.text() }],
  });
  return new Response(null, { status: 200 });
};

export const config: Config = {
  path: "/api/send",
};

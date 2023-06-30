import { Kafka } from "https://esm.sh/kafkajs@2.2.4";

export const kafka = new Kafka({
  brokers: [Deno.env.get("KAFKA_BROKER")!],
  sasl: {
    mechanism: "scram-sha-256",
    username: Deno.env.get("KAFKA_USERNAME")!,
    password: Deno.env.get("KAFKA_PASSWORD")!,
  },
  ssl: true,
});

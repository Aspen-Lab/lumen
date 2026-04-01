import { BlueprintNode } from "@/types/blueprint";

export const promptInputBlueprint: BlueprintNode[] = [
  {
    id: "chat-api",
    type: "api",
    label: "POST /api/chat",
    description: "Send prompt to AI model",
    details: [
      "Request: { prompt, model, context[] }",
      "Response: ReadableStream<token>",
      "Headers: Authorization: Bearer <token>",
    ],
    position: "top-right",
  },
  {
    id: "conversation-db",
    type: "database",
    label: "conversations",
    description: "Store conversation history",
    details: [
      "id: uuid PRIMARY KEY",
      "user_id: uuid REFERENCES users",
      "messages: jsonb[]",
      "created_at: timestamp",
    ],
    position: "bottom-left",
  },
  {
    id: "ws-stream",
    type: "websocket",
    label: "ws://stream",
    description: "Real-time token streaming",
    details: [
      "Event: token { content, index }",
      "Event: done { usage, finish_reason }",
      "Event: error { code, message }",
    ],
    position: "right",
  },
  {
    id: "auth",
    type: "auth",
    label: "Auth Middleware",
    description: "Validate user session",
    details: [
      "JWT verification",
      "Rate limiting: 60 req/min",
      "Usage quota check",
    ],
    position: "top-left",
  },
  {
    id: "prompt-cache",
    type: "cache",
    label: "Redis Cache",
    description: "Cache frequent prompts",
    details: [
      "Key: hash(prompt + model)",
      "TTL: 3600s",
      "Hit rate optimization",
    ],
    position: "bottom-right",
  },
];

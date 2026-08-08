export type ChatRole = "user" | "assistant";

/** A single message kept only in the active browser session. */
export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
}

/** The serializable conversation shape accepted by the chat API. */
export interface ChatRequestMessage {
  role: ChatRole;
  content: string;
}

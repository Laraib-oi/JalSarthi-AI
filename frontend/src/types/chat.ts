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

export type ChatGroundingStatus = "relevant" | "partial" | "none";

/** Source details returned by the server only when a document has trusted metadata. */
export interface ChatGroundingSource {
  documentTitle: string;
  category: string;
  name: string;
  url: string;
  type: string;
  publisher: string;
  lastVerifiedAt: string;
}

export interface ChatGroundingResponse {
  status: ChatGroundingStatus;
  sources: ChatGroundingSource[];
}

/** The successful API response; grounding is calculated exclusively on the server. */
export interface ChatApiResponse {
  message: string;
  grounding: ChatGroundingResponse;
}

import type { Language } from "@/constants/translations";
import type { ChatRequestMessage } from "@/types/chat";

export type ChatCompletionRequest = {
  language: Language;
  messages: ChatRequestMessage[];
};

export interface AiProvider {
  completeChat(request: ChatCompletionRequest): Promise<string>;
}

export class AiProviderError extends Error {
  constructor(
    message: string,
    public readonly code: "AI_NOT_CONFIGURED" | "AI_PROVIDER_ERROR" = "AI_PROVIDER_ERROR"
  ) {
    super(message);
    this.name = "AiProviderError";
  }
}

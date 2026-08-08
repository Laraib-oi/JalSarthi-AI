import type { Language } from "@/constants/translations";
import type { ChatRequestMessage } from "@/types/chat";

export type GroundingStatus = "relevant" | "partial";

export type GroundingSource = {
  name: string;
  url: string;
  type: string;
  publisher: string;
  lastVerifiedAt: string;
};

/** A bounded, server-built representation of retrieved reference material. */
export type GroundingDocument = {
  title: string;
  category: string;
  summary: string;
  sections: Array<{
    heading: string;
    content: string;
  }>;
  source?: GroundingSource;
};

export type GroundingContext = {
  status: GroundingStatus;
  documents: GroundingDocument[];
};

export type ChatCompletionRequest = {
  language: Language;
  messages: ChatRequestMessage[];
  grounding: GroundingContext;
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

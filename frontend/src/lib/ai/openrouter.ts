import "server-only";

import type { AiProvider, ChatCompletionRequest } from "@/lib/ai/types";
import { AiProviderError } from "@/lib/ai/types";

type OpenRouterResponse = {
  choices?: Array<{
    message?: {
      content?: string | null;
    };
  }>;
};

function getSystemInstruction(language: ChatCompletionRequest["language"]) {
  const languageInstruction =
    language === "hi"
      ? "Respond entirely in Hindi, using clear and respectful language."
      : "Respond entirely in English, using clear and respectful language.";

  return [
    "You are JalSarthi AI, a general water-information chat assistant.",
    languageInstruction,
    "The knowledge retrieval layer is not enabled. Never claim access to official government documents, government databases, current scheme data, or a user's local records.",
    "Do not provide scheme-specific application guidance, document search, complaint drafting, voice support, or claim that those services are available.",
    "Give general, clearly qualified water-related information. If a request needs official, current, local, health, legal, emergency, or scheme-specific advice, say that you cannot verify it and direct the user to the relevant official or local authority.",
    "Do not invent facts, sources, eligibility rules, contacts, or policy details. Keep answers concise and avoid implying that JalSarthi is an official source.",
  ].join(" ");
}

export class OpenRouterProvider implements AiProvider {
  constructor(
    private readonly configuration: {
      apiKey: string;
      model: string;
    }
  ) {}

  async completeChat({ language, messages }: ChatCompletionRequest): Promise<string> {
    let response: Response;

    try {
      response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.configuration.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: this.configuration.model,
          messages: [
            { role: "system", content: getSystemInstruction(language) },
            ...messages,
          ],
        }),
        cache: "no-store",
      });
    } catch {
      throw new AiProviderError("The AI provider could not be reached.");
    }

    if (!response.ok) {
      throw new AiProviderError("The AI provider could not complete the request.");
    }

    let payload: OpenRouterResponse;
    try {
      payload = (await response.json()) as OpenRouterResponse;
    } catch {
      throw new AiProviderError("The AI provider returned an invalid response.");
    }

    const content = payload.choices?.[0]?.message?.content?.trim();
    if (!content) {
      throw new AiProviderError("The AI provider returned an empty response.");
    }

    return content;
  }
}

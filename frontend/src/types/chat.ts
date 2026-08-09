export type ChatRole = "user" | "assistant";

/** A server-recognised guided-assistance choice; it is not free-form input. */
export type WaterConservationPlannerSelection =
  | "household-water-conservation"
  | "rainwater-harvesting";

/** A server-recognised complaint-draft category; it is never a submission route. */
export type ComplaintDraftType =
  | "no_water_supply"
  | "water_leakage"
  | "water_quality_concern";

/** Session-only details used to prepare a deterministic complaint draft. */
export type ComplaintDraftRequest = {
  type: ComplaintDraftType;
  description: string;
  location?: string;
  dateOrDuration?: string;
};

/** A single message kept only in the active browser session. */
export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  grounding?: ChatGroundingResponse;
  /** Present only for a locally displayed result of a server-recognised planner choice. */
  plannerSelection?: WaterConservationPlannerSelection;
  /** Present only for a locally displayed deterministic complaint draft. */
  complaintDraftType?: ComplaintDraftType;
  /** Present only for a server-owned official-source discovery result. */
  officialSources?: ChatOfficialSource[];
}

/** The serializable conversation shape accepted by the chat API. */
export interface ChatRequestMessage {
  role: ChatRole;
  content: string;
}

export type ChatGroundingStatus = "relevant" | "partial" | "none";

/** A server-owned result from the static official-source catalogue. */
export interface ChatOfficialSource {
  id: string;
  title: string;
  description: string;
  url: string;
  publisher: string;
  category: string;
  lastVerifiedAt: string;
}

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
  officialSources?: ChatOfficialSource[];
}

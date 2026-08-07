import ChatInputPlaceholder from "@/components/assistant/ChatInputPlaceholder";
import EmptyChatArea from "@/components/assistant/EmptyChatArea";
import QuickServices from "@/components/assistant/QuickServices";
import StatusBanner from "@/components/assistant/StatusBanner";
import WelcomeSection from "@/components/assistant/WelcomeSection";

export const metadata = {
  title: "JalSarthi AI — Assistant | Ministry of Jal Shakti",
  description:
    "AI-powered citizen assistance portal for water governance, schemes, and complaint processes.",
};

export default function AssistantPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <StatusBanner />

      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center px-4 sm:px-6">

  <WelcomeSection />

  <QuickServices />

  <EmptyChatArea />

</div>

      <ChatInputPlaceholder />
    </div>
  );
}

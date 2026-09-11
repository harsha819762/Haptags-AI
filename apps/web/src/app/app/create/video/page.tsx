import { CreatePanel } from "@/components/create-panel";

export default function CreateVideoPage() {
  return (
    <CreatePanel
      kind="videos"
      title="Create — Video"
      description="Text-to-video with duration and resolution control."
      showVideoFields
      promptLabel="Prompt"
      promptPlaceholder="A drone shot flying over a villa community at golden hour"
    />
  );
}

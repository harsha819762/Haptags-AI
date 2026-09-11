import { CreatePanel } from "@/components/create-panel";

export default function CreateImagePage() {
  return (
    <CreatePanel
      kind="images"
      title="Create — Image"
      description="Text-to-image with style presets. Routed to the fastest available provider."
      showStyle
      promptLabel="Prompt"
      promptPlaceholder="A cinematic poster for a 2-acre villa community named LVS Greenwoods"
    />
  );
}

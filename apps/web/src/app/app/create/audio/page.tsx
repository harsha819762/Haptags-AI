import { CreatePanel } from "@/components/create-panel";

export default function CreateAudioPage() {
  return (
    <CreatePanel
      kind="audio"
      title="Create — Audio"
      description="Text-to-speech narration for your videos and ads."
      promptLabel="Script"
      promptPlaceholder="Welcome to LVS Greenwoods — where every home is a retreat."
    />
  );
}

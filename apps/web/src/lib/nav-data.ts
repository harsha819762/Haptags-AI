import type { Status } from "@/components/status-tag";

export const CREATE_ITEMS: { label: string; status: Status }[] = [
  { label: "Image", status: "live" },
  { label: "Video", status: "live" },
  { label: "Audio & voice", status: "live" },
  { label: "Character library", status: "beta" },
  { label: "Upscale", status: "soon" },
  { label: "Camera engine", status: "soon" },
  { label: "Storyboard & scenes", status: "soon" },
];

export const PLATFORM_ITEMS: { label: string; status: Status }[] = [
  { label: "Model router", status: "live" },
  { label: "API", status: "soon" },
  { label: "Docs", status: "soon" },
];

export const STUDIO_ITEMS: { label: string; status: Status }[] = [
  { label: "Cinema Studio", status: "soon" },
  { label: "Marketing Studio", status: "soon" },
];

export const COMPANY_ITEMS = ["About", "Careers", "Contact"];

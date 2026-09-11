import Link from "next/link";
import { MarketingNav } from "@/components/marketing-nav";
import { PromoBanner } from "@/components/promo-banner";
import { TiltCard } from "@/components/tilt-card";
import { StatusTag } from "@/components/status-tag";
import { CREATE_ITEMS, PLATFORM_ITEMS, STUDIO_ITEMS, COMPANY_ITEMS } from "@/lib/nav-data";
import {
  ImageIcon,
  VideoIcon,
  AudioIcon,
  CharacterIcon,
  CameraIcon,
  StoryboardIcon,
  UpscaleIcon,
  RouterIcon,
} from "@/components/icons";

const FEATURES = [
  {
    label: "Image",
    status: "live" as const,
    icon: ImageIcon,
    desc: "Text-to-image, image-to-image, editing, and variations across cinematic, product, and illustration styles.",
  },
  {
    label: "Video",
    status: "live" as const,
    icon: VideoIcon,
    desc: "Text-to-video, image-to-video, and instruction-based video editing with duration and resolution control.",
  },
  {
    label: "Audio & voice",
    status: "live" as const,
    icon: AudioIcon,
    desc: "Text-to-speech with selectable voices for narration, dialogue, and ad voiceover.",
  },
  {
    label: "Model router",
    status: "live" as const,
    icon: RouterIcon,
    desc: "Every generation is scored on cost, quality tier, and latency, then sent to the best available provider.",
  },
  {
    label: "Character library",
    status: "beta" as const,
    icon: CharacterIcon,
    desc: "Register a character once — face, style, references — and reuse it across every generation in a project.",
  },
  {
    label: "Upscale",
    status: "soon" as const,
    icon: UpscaleIcon,
    desc: "Enhance an existing image or video up to 4K without re-generating it from scratch.",
  },
  {
    label: "Camera engine",
    status: "soon" as const,
    icon: CameraIcon,
    desc: "Pan, dolly, orbit, drone, POV — plain-language camera direction the router turns into model instructions.",
  },
  {
    label: "Storyboard & scenes",
    status: "soon" as const,
    icon: StoryboardIcon,
    desc: "Organize a project into scenes and shots, each with its own character, location, and camera direction.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "You write a brief",
    desc: "A prompt, a reference image, or a full shot list — whatever level of direction you already have.",
  },
  {
    n: "02",
    title: "The router picks the model",
    desc: "Cost, quality tier, duration, and resolution decide which underlying provider runs the job — not you.",
  },
  {
    n: "03",
    title: "You get a consistent result",
    desc: "Same character, same world, same style — across every image and shot in the project.",
  },
];

const PLANS = [
  { name: "Free", price: "₹0", credits: "100 credits / month", cta: "Start free" },
  { name: "Pro", price: "₹1,499", period: "/mo", credits: "2,000 credits / month", cta: "Start Pro" },
  { name: "Creator", price: "₹4,999", period: "/mo", credits: "8,000 credits / month", cta: "Start Creator" },
  { name: "Team", price: "Custom", credits: "Pooled credits, seats, brand kit", cta: "Talk to us" },
];

const STYLES = [
  "Cinematic",
  "Realistic",
  "Anime",
  "Product photography",
  "Illustration",
  "Advertising",
  "Fashion",
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0A0B0D] text-[#F3F1EC] overflow-x-clip">
      <PromoBanner />
      <MarketingNav />

      {/* Hero */}
      <section className="grain relative max-w-6xl mx-auto px-6 pt-20 pb-16">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full blur-[120px] opacity-30"
          style={{
            background:
              "radial-gradient(closest-side, #E8963C, transparent 70%), radial-gradient(closest-side at 70% 30%, #3E6FB0, transparent 60%)",
          }}
        />

        <div className="relative">
          <span className="font-mono text-xs tracking-[0.16em] uppercase text-[#E8963C]">
            AI Creative Studio
          </span>
          <h1 className="font-serif font-bold text-4xl sm:text-6xl leading-[1.08] max-w-3xl text-balance mt-5">
            Tell it the shot.{" "}
            <span className="bg-gradient-to-r from-[#E8963C] to-[#F6D9A8] bg-clip-text text-transparent">
              It picks the model
            </span>
            , keeps your characters consistent, and delivers the cut.
          </h1>
          <p className="text-[#A9A6A0] text-lg max-w-xl mt-6">
            Haptags is the workflow layer over image, video, and voice generation — not another
            model picker. One brief in, a finished asset out.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <Link
              href="/signup"
              className="px-5 py-2.5 rounded-md bg-[#E8963C] text-[#1A1204] font-medium transition-all hover:bg-[#F2A94E] hover:shadow-[0_0_28px_-6px_#E8963C99] hover:-translate-y-0.5"
            >
              Start creating
            </Link>
            <Link
              href="/login"
              className="px-5 py-2.5 rounded-md border border-white/15 font-medium hover:bg-white/5 hover:-translate-y-0.5 transition-all"
            >
              I have an account
            </Link>
          </div>
        </div>

        <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16">
          {[
            { tag: "IMAGE", desc: "cinematic poster", grad: "conic-gradient(from 200deg, #3A2A12, #1A1204, #0A0B0D)" },
            { tag: "VIDEO", desc: "drone establishing shot", grad: "conic-gradient(from 140deg, #122A2E, #0F1A1C, #0A0B0D)" },
            { tag: "AUDIO", desc: "narrated voiceover", grad: "conic-gradient(from 80deg, #241230, #170D1C, #0A0B0D)" },
          ].map((tile) => (
            <TiltCard key={tile.tag} className="[transform-style:preserve-3d]">
              <div
                className="group aspect-video rounded-lg border border-white/10 flex flex-col justify-end p-4 overflow-hidden relative cursor-default"
                style={{ background: tile.grad }}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background:
                      "radial-gradient(180px circle at var(--glow-x,50%) var(--glow-y,50%), rgba(255,255,255,0.12), transparent 70%)",
                  }}
                />
                <span className="relative font-mono text-xs tracking-[0.14em] text-[#F3F1EC]">{tile.tag}</span>
                <span className="relative text-xs text-[#A9A6A0] mt-0.5">{tile.desc}</span>
              </div>
            </TiltCard>
          ))}
        </div>

        <div className="relative mt-10 border-t border-white/10 pt-6 overflow-hidden">
          <div className="marquee-track gap-10 text-sm text-[#6E6B66]">
            {[...STYLES, ...STYLES].map((s, i) => (
              <span key={i} className="whitespace-nowrap font-mono uppercase tracking-wider text-xs">
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <section id="product" className="max-w-6xl mx-auto px-6 py-20 border-t border-white/10">
        <h2 className="font-serif font-bold text-2xl sm:text-3xl max-w-lg">
          Everything a creative team needs, in one place
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
          {FEATURES.map((f) => (
            <TiltCard key={f.label}>
              <div className="group h-full border border-white/10 rounded-lg p-5 bg-white/[0.03] transition-colors hover:border-[#E8963C]/40 hover:bg-white/[0.05]">
                <div className="flex items-center justify-between mb-3">
                  <f.icon className="w-5 h-5 text-[#E8963C]" />
                  <StatusTag status={f.status} />
                </div>
                <div className="font-mono text-xs uppercase tracking-wider text-[#F3F1EC] mb-2">
                  {f.label}
                </div>
                <p className="text-sm text-[#A9A6A0] leading-relaxed">{f.desc}</p>
              </div>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* Differentiator */}
      <section className="max-w-6xl mx-auto px-6 py-20 border-t border-white/10">
        <h2 className="font-serif font-bold text-2xl sm:text-3xl max-w-lg">Workflow, not weights</h2>
        <p className="text-[#A9A6A0] max-w-xl mt-3">
          Image and video models are commodities. The router that picks the right one for the
          job — and the character and world system that keeps output consistent — is the part
          you never have to think about.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
          {STEPS.map((s, i) => (
            <div key={s.n} className="relative pl-0">
              <div className="flex items-center gap-3 mb-3">
                <span className="font-mono text-sm text-[#E8963C]">{s.n}</span>
                {i < STEPS.length - 1 && (
                  <span className="hidden sm:block flex-1 h-px bg-gradient-to-r from-white/15 to-transparent" />
                )}
              </div>
              <h3 className="font-medium mb-2">{s.title}</h3>
              <p className="text-sm text-[#A9A6A0] leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-6xl mx-auto px-6 py-20 border-t border-white/10">
        <h2 className="font-serif font-bold text-2xl sm:text-3xl">Simple, credit-based pricing</h2>
        <p className="text-[#A9A6A0] mt-3">Credits are only spent when a generation completes.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
          {PLANS.map((p, i) => (
            <div
              key={p.name}
              className={`relative border rounded-lg p-5 flex flex-col transition-colors ${
                i === 1
                  ? "border-[#E8963C]/50 bg-[#E8963C]/[0.06]"
                  : "border-white/10 bg-white/[0.03] hover:border-white/20"
              }`}
            >
              {i === 1 && (
                <span className="absolute -top-2.5 left-5 px-2 py-0.5 rounded-full bg-[#E8963C] text-[#1A1204] text-[10px] font-mono uppercase tracking-wider">
                  Popular
                </span>
              )}
              <div className="font-medium mb-1">{p.name}</div>
              <div className="font-serif font-bold text-2xl mb-1">
                {p.price}
                {p.period && <span className="text-sm font-sans font-normal text-[#A9A6A0]">{p.period}</span>}
              </div>
              <div className="text-xs text-[#6E6B66] mb-6">{p.credits}</div>
              <Link
                href="/signup"
                className={`mt-auto text-sm text-center px-3 py-2 rounded-md transition-colors ${
                  i === 1
                    ? "bg-[#E8963C] text-[#1A1204] font-medium hover:bg-[#F2A94E]"
                    : "border border-white/15 hover:bg-white/5"
                }`}
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative max-w-6xl mx-auto px-6 py-24 border-t border-white/10 text-center overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] rounded-full blur-[110px] opacity-20"
          style={{ background: "radial-gradient(closest-side, #E8963C, transparent 70%)" }}
        />
        <h2 className="relative font-serif font-bold text-3xl sm:text-4xl max-w-2xl mx-auto text-balance">
          Start with 100 free credits. No card required.
        </h2>
        <Link
          href="/signup"
          className="relative inline-block mt-8 px-6 py-3 rounded-md bg-[#E8963C] text-[#1A1204] font-medium transition-all hover:bg-[#F2A94E] hover:shadow-[0_0_28px_-6px_#E8963C99] hover:-translate-y-0.5"
        >
          Create your account
        </Link>
      </section>

      <footer className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-2 sm:grid-cols-4 gap-8">
          <FooterColumn title="Create" items={CREATE_ITEMS} />
          <FooterColumn title="Platform" items={PLATFORM_ITEMS} />
          <FooterColumn title="Studios" items={STUDIO_ITEMS} />
          <div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-[#6E6B66] mb-3">Company</div>
            <ul className="flex flex-col gap-2.5">
              {COMPANY_ITEMS.map((label) => (
                <li key={label} className="text-sm text-[#6E6B66] cursor-default">
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 pb-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#6E6B66]">
          <span>© 2026 Haptags LLP. All rights reserved.</span>
          <div className="flex items-center gap-5">
            <a
              href="https://www.haptags.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#F3F1EC] transition-colors"
            >
              AI
            </a>
            <span className="cursor-default">Privacy</span>
            <span className="cursor-default">Terms</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FooterColumn({
  title,
  items,
}: {
  title: string;
  items: { label: string; status: "live" | "beta" | "soon" }[];
}) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-wider text-[#6E6B66] mb-3">{title}</div>
      <ul className="flex flex-col gap-2.5">
        {items.map((item) => (
          <li key={item.label}>
            {item.status === "soon" ? (
              <span className="flex items-center gap-2 text-sm text-[#6E6B66] cursor-default">
                {item.label}
                <StatusTag status={item.status} />
              </span>
            ) : (
              <Link
                href="/signup"
                className="flex items-center gap-2 text-sm text-[#A9A6A0] hover:text-[#F3F1EC] transition-colors"
              >
                {item.label}
                <StatusTag status={item.status} />
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

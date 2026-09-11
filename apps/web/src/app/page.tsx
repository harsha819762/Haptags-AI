import Link from "next/link";

const FEATURES = [
  {
    label: "Image",
    desc: "Text-to-image, image-to-image, editing, and variations across cinematic, product, and illustration styles.",
  },
  {
    label: "Video",
    desc: "Text-to-video, image-to-video, and instruction-based video editing with duration and resolution control.",
  },
  {
    label: "Audio & voice",
    desc: "Text-to-speech with selectable voices for narration, dialogue, and ad voiceover.",
  },
  {
    label: "Character library",
    desc: "Register a character once — face, style, references — and reuse it across every generation in a project.",
  },
  {
    label: "Camera engine",
    desc: "Pan, dolly, orbit, drone, POV — plain-language camera direction the router turns into model instructions.",
  },
  {
    label: "Storyboard & scenes",
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

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0A0B0D] text-[#F3F1EC]">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-[#0A0B0D]/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-serif font-bold text-lg tracking-tight">Haptags</span>
          <nav className="hidden sm:flex items-center gap-6 text-sm text-[#A9A6A0]">
            <a href="#product" className="hover:text-[#F3F1EC] transition-colors">
              Product
            </a>
            <a href="#pricing" className="hover:text-[#F3F1EC] transition-colors">
              Pricing
            </a>
            <span className="text-[#6E6B66] cursor-default">API</span>
            <span className="text-[#6E6B66] cursor-default">Enterprise</span>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/login" className="px-3 py-1.5 text-sm text-[#A9A6A0] hover:text-[#F3F1EC] transition-colors">
              Log in
            </Link>
            <Link
              href="/signup"
              className="px-3.5 py-1.5 rounded-md bg-[#E8963C] text-[#1A1204] text-sm font-medium hover:bg-[#F2A94E] transition-colors"
            >
              Sign up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16">
        <span className="font-mono text-xs tracking-[0.16em] uppercase text-[#E8963C]">
          AI Creative Studio
        </span>
        <h1 className="font-serif font-bold text-4xl sm:text-6xl leading-[1.08] max-w-3xl text-balance mt-5">
          Tell it the shot. It picks the model, keeps your characters consistent, and delivers the cut.
        </h1>
        <p className="text-[#A9A6A0] text-lg max-w-xl mt-6">
          Haptags is the workflow layer over image, video, and voice generation — not another
          model picker. One brief in, a finished asset out.
        </p>
        <div className="flex flex-wrap gap-3 mt-8">
          <Link
            href="/signup"
            className="px-5 py-2.5 rounded-md bg-[#E8963C] text-[#1A1204] font-medium hover:bg-[#F2A94E] transition-colors"
          >
            Start creating
          </Link>
          <Link
            href="/login"
            className="px-5 py-2.5 rounded-md border border-white/15 font-medium hover:bg-white/5 transition-colors"
          >
            I have an account
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16">
          {[
            { tag: "IMAGE", grad: "from-[#3A2A12] to-[#0A0B0D]" },
            { tag: "VIDEO", grad: "from-[#122A2E] to-[#0A0B0D]" },
            { tag: "AUDIO", grad: "from-[#241230] to-[#0A0B0D]" },
          ].map((tile) => (
            <div
              key={tile.tag}
              className={`aspect-video rounded-lg border border-white/10 bg-gradient-to-br ${tile.grad} flex items-end p-4`}
            >
              <span className="font-mono text-xs tracking-[0.14em] text-[#A9A6A0]">{tile.tag}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Feature grid */}
      <section id="product" className="max-w-6xl mx-auto px-6 py-20 border-t border-white/10">
        <h2 className="font-serif font-bold text-2xl sm:text-3xl max-w-lg">
          Everything a creative team needs, in one place
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
          {FEATURES.map((f) => (
            <div key={f.label} className="border border-white/10 rounded-lg p-5 bg-white/[0.03]">
              <div className="font-mono text-xs uppercase tracking-wider text-[#E8963C] mb-2">
                {f.label}
              </div>
              <p className="text-sm text-[#A9A6A0] leading-relaxed">{f.desc}</p>
            </div>
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
          {STEPS.map((s) => (
            <div key={s.n}>
              <div className="font-mono text-sm text-[#E8963C] mb-3">{s.n}</div>
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
          {PLANS.map((p) => (
            <div key={p.name} className="border border-white/10 rounded-lg p-5 bg-white/[0.03] flex flex-col">
              <div className="font-medium mb-1">{p.name}</div>
              <div className="font-serif font-bold text-2xl mb-1">
                {p.price}
                {p.period && <span className="text-sm font-sans font-normal text-[#A9A6A0]">{p.period}</span>}
              </div>
              <div className="text-xs text-[#6E6B66] mb-6">{p.credits}</div>
              <Link
                href="/signup"
                className="mt-auto text-sm text-center px-3 py-2 rounded-md border border-white/15 hover:bg-white/5 transition-colors"
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-6xl mx-auto px-6 py-20 border-t border-white/10 text-center">
        <h2 className="font-serif font-bold text-3xl sm:text-4xl max-w-2xl mx-auto text-balance">
          Start with 100 free credits. No card required.
        </h2>
        <Link
          href="/signup"
          className="inline-block mt-8 px-6 py-3 rounded-md bg-[#E8963C] text-[#1A1204] font-medium hover:bg-[#F2A94E] transition-colors"
        >
          Create your account
        </Link>
      </section>

      <footer className="border-t border-white/10 py-8 text-center text-xs text-[#6E6B66]">
        Haptags LLP
      </footer>
    </div>
  );
}

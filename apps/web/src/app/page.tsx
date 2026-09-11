import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between px-6 py-5 border-b border-[#DCE3EA] max-w-6xl w-full mx-auto">
        <span className="font-serif font-bold text-lg tracking-tight">Haptags</span>
        <nav className="flex items-center gap-3 text-sm">
          <Link href="/login" className="px-3 py-1.5 text-[#46566A] hover:text-[#131B24]">
            Log in
          </Link>
          <Link
            href="/signup"
            className="px-3.5 py-1.5 rounded-md bg-[#2A78D6] text-white hover:bg-[#1E5AA8] transition-colors"
          >
            Sign up
          </Link>
        </nav>
      </header>

      <section className="flex-1 max-w-6xl w-full mx-auto px-6 py-20 flex flex-col items-start gap-6">
        <span className="font-mono text-xs tracking-[0.16em] uppercase text-[#2A78D6]">
          AI Creative Studio
        </span>
        <h1 className="font-serif font-bold text-4xl sm:text-5xl leading-[1.1] max-w-2xl text-balance">
          Turn a one-line brief into image, video, and audio — without picking a model.
        </h1>
        <p className="text-[#46566A] text-lg max-w-xl">
          Haptags routes every generation to the right underlying model, keeps your
          projects and characters consistent, and bills you in simple credits.
        </p>
        <div className="flex gap-3 pt-2">
          <Link
            href="/signup"
            className="px-5 py-2.5 rounded-md bg-[#2A78D6] text-white font-medium hover:bg-[#1E5AA8] transition-colors"
          >
            Start creating
          </Link>
          <Link
            href="/login"
            className="px-5 py-2.5 rounded-md border border-[#DCE3EA] font-medium hover:bg-white transition-colors"
          >
            I have an account
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-16 w-full">
          {[
            { label: "Image", desc: "Text-to-image, image-to-image, variations, style presets." },
            { label: "Video", desc: "Text-to-video and image-to-video with duration and resolution control." },
            { label: "Audio", desc: "Text-to-speech with selectable voices for narration and dialogue." },
          ].map((f) => (
            <div key={f.label} className="border border-[#DCE3EA] rounded-lg p-5 bg-white">
              <div className="font-mono text-xs uppercase tracking-wider text-[#8A97A6] mb-2">
                {f.label}
              </div>
              <p className="text-sm text-[#46566A]">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-[#DCE3EA] py-6 text-center text-xs text-[#8A97A6]">
        Haptags LLP
      </footer>
    </main>
  );
}

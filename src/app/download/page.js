"use client";
import { useEffect, useState } from "react";
import {
  Heart,
  Download,
  Star,
  Sparkles,
  ShieldCheck,
  MessageCircle,
  Video,
  Lock,
  Users,
  Search,
  ChevronDown,
  Smartphone,
  CheckCircle2,
  ArrowRight,
  QrCode,
  ScanLine,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BRAND, APK } from "@/lib/constants";

/* Real app screenshots (public/screens) */
const S = {
  discover: "/screens/shot10.jpg",
  chat: "/screens/shot7.jpg",
  matched: "/screens/shot9.jpg",
  messages: "/screens/shot8.jpg",
  profile: "/screens/shot1.jpg",
  videoCall: "/screens/shot4.jpg",
  audioCall: "/screens/shot5.jpg",
  notifications: "/screens/shot2.jpg",
  safety: "/screens/shot6.jpg",
  welcome: "/screens/shot11.jpg",
};
const GALLERY = [S.discover, S.messages, S.chat, S.profile, S.videoCall, S.notifications, S.welcome];

export default function DownloadPage() {
  useEffect(() => {
    document.title = `Download ${BRAND} — Find your person`;
  }, []);
  return (
    <div className="bg-white text-plum overflow-x-hidden">
      <Nav />
      <Hero />
      <StatsBand />
      <FeatureGrid />
      <Showcase />
      <ScanSection />
      <Gallery />
      <HowItWorks />
      <Faq />
      <CtaBand />
      <Footer />
    </div>
  );
}

/* ---------------- Building blocks ---------------- */
function DownloadButton({ className, size = "lg", label = "Download APK", sublabel, href = APK.url }) {
  const external = /^https?:/.test(href);
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer noopener" : undefined}
      className={cn(
        "group inline-flex items-center justify-center gap-2.5 grad-heart text-white font-extrabold rounded-2xl shadow-lg shadow-brand-500/30 hover:shadow-brand-500/50 hover:-translate-y-0.5 transition-all duration-200",
        size === "lg" ? "h-14 px-8 text-[15px]" : "h-11 px-5 text-sm",
        className
      )}
    >
      <Download size={size === "lg" ? 20 : 17} className="group-hover:translate-y-0.5 transition-transform" />
      <span className="flex flex-col items-start leading-none">
        {label}
        {sublabel && <span className="text-[10px] font-semibold text-white/80 mt-0.5">{sublabel}</span>}
      </span>
    </a>
  );
}

/** Two clearly-labelled download choices — universal (all devices) + latest. */
function DualDownload({ center, onDark }) {
  return (
    <div className={cn("flex flex-wrap gap-3", center && "justify-center")}>
      {/* Primary: all devices (universal) */}
      <a
        href={APK.universal}
        target="_blank"
        rel="noreferrer noopener"
        className={cn(
          "group inline-flex items-center gap-2.5 rounded-2xl h-14 px-7 font-extrabold shadow-lg hover:-translate-y-0.5 transition-all duration-200",
          onDark ? "bg-white text-brand-600" : "grad-heart text-white shadow-brand-500/30"
        )}
      >
        <Download size={20} className="group-hover:translate-y-0.5 transition-transform" />
        <span className="flex flex-col items-start leading-none">
          All devices
          <span className={cn("text-[10px] font-semibold mt-0.5", onDark ? "text-brand-400" : "text-white/80")}>
            Universal · works everywhere
          </span>
        </span>
      </a>
      {/* Secondary: latest / modern devices */}
      <a
        href={APK.modern}
        target="_blank"
        rel="noreferrer noopener"
        className={cn(
          "group inline-flex items-center gap-2.5 rounded-2xl h-14 px-7 font-extrabold border-2 hover:-translate-y-0.5 transition-all duration-200",
          onDark ? "border-white/40 text-white hover:bg-white/10" : "border-brand-200 text-brand-600 bg-white hover:bg-brand-50"
        )}
      >
        <Download size={20} className="group-hover:translate-y-0.5 transition-transform" />
        <span className="flex flex-col items-start leading-none">
          Latest devices
          <span className={cn("text-[10px] font-semibold mt-0.5", onDark ? "text-white/70" : "text-muted")}>
            Optimised for newer phones
          </span>
        </span>
      </a>
    </div>
  );
}

function PhoneFrame({ src, className, alt = "App screen" }) {
  return (
    <div className={cn("relative rounded-[2.4rem] bg-plum p-2 shadow-2xl", className)}>
      <div className="relative rounded-[2rem] overflow-hidden bg-black aspect-[9/20]">
        <div className="absolute top-2 left-1/2 -translate-x-1/2 h-4 w-20 bg-plum rounded-full z-20" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="w-full h-full object-cover" loading="lazy" />
      </div>
    </div>
  );
}

function FloatCard({ children }) {
  return (
    <div className="flex items-center gap-2.5 bg-white rounded-2xl shadow-xl border border-black/5 px-3.5 py-2.5 w-max">
      {children}
    </div>
  );
}

function SectionHead({ kicker, title, subtitle, light }) {
  return (
    <div className="text-center max-w-2xl mx-auto">
      {kicker && <span className="inline-block text-xs font-extrabold uppercase tracking-widest text-brand-500 mb-3">{kicker}</span>}
      <h2 className={cn("text-3xl sm:text-4xl font-extrabold tracking-tight", light ? "text-white" : "text-plum")}>{title}</h2>
      {subtitle && <p className={cn("mt-3", light ? "text-white/80" : "text-plum-soft")}>{subtitle}</p>}
    </div>
  );
}

/* ---------------- Nav ---------------- */
function Nav() {
  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto max-w-6xl px-5 mt-3">
        <div className="flex items-center justify-between h-16 rounded-2xl bg-white/80 backdrop-blur-xl border border-black/5 shadow-sm px-4 sm:px-5">
          <a href="#top" className="flex items-center gap-2.5">
            <span className="h-9 w-9 rounded-xl grad-heart flex items-center justify-center text-white shadow-sm">
              <Heart size={18} fill="white" />
            </span>
            <span className="font-extrabold text-lg tracking-tight">{BRAND}</span>
          </a>
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-plum-soft">
            <a href="#features" className="hover:text-brand-600 transition">Features</a>
            <a href="#showcase" className="hover:text-brand-600 transition">Screens</a>
            <a href="#scan" className="hover:text-brand-600 transition">Scan</a>
            <a href="#faq" className="hover:text-brand-600 transition">FAQ</a>
          </nav>
          <DownloadButton size="sm" label="Get the app" href="#get" />
        </div>
      </div>
    </header>
  );
}

/* ---------------- Hero ---------------- */
function Hero() {
  return (
    <section id="top" className="relative pt-36 pb-24 sm:pt-40">
      <div className="absolute -top-24 -left-20 h-96 w-96 grad-heart opacity-20 blur-3xl animate-blob" />
      <div className="absolute top-20 -right-24 h-96 w-96 grad-lav opacity-20 blur-3xl animate-blob" style={{ animationDelay: "3s" }} />

      <div className="relative mx-auto max-w-6xl px-5 grid lg:grid-cols-2 gap-12 items-center">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 border border-brand-100 text-brand-600 px-3.5 py-1.5 text-xs font-bold">
            <Sparkles size={13} /> Now available for Android
          </span>
          <h1 className="mt-5 text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.05]">
            Find your <span className="text-grad-heart">person</span>, not just a match.
          </h1>
          <p className="mt-5 text-lg text-plum-soft leading-relaxed max-w-lg">
            {BRAND} is a modern, safe and beautifully simple matchmaking app. Discover verified
            profiles, connect with meaningful matches, and start real conversations.
          </p>

          <div id="get" className="mt-8 space-y-3">
            <DualDownload />
            <a href="#scan" className="inline-flex items-center gap-2 font-bold text-sm text-plum-soft hover:text-brand-600 transition">
              <ScanLine size={16} /> or scan a QR to install on your phone
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
            <Meta icon={Smartphone} text={APK.minAndroid} />
            <Meta icon={ShieldCheck} text="100% free · verified" />
            <div className="flex items-center gap-1.5">
              <div className="flex">
                {[...Array(5)].map((_, i) => <Star key={i} size={15} className="text-amber-400" fill="currentColor" />)}
              </div>
              <span className="font-bold text-plum">4.8</span>
              <span className="text-muted">· loved by singles</span>
            </div>
          </div>
        </div>

        {/* Phone with real Discover screen */}
        <div className="relative flex justify-center lg:justify-end animate-fade-up" style={{ animationDelay: "120ms" }}>
          <div className="relative">
            <PhoneFrame src={S.discover} className="w-[268px]" alt="Discover screen" />
            <div className="absolute -left-6 sm:-left-14 top-24 animate-float">
              <FloatCard>
                <span className="h-9 w-9 rounded-full grad-heart flex items-center justify-center text-white"><Heart size={16} fill="white" /></span>
                <div>
                  <div className="text-xs font-extrabold text-plum">It&apos;s a match! 🎉</div>
                  <div className="text-[10px] text-muted">You & Amara liked each other</div>
                </div>
              </FloatCard>
            </div>
            <div className="absolute -right-4 sm:-right-12 bottom-28 animate-float" style={{ animationDelay: "1.5s" }}>
              <FloatCard>
                <span className="h-9 w-9 rounded-full grad-lav flex items-center justify-center text-white"><MessageCircle size={16} /></span>
                <div>
                  <div className="text-xs font-extrabold text-plum">New message</div>
                  <div className="text-[10px] text-muted">Coffee this weekend? ☕</div>
                </div>
              </FloatCard>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Meta({ icon: Icon, text }) {
  return (
    <div className="flex items-center gap-1.5 text-plum-soft font-semibold">
      <Icon size={16} className="text-brand-500" /> {text}
    </div>
  );
}

/* ---------------- Stats ---------------- */
function StatsBand() {
  const stats = [["10k+", "Active members"], ["50k+", "Matches made"], ["100%", "Verified profiles"], ["4.8★", "Average rating"]];
  return (
    <section className="mx-auto max-w-6xl px-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 rounded-3xl bg-plum text-white p-8 sm:p-10 shadow-xl">
        {stats.map(([v, l], i) => (
          <div key={l} className="text-center animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
            <div className="text-3xl sm:text-4xl font-extrabold text-grad-heart">{v}</div>
            <div className="text-xs sm:text-sm text-white/70 font-semibold mt-1">{l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Feature grid ---------------- */
function FeatureGrid() {
  const items = [
    { icon: Search, title: "Smart Discover", desc: "Swipe through curated, verified profiles tailored to your preferences.", tone: "rose" },
    { icon: Heart, title: "Meaningful Matches", desc: "Connect only when it's mutual — no noise, just genuine interest.", tone: "violet" },
    { icon: MessageCircle, title: "Real Conversations", desc: "Chat instantly once you match, with photos, voice notes and emoji.", tone: "sky" },
    { icon: Video, title: "Audio & Video Calls", desc: "Take it further with secure in-app voice and video calling.", tone: "green" },
    { icon: ShieldCheck, title: "Verified & Safe", desc: "Every profile is reviewed. Report and block keep the community kind.", tone: "amber" },
    { icon: Lock, title: "Privacy First", desc: "Control who sees your photos with private galleries and access requests.", tone: "rose" },
  ];
  const toneMap = {
    rose: "grad-heart", violet: "grad-lav",
    sky: "bg-gradient-to-br from-sky-400 to-blue-500",
    green: "bg-gradient-to-br from-emerald-400 to-teal-500",
    amber: "bg-gradient-to-br from-amber-400 to-orange-500",
  };
  return (
    <section id="features" className="mx-auto max-w-6xl px-5 py-24">
      <SectionHead kicker="Features" title="Everything you need to meet someone real" subtitle="Thoughtfully designed to make finding a partner feel safe, simple and joyful." />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
        {items.map((f, i) => (
          <div key={f.title} className="card hover-lift p-6 animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
            <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center text-white shadow-sm", toneMap[f.tone])}>
              <f.icon size={22} />
            </div>
            <h3 className="mt-4 font-extrabold text-lg text-plum">{f.title}</h3>
            <p className="mt-1.5 text-sm text-plum-soft leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Alternating showcase with real screens ---------------- */
function Showcase() {
  const rows = [
    { src: S.discover, icon: Search, kicker: "Discover", title: "Swipe into something real", desc: "Browse a beautifully curated feed of verified singles near you. Like, save, or pass — every profile is genuine.", tone: "rose" },
    { src: S.chat, icon: MessageCircle, kicker: "Chat", title: "Conversations that click", desc: "The moment it's mutual, the conversation begins — send text, photos and voice notes in a delightfully smooth chat.", tone: "sky" },
    { src: S.videoCall, icon: Video, kicker: "Calls", title: "Meet face to face, safely", desc: "Ready for the next step? Hop on a secure in-app audio or video call, right from your match — no numbers shared.", tone: "green" },
    { src: S.safety, icon: ShieldCheck, kicker: "Safety", title: "You're always in control", desc: "Report or block anyone in a tap, keep photos private, and rest easy knowing every member is verified.", tone: "amber" },
  ];
  const toneMap = { rose: "grad-heart", sky: "bg-gradient-to-br from-sky-400 to-blue-500", green: "bg-gradient-to-br from-emerald-400 to-teal-500", amber: "bg-gradient-to-br from-amber-400 to-orange-500" };
  return (
    <section id="showcase" className="relative py-24 bg-gradient-to-b from-brand-50/60 to-white">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHead kicker="A closer look" title="Beautiful on every screen" />
        <div className="mt-16 space-y-20 lg:space-y-28">
          {rows.map((r, i) => {
            const flip = i % 2 === 1;
            return (
              <div key={r.title} className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                {/* Text */}
                <div className={cn("animate-fade-up", flip && "lg:order-2")}>
                  <span className={cn("inline-flex items-center gap-2 h-9 w-9 rounded-xl text-white justify-center", toneMap[r.tone])}>
                    <r.icon size={18} />
                  </span>
                  <span className="block text-xs font-extrabold uppercase tracking-widest text-brand-500 mt-4">{r.kicker}</span>
                  <h3 className="mt-2 text-2xl sm:text-3xl font-extrabold text-plum">{r.title}</h3>
                  <p className="mt-3 text-plum-soft leading-relaxed max-w-md">{r.desc}</p>
                </div>
                {/* Phone */}
                <div className={cn("flex justify-center animate-fade-up", flip && "lg:order-1")} style={{ animationDelay: "100ms" }}>
                  <div className="relative">
                    <div className={cn("absolute inset-0 blur-3xl opacity-20 rounded-full", toneMap[r.tone])} />
                    <PhoneFrame src={r.src} className="relative w-[248px]" alt={r.title} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Scan to download ---------------- */
function ScanSection() {
  const qrs = [
    { src: "/downloads/qr-universal.png", href: APK.universal, label: "All devices", hint: "Works on every Android phone" },
    { src: "/downloads/qr-modern.png", href: APK.modern, label: "Latest devices", hint: "Optimised for newer phones" },
  ];
  return (
    <section id="scan" className="mx-auto max-w-6xl px-5 py-24">
      <div className="rounded-[2rem] overflow-hidden grad-hero text-white shadow-2xl">
        <div className="grid lg:grid-cols-2 gap-10 p-10 sm:p-14 items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-bold">
              <QrCode size={13} /> Scan to download
            </span>
            <h2 className="mt-5 text-3xl sm:text-4xl font-extrabold leading-tight">
              Point your camera. Start in seconds.
            </h2>
            <p className="mt-4 text-white/85 max-w-md leading-relaxed">
              Open your phone camera, aim at a code below, and tap the link to install {BRAND}.
              Completely free — no payment required, ever.
            </p>
            <div className="mt-7">
              <p className="text-xs font-bold uppercase tracking-widest text-white/70 mb-2.5">Or download directly</p>
              <DualDownload onDark />
              <div className="mt-3 flex items-center gap-2 text-sm text-white/80 font-semibold">
                <CheckCircle2 size={16} /> {APK.size} · {APK.minAndroid} · v{APK.version}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            {qrs.map((q) => (
              <a
                key={q.label}
                href={q.href}
                target="_blank"
                rel="noreferrer noopener"
                className="group bg-white rounded-3xl p-5 text-center shadow-xl hover-lift block"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={q.src} alt={`${q.label} download QR`} className="w-full aspect-square object-contain rounded-xl" />
                <div className="mt-3 font-extrabold text-plum text-sm">{q.label}</div>
                <div className="text-[11px] text-muted mt-0.5">{q.hint}</div>
                <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-brand-600 opacity-0 group-hover:opacity-100 transition">
                  <Download size={12} /> Tap to download
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Gallery strip ---------------- */
function Gallery() {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-brand-50/50 overflow-hidden">
      <SectionHead kicker="Gallery" title="Take a peek inside" />
      <div className="mt-12 flex gap-5 overflow-x-auto px-5 pb-6 snap-x [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="shrink-0 w-[calc(50vw-140px)] max-w-[200px]" />
        {GALLERY.map((src, i) => (
          <div key={src} className="shrink-0 snap-center animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
            <PhoneFrame src={src} className="w-[200px]" alt={`Screen ${i + 1}`} />
          </div>
        ))}
        <div className="shrink-0 w-[calc(50vw-140px)] max-w-[200px]" />
      </div>
    </section>
  );
}

/* ---------------- How it works ---------------- */
function HowItWorks() {
  const steps = [
    { n: "1", title: "Download & sign up", desc: "Install the APK, create your account, and build a profile that's truly you.", icon: Download },
    { n: "2", title: "Discover & connect", desc: "Browse verified matches and send a request when someone catches your eye.", icon: Users },
    { n: "3", title: "Chat, call & meet", desc: "Once it's mutual, start chatting — then take the conversation further.", icon: MessageCircle },
  ];
  return (
    <section className="mx-auto max-w-6xl px-5 py-24">
      <SectionHead kicker="How it works" title="Three simple steps to your first match" />
      <div className="grid md:grid-cols-3 gap-6 mt-12">
        {steps.map((s, i) => (
          <div key={s.n} className="relative animate-fade-up" style={{ animationDelay: `${i * 90}ms` }}>
            <div className="card p-7 h-full">
              <div className="flex items-center gap-3">
                <span className="h-11 w-11 rounded-2xl grad-heart text-white font-extrabold text-lg flex items-center justify-center">{s.n}</span>
                <s.icon size={22} className="text-brand-400" />
              </div>
              <h3 className="mt-4 font-extrabold text-lg text-plum">{s.title}</h3>
              <p className="mt-1.5 text-sm text-plum-soft leading-relaxed">{s.desc}</p>
            </div>
            {i < steps.length - 1 && <ArrowRight size={22} className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 text-brand-300 z-10" />}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- FAQ ---------------- */
function Faq() {
  const faqs = [
    { q: "Is the app free to download?", a: `Yes — ${BRAND} is 100% free to download and set up, with no payment required.` },
    { q: "How do I install the APK?", a: "Tap Download APK (or scan a QR code), open the downloaded file, and allow installs from your browser if prompted. Then follow the on-screen steps." },
    { q: "Is it safe to install?", a: "Absolutely. It's the official signed build, and every member profile is reviewed and verified to keep the community safe." },
    { q: "Which Android version do I need?", a: `${BRAND} supports ${APK.minAndroid} and above.` },
    { q: "Is my data private?", a: "Yes. You control who sees your photos with private galleries, and you can block or report anyone at any time." },
  ];
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="py-24 bg-gradient-to-b from-brand-50/60 to-white">
      <div className="mx-auto max-w-3xl px-5">
        <SectionHead kicker="FAQ" title="Questions, answered" />
        <div className="mt-10 space-y-3">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className="card overflow-hidden">
                <button onClick={() => setOpen(isOpen ? -1 : i)} className="w-full flex items-center justify-between gap-4 p-5 text-left cursor-pointer">
                  <span className="font-bold text-plum">{f.q}</span>
                  <ChevronDown size={19} className={cn("text-brand-500 transition-transform shrink-0", isOpen && "rotate-180")} />
                </button>
                <div className={cn("grid transition-all duration-300", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                  <div className="overflow-hidden"><p className="px-5 pb-5 text-sm text-plum-soft leading-relaxed">{f.a}</p></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------- CTA ---------------- */
function CtaBand() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-24">
      <div className="relative overflow-hidden rounded-[2rem] bg-plum p-10 sm:p-16 text-center text-white shadow-2xl">
        <div className="absolute -top-16 -left-10 h-56 w-56 grad-heart opacity-30 blur-2xl" />
        <div className="absolute -bottom-20 -right-10 h-72 w-72 grad-lav opacity-30 blur-2xl" />
        <div className="relative">
          <Heart size={40} fill="white" className="mx-auto mb-5 opacity-90" />
          <h2 className="text-3xl sm:text-4xl font-extrabold">Your person is one tap away</h2>
          <p className="mt-3 text-white/80 max-w-xl mx-auto">
            Join thousands finding meaningful connections on {BRAND}. Download now and create your profile in minutes.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4">
            <DualDownload center onDark />
            <a href="#scan" className="inline-flex items-center gap-2 font-bold text-sm text-white/90 hover:text-white transition">
              <QrCode size={16} /> or scan a QR instead
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Footer ---------------- */
function Footer() {
  return (
    <footer className="border-t border-black/5 bg-white">
      <div className="mx-auto max-w-6xl px-5 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <span className="h-8 w-8 rounded-lg grad-heart flex items-center justify-center text-white"><Heart size={15} fill="white" /></span>
          <span className="font-extrabold text-plum">{BRAND}</span>
        </div>
        <p className="text-sm text-muted">© 2026 {BRAND}. Made with <Heart size={12} className="inline text-brand-500" fill="currentColor" /> for finding love.</p>
        <div className="flex items-center gap-5 text-sm font-semibold text-plum-soft">
          <a href="#features" className="hover:text-brand-600 transition">Features</a>
          <a href="#faq" className="hover:text-brand-600 transition">FAQ</a>
          <a href={APK.universal} target="_blank" rel="noreferrer noopener" className="hover:text-brand-600 transition">All devices</a>
          <a href={APK.modern} target="_blank" rel="noreferrer noopener" className="hover:text-brand-600 transition">Latest devices</a>
        </div>
      </div>
    </footer>
  );
}

import { useRef } from "react";
import type { Title } from "./data";

export function Card({ t, onOpen }: { t: Title; onOpen: (t: Title) => void }) {
  return (
    <button
      onClick={() => onOpen(t)}
      className="group relative w-[150px] shrink-0 overflow-hidden rounded-md text-left transition-transform duration-300 hover:z-10 hover:scale-110 sm:w-[190px] md:w-[220px]"
    >
      <div className={`aspect-video w-full bg-gradient-to-br ${t.color} p-3 flex flex-col justify-end`}>
        <span className="text-[10px] font-semibold uppercase tracking-widest text-white/60">{t.genres[0]}</span>
        <span className="font-black leading-tight text-white drop-shadow md:text-lg">{t.name}</span>
      </div>
      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black via-black/60 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
        <div className="mb-1 flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-black">
            <PlayIcon className="h-3.5 w-3.5" />
          </span>
          <span className="text-xs font-semibold text-green-400">{t.match}% Match</span>
        </div>
        <p className="text-[11px] text-gray-300">
          <span className="border border-gray-400 px-1 mr-1">{t.rating}</span>
          {t.duration}
        </p>
      </div>
    </button>
  );
}

export function Row({ title, items, onOpen }: { title: string; items: Title[]; onOpen: (t: Title) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.8, behavior: "smooth" });
  if (!items.length) return null;
  return (
    <section className="group/row relative my-6 md:my-10">
      <h2 className="mb-2 px-4 text-lg font-bold text-gray-100 md:px-12 md:text-xl">{title}</h2>
      <button
        onClick={() => scroll(-1)}
        className="absolute left-0 top-9 bottom-0 z-20 hidden w-12 items-center justify-center bg-black/50 text-white opacity-0 transition group-hover/row:opacity-100 md:flex"
      >
        <Chevron className="h-8 w-8 rotate-180" />
      </button>
      <div ref={ref} className="flex gap-2 overflow-x-auto px-4 py-4 scrollbar-hide md:px-12">
        {items.map((t) => (
          <Card key={t.id} t={t} onOpen={onOpen} />
        ))}
      </div>
      <button
        onClick={() => scroll(1)}
        className="absolute right-0 top-9 bottom-0 z-20 hidden w-12 items-center justify-center bg-black/50 text-white opacity-0 transition group-hover/row:opacity-100 md:flex"
      >
        <Chevron className="h-8 w-8" />
      </button>
    </section>
  );
}

export function Hero({ t, onPlay, onInfo }: { t: Title; onPlay: (t: Title) => void; onInfo: (t: Title) => void }) {
  return (
    <div className={`relative h-[62vh] w-full bg-gradient-to-br ${t.color} md:h-[80vh]`}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-black/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />
      <div className="absolute bottom-[18%] left-4 max-w-xl space-y-4 md:left-12">
        <p className="flex items-center gap-2 text-sm font-semibold tracking-wider text-gray-200">
          <span className="rounded-sm bg-red-600 px-1.5 py-0.5 text-[10px] font-black">D</span>
          {t.category === "webseries" ? "SERIES" : t.category.toUpperCase()}
        </p>
        <h1 className="text-4xl font-black text-white drop-shadow-lg md:text-6xl">{t.name}</h1>
        <p className="hidden text-base text-gray-100 drop-shadow md:block md:text-lg">{t.description}</p>
        <div className="flex gap-3">
          <button onClick={() => onPlay(t)} className="flex items-center gap-2 rounded bg-white px-6 py-2 font-bold text-black transition hover:bg-white/80">
            <PlayIcon className="h-5 w-5" /> Play
          </button>
          <button onClick={() => onInfo(t)} className="flex items-center gap-2 rounded bg-gray-500/60 px-6 py-2 font-bold text-white transition hover:bg-gray-500/40">
            <InfoIcon className="h-5 w-5" /> More Info
          </button>
        </div>
      </div>
    </div>
  );
}

export function Modal({ t, onClose, onPlay, related, onOpen }: { t: Title; onClose: () => void; onPlay: (t: Title) => void; related: Title[]; onOpen: (t: Title) => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 pt-10" onClick={onClose}>
      <div className="w-full max-w-3xl overflow-hidden rounded-lg bg-[#181818] shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className={`relative aspect-video w-full bg-gradient-to-br ${t.color}`}>
          <div className="absolute inset-0 bg-gradient-to-t from-[#181818] to-transparent" />
          <button onClick={onClose} className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#181818] text-white">✕</button>
          <div className="absolute bottom-6 left-6 space-y-4">
            <h2 className="text-3xl font-black text-white md:text-5xl">{t.name}</h2>
            <button onClick={() => onPlay(t)} className="flex items-center gap-2 rounded bg-white px-7 py-2 font-bold text-black hover:bg-white/80">
              <PlayIcon className="h-5 w-5" /> Play
            </button>
          </div>
        </div>
        <div className="grid gap-6 p-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-3">
            <p className="flex items-center gap-3 text-sm">
              <span className="font-bold text-green-400">{t.match}% Match</span>
              <span className="text-gray-400">{t.year}</span>
              <span className="border border-gray-500 px-1 text-xs text-gray-300">{t.rating}</span>
              <span className="text-gray-400">{t.duration}</span>
              <span className="rounded border border-gray-500 px-1 text-[10px] text-gray-300">HD</span>
            </p>
            <p className="text-gray-200">{t.description}</p>
          </div>
          <div className="space-y-2 text-sm">
            <p><span className="text-gray-500">Genres: </span><span className="text-gray-200">{t.genres.join(", ")}</span></p>
            <p><span className="text-gray-500">Category: </span><span className="text-gray-200 capitalize">{t.category}</span></p>
            <p><span className="text-gray-500">Price: </span><span className="text-green-400 font-semibold">Free</span></p>
          </div>
        </div>
        {related.length > 0 && (
          <div className="p-6 pt-0">
            <h3 className="mb-3 text-lg font-bold text-white">More Like This</h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {related.map((r) => (
                <button key={r.id} onClick={() => onOpen(r)} className="overflow-hidden rounded bg-[#2f2f2f] text-left transition hover:scale-[1.03]">
                  <div className={`aspect-video bg-gradient-to-br ${r.color} p-2 flex items-end`}>
                    <span className="text-sm font-bold text-white">{r.name}</span>
                  </div>
                  <div className="p-2 text-xs text-gray-400">
                    <span className="text-green-400 font-semibold">{r.match}% Match</span> · {r.duration}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function Player({ t, onClose }: { t: Title; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-black">
      <div className="flex items-center gap-4 p-4 text-white">
        <button onClick={onClose} className="flex items-center gap-2 text-lg font-semibold hover:text-gray-300">
          <Chevron className="h-6 w-6 rotate-180" /> Back
        </button>
        <span className="text-gray-400">|</span>
        <span className="font-bold">{t.name}</span>
      </div>
      <video src={t.video} controls autoPlay className="h-full w-full flex-1 object-contain" />
    </div>
  );
}

export const PlayIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
);
export const InfoIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
);
export const Chevron = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M9 6l6 6-6 6" /></svg>
);
export const SearchIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
);
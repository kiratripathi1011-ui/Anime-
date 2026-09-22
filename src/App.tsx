import React, { useState, useEffect } from "react";
import {
  Play,
  Search,
  X,
  Flame,
  Tv,
  Layers,
  Star,
  Bookmark,
  ExternalLink,
  Sparkles,
  Server as ServerIcon,
  CheckCircle2,
  Circle,
  ChevronRight,
} from "lucide-react";

export interface AnimeItem {
  id: string;
  anilistId: number;
  malId: number;
  name: string;
  romajiName: string;
  poster: string;
  banner: string;
  year: number;
  episodes: number;
  genres: string[];
  description: string;
  score: number;
  status: string;
  trailerId?: string;
}

const BASE_QUERY = `
  id
  idMal
  title {
    romaji
    english
  }
  coverImage {
    extraLarge
    large
  }
  bannerImage
  startDate {
    year
  }
  seasonYear
  episodes
  genres
  description
  averageScore
  status
  trailer {
    id
    site
  }
`;

function stripHtml(html: string): string {
  if (!html) return "No synopsis available.";
  return html.replace(/<[^>]*>/g, "");
}

function mapMedia(list: any[]): AnimeItem[] {
  if (!Array.isArray(list)) return [];
  return list.map((m: any) => ({
    id: "al_" + m.id,
    anilistId: m.id,
    malId: m.idMal || m.id,
    name: m.title?.english || m.title?.romaji || "Unknown Anime",
    romajiName: m.title?.romaji || "",
    poster: m.coverImage?.extraLarge || m.coverImage?.large || "",
    banner: m.bannerImage || m.coverImage?.extraLarge || "",
    year: m.seasonYear || m.startDate?.year || 2024,
    episodes: m.episodes || 24,
    genres: Array.isArray(m.genres) ? m.genres : ["Anime"],
    description: stripHtml(m.description),
    score: m.averageScore || 85,
    status: m.status || "RELEASING",
    trailerId: m.trailer?.site === "youtube" ? m.trailer.id : undefined,
  }));
}

async function fetchAniList(query: string, variables: any = {}) {
  try {
    const res = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ query, variables }),
    });
    if (!res.ok) throw new Error("Status: " + res.status);
    const json = await res.json();
    return json.data?.Page?.media || [];
  } catch (err) {
    console.error("AniList Fetch Error:", err);
    return [];
  }
}

// Complete Multi-Server Configuration matching your screenshots
interface ServerSource {
  id: string;
  name: string;
  status: string;
  getUrl: (mal: number, ani: number, ep: number) => string;
}

const SERVERS: ServerSource[] = [
  {
    id: "nitro",
    name: "Nitro - [Multi-Lang]",
    status: "Ready",
    getUrl: (mal, ani, ep) => `https://vidsrc.cc/v2/embed/anime/${mal}/${ep}/sub`,
  },
  {
    id: "mhply",
    name: "MhPly - [Multi-Lang]",
    status: "Ready",
    getUrl: (mal, ani, ep) => `https://vidlink.pro/anime/${mal}/${ep}`,
  },
  {
    id: "castvid",
    name: "CastVid",
    status: "Ready",
    getUrl: (mal, ani, ep) => `https://player.autoembed.cc/embed/anime/${mal}/${ep}`,
  },
  {
    id: "stremfx",
    name: "StremFx",
    status: "Ready",
    getUrl: (mal, ani, ep) => `https://vidsrc.xyz/embed/anime/${mal}/${ep}`,
  },
  {
    id: "citadel",
    name: "Citadel",
    status: "Ready",
    getUrl: (mal, ani, ep) => `https://multiembed.mov/?video_id=${mal}&an=1&ep=${ep}`,
  },
  {
    id: "vidstpm",
    name: "VidStpM",
    status: "Ready",
    getUrl: (mal, ani, ep) => `https://vidsrc.pm/embed/anime/${mal}/${ep}`,
  },
  {
    id: "vidhindi",
    name: "VidHindi",
    status: "Ready",
    getUrl: (mal, ani, ep) => `https://vidsrc.cc/v2/embed/anime/${mal}/${ep}/dub`,
  },
  {
    id: "videmd",
    name: "VidEmd",
    status: "Ready",
    getUrl: (mal, ani, ep) => `https://www.2embed.cc/embedmal/${mal}`,
  },
  {
    id: "vidpro",
    name: "VidPro",
    status: "Ready",
    getUrl: (mal, ani, ep) => `https://vidsrc.pro/embed/anime/${mal}/${ep}/sub`,
  },
  {
    id: "vidbo",
    name: "VidBo",
    status: "Ready",
    getUrl: (mal, ani, ep) => `https://vidsrc.rip/embed/anime/${mal}/${ep}`,
  },
];

// HiAnime Player Modal with matching Server Selection Drawer
function HiAnimePlayerModal({
  anime,
  onClose,
}: {
  anime: AnimeItem;
  onClose: () => void;
}) {
  const [currentEp, setCurrentEp] = useState(1);
  const [selectedServerId, setSelectedServerId] = useState("nitro");
  const [showServerDrawer, setShowServerDrawer] = useState(false);

  const totalEpisodes = Math.min(anime.episodes || 12, 100);
  const activeServer = SERVERS.find((s) => s.id === selectedServerId) || SERVERS[0];
  const streamUrl = activeServer.getUrl(anime.malId || anime.anilistId, anime.anilistId, currentEp);
  const hianimeSearchUrl = `https://hianime.to/search?keyword=${encodeURIComponent(anime.name.trim())}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-2 md:p-6 overflow-y-auto">
      <div className="relative w-full max-w-7xl bg-[#14151a] border border-[#2b2d38] rounded-xl shadow-2xl overflow-hidden flex flex-col my-auto">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-[#1b1c24] border-b border-[#2b2d38]">
          <div className="flex items-center gap-3">
            <span className="bg-[#ffb703] text-black font-black text-xs px-2.5 py-0.5 rounded tracking-wider">
              HD
            </span>
            <span className="bg-[#e63946] text-white font-bold text-xs px-2 py-0.5 rounded">
              SUB
            </span>
            <h2 className="text-white font-bold text-base md:text-lg truncate max-w-xl">
              {anime.name}
            </h2>
            <span className="text-[#ffb703] text-xs font-mono font-bold hidden sm:inline">
              [Episode {currentEp} of {totalEpisodes}]
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#2b2d38] hover:bg-[#3d4050] text-[#a0a0a8] hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Area + Episode Drawer */}
        <div className="grid grid-cols-1 lg:grid-cols-4 bg-[#0a0a0d] relative">
          
          {/* Main Video Viewport */}
          <div className="lg:col-span-3 flex flex-col bg-black relative">
            <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
              <iframe
                key={`${anime.anilistId}-${currentEp}-${selectedServerId}`}
                src={streamUrl}
                title={anime.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>

            {/* Bottom Controls Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3 bg-[#191a22] border-t border-[#2b2d38]">
              <div className="flex items-center gap-3">
                {/* Server Selector Trigger */}
                <button
                  onClick={() => setShowServerDrawer(true)}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#252631] hover:bg-[#333544] text-white text-xs font-bold transition border border-[#3d4052] cursor-pointer"
                >
                  <ServerIcon className="w-3.5 h-3.5 text-[#ffb703]" />
                  <span>Server:</span>
                  <span className="text-[#ffb703]">{activeServer.name}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#8a8a95]" />
                </button>
              </div>

              {/* Direct Playback Links */}
              <div className="flex items-center gap-3">
                <a
                  href={streamUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#2b2d38] hover:bg-[#3d4050] text-[#ffb703] text-xs font-bold transition font-mono"
                >
                  <span>Open Stream Tab</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <a
                  href={hianimeSearchUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-black bg-[#ffb703] px-3 py-1 rounded font-bold hover:bg-[#ffc229] transition"
                >
                  <span>HiAnime Mirror</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Episode List Drawer */}
          <div className="lg:col-span-1 bg-[#14151a] border-t lg:border-t-0 lg:border-l border-[#2b2d38] flex flex-col h-[320px] lg:h-auto">
            <div className="p-3 bg-[#1b1c24] border-b border-[#2b2d38] flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#e0e0e8] flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#ffb703]" /> Episodes
              </span>
              <span className="text-[11px] font-mono text-[#8a8a95]">
                1 - {totalEpisodes}
              </span>
            </div>

            <div className="p-3 overflow-y-auto flex-1 grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-4 gap-2">
              {Array.from({ length: totalEpisodes }).map((_, i) => {
                const ep = i + 1;
                const active = ep === currentEp;
                return (
                  <button
                    key={ep}
                    onClick={() => setCurrentEp(ep)}
                    className={`h-9 rounded text-xs font-bold transition flex items-center justify-center cursor-pointer ${
                      active
                        ? "bg-[#ffb703] text-black shadow-lg"
                        : "bg-[#1f2029] text-[#a0a0a8] hover:bg-[#2e303d] hover:text-white"
                    }`}
                  >
                    {ep}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SERVER SELECTION SIDE-DRAWER (Matching Screenshot 1 & 2) */}
          {showServerDrawer && (
            <div className="absolute inset-y-0 left-0 z-30 w-72 bg-[#0c0d10] border-r border-[#2b2d38] flex flex-col shadow-2xl animate-in slide-in-from-left duration-200">
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#20222c] bg-[#121318]">
                <h3 className="text-sm font-bold text-white tracking-wide">Server</h3>
                <button
                  onClick={() => setShowServerDrawer(false)}
                  className="p-1 rounded-full text-[#8a8a95] hover:text-white hover:bg-white/10 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3 overflow-y-auto flex-1 space-y-2">
                {SERVERS.map((srv) => {
                  const isSelected = selectedServerId === srv.id;
                  return (
                    <div
                      key={srv.id}
                      onClick={() => {
                        setSelectedServerId(srv.id);
                        setShowServerDrawer(false);
                      }}
                      className={`flex items-center gap-3.5 px-4 py-3 rounded-xl cursor-pointer transition select-none ${
                        isSelected
                          ? "bg-[#ffb703] text-black font-bold shadow-lg"
                          : "bg-[#14151a] hover:bg-[#1f2029] text-[#e0e0e8]"
                      }`}
                    >
                      {isSelected ? (
                        <CheckCircle2 className="w-5 h-5 fill-black text-[#ffb703] flex-shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-[#4a4d5e] flex-shrink-0" />
                      )}

                      <div className="flex flex-col flex-1 truncate">
                        <span className={`text-xs ${isSelected ? "font-black" : "font-semibold"}`}>
                          {srv.name}
                        </span>
                        <span
                          className={`text-[10px] ${
                            isSelected ? "text-black/80 font-medium" : "text-[#7a7d8e]"
                          }`}
                        >
                          {srv.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Anime Information Footer */}
        <div className="p-6 bg-[#14151a] border-t border-[#2b2d38] flex flex-col md:flex-row gap-6">
          {anime.poster && (
            <img
              src={anime.poster}
              alt={anime.name}
              className="w-24 h-36 rounded-lg object-cover shadow-lg hidden sm:block"
            />
          )}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span className="text-white font-black text-xl">{anime.name}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-[#20222b] text-[#ffb703] font-bold flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-[#ffb703]" /> {anime.score / 10}
              </span>
              <span className="text-xs text-[#a0a0a8]">{anime.year}</span>
              <span className="text-xs text-[#a0a0a8]">{anime.status}</span>
            </div>
            <p className="text-xs md:text-sm text-[#9ca3af] leading-relaxed line-clamp-3">
              {anime.description}
            </p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {anime.genres.map((g) => (
                <span
                  key={g}
                  className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#1f2029] border border-[#2b2d38] text-[#c0c0cb]"
                >
                  {g}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Anime Card Component
function AnimeCard({
  anime,
  onWatch,
}: {
  anime: AnimeItem;
  onWatch: (item: AnimeItem) => void;
}) {
  return (
    <div
      onClick={() => onWatch(anime)}
      className="group relative flex flex-col cursor-pointer transition-transform duration-200 hover:-translate-y-1.5"
    >
      <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden bg-[#181920] shadow-md">
        {anime.poster ? (
          <img
            src={anime.poster}
            alt={anime.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-[#181920] flex items-center justify-center text-xs text-zinc-500">
            No Image
          </div>
        )}

        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <span className="bg-[#ffb703] text-black text-[10px] font-black px-1.5 py-0.5 rounded">
            HD
          </span>
          <span className="bg-[#e63946] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
            SUB
          </span>
        </div>

        <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur text-white text-[10px] font-mono px-2 py-0.5 rounded">
          {anime.episodes} EPS
        </div>

        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-[#ffb703] flex items-center justify-center text-black shadow-xl">
            <Play className="w-6 h-6 fill-black ml-0.5" />
          </div>
        </div>
      </div>

      <h3 className="mt-2.5 text-xs sm:text-sm font-bold text-white group-hover:text-[#ffb703] transition-colors truncate">
        {anime.name}
      </h3>
      <p className="text-[11px] text-[#828290] mt-0.5">
        TV · {anime.year} · {anime.genres[0] || "Anime"}
      </p>
    </div>
  );
}

type NavTab = "home" | "subbed" | "dubbed" | "popular" | "airing";

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>("home");
  const [tabAnimeList, setTabAnimeList] = useState<AnimeItem[]>([]);
  const [tabLoading, setTabLoading] = useState(false);

  const [trending, setTrending] = useState<AnimeItem[]>([]);
  const [airing, setAiring] = useState<AnimeItem[]>([]);
  const [heroAnime, setHeroAnime] = useState<AnimeItem | null>(null);

  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<AnimeItem[]>([]);
  const [searching, setSearching] = useState(false);

  const [watching, setWatching] = useState<AnimeItem | null>(null);

  useEffect(() => {
    async function loadData() {
      const qTrend = `query { Page(page: 1, perPage: 18) { media(sort: TRENDING_DESC, type: ANIME) { ${BASE_QUERY} } } }`;
      const qAir = `query { Page(page: 1, perPage: 18) { media(status: RELEASING, sort: POPULARITY_DESC, type: ANIME) { ${BASE_QUERY} } } }`;

      const [trendRaw, airRaw] = await Promise.all([
        fetchAniList(qTrend),
        fetchAniList(qAir),
      ]);

      const trendData = mapMedia(trendRaw);
      const airData = mapMedia(airRaw);

      setTrending(trendData);
      setAiring(airData);
      if (trendData.length > 0) {
        setHeroAnime(trendData[0]);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    if (activeTab === "home") {
      setTabAnimeList([]);
      return;
    }

    async function loadTabContent() {
      setTabLoading(true);
      let graphQuery = "";

      if (activeTab === "subbed" || activeTab === "popular") {
        graphQuery = `query { Page(page: 1, perPage: 24) { media(sort: POPULARITY_DESC, type: ANIME) { ${BASE_QUERY} } } }`;
      } else if (activeTab === "dubbed") {
        graphQuery = `query { Page(page: 1, perPage: 24) { media(countryOfOrigin: "JP", sort: TRENDING_DESC, type: ANIME) { ${BASE_QUERY} } } }`;
      } else if (activeTab === "airing") {
        graphQuery = `query { Page(page: 1, perPage: 24) { media(status: RELEASING, sort: TRENDING_DESC, type: ANIME) { ${BASE_QUERY} } } }`;
      }

      if (graphQuery) {
        const raw = await fetchAniList(graphQuery);
        setTabAnimeList(mapMedia(raw));
      }
      setTabLoading(false);
    }

    loadTabContent();
  }, [activeTab]);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setSearching(true);
      const qSearch = `query ($search: String) { Page(page: 1, perPage: 24) { media(search: $search, type: ANIME, sort: SEARCH_MATCH) { ${BASE_QUERY} } } }`;
      const raw = await fetchAniList(qSearch, { search: trimmed });
      setSearchResults(mapMedia(raw));
      setSearching(false);
    }, 280);

    return () => clearTimeout(timer);
  }, [query]);

  const navItems: { id: NavTab; label: string }[] = [
    { id: "home", label: "HOME" },
    { id: "subbed", label: "SUBBED ANIME" },
    { id: "dubbed", label: "DUBBED ANIME" },
    { id: "popular", label: "MOST POPULAR" },
    { id: "airing", label: "TOP AIRING" },
  ];

  return (
    <div className="min-h-screen bg-[#0f1015] text-[#e0e0e8] font-sans selection:bg-[#ffb703] selection:text-black">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#14151a]/95 backdrop-blur border-b border-[#252631] px-4 md:px-12 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div
            onClick={() => {
              setActiveTab("home");
              setQuery("");
            }}
            className="flex items-center gap-3 cursor-pointer select-none"
          >
            <div className="w-8 h-8 rounded-lg bg-[#ffb703] flex items-center justify-center font-black text-black text-lg shadow-lg">
              K
            </div>
            <span className="text-xl md:text-2xl font-black tracking-tight text-white">
              Kira<span className="text-[#ffb703]">Anime</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-[#a0a0ab]">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setQuery("");
                }}
                className={`transition-colors py-1 cursor-pointer relative ${
                  activeTab === item.id
                    ? "text-[#ffb703] font-black"
                    : "text-[#a0a0ab] hover:text-white"
                }`}
              >
                {item.label}
                {activeTab === item.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ffb703] rounded-full" />
                )}
              </button>
            ))}
          </nav>

          <div className="relative flex items-center w-full max-w-xs md:max-w-sm">
            <Search className="absolute left-3 w-4 h-4 text-[#8a8a95]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search anime (Naruto, Death Note, COTE)..."
              className="w-full bg-[#1e2029] border border-[#2b2d38] rounded-full py-2 pl-9 pr-8 text-xs text-white placeholder-[#8a8a95] focus:outline-none focus:border-[#ffb703] transition-all"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 text-[#8a8a95] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main View */}
      {query.trim() ? (
        <main className="max-w-7xl mx-auto px-4 md:px-12 py-10">
          <h2 className="text-xl md:text-2xl font-black text-white mb-2">
            Search Results for <span className="text-[#ffb703]">"{query}"</span>
          </h2>
          {searching ? (
            <p className="text-xs text-[#a0a0ab] font-mono">Querying live anime index...</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-6">
              {searchResults.map((anime) => (
                <AnimeCard key={anime.id} anime={anime} onWatch={setWatching} />
              ))}
            </div>
          )}
        </main>
      ) : activeTab !== "home" ? (
        <main className="max-w-7xl mx-auto px-4 md:px-12 py-10">
          <div className="flex items-center justify-between mb-6 border-b border-[#252631] pb-3">
            <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-wide flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#ffb703]" />
              {navItems.find((n) => n.id === activeTab)?.label}
            </h2>
            <span className="text-xs text-[#828290] font-mono">Showing 24 titles</span>
          </div>

          {tabLoading ? (
            <p className="text-xs text-[#a0a0ab] font-mono">Loading catalog...</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {tabAnimeList.map((anime) => (
                <AnimeCard key={anime.id} anime={anime} onWatch={setWatching} />
              ))}
            </div>
          )}
        </main>
      ) : (
        <>
          {heroAnime && (
            <div className="relative w-full h-[55vh] md:h-[70vh] bg-[#000] overflow-hidden select-none border-b border-[#252631]">
              <div className="absolute inset-0">
                <img
                  src={heroAnime.banner || heroAnime.poster}
                  alt={heroAnime.name}
                  className="w-full h-full object-cover object-center brightness-40 filter scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f1015] via-[#0f1015]/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0f1015] via-[#0f1015]/70 to-transparent w-full md:w-3/4" />
              </div>

              <div className="relative z-10 max-w-7xl mx-auto h-full px-4 md:px-12 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-black px-2 py-0.5 rounded bg-[#ffb703] text-black">
                    #1 SPOTLIGHT
                  </span>
                  <span className="text-xs font-bold text-[#828290]">
                    {heroAnime.year} · TV · {heroAnime.episodes} Episodes
                  </span>
                </div>

                <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white mb-4 max-w-2xl">
                  {heroAnime.name}
                </h1>

                <p className="text-xs sm:text-sm text-[#b0b0bb] line-clamp-3 max-w-xl mb-6 leading-relaxed">
                  {heroAnime.description}
                </p>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setWatching(heroAnime)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#ffb703] text-black font-black text-xs uppercase tracking-wider hover:bg-[#ffc229] transition shadow-lg cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-black" /> Watch Episode 1
                  </button>

                  <button
                    onClick={() => setWatching(heroAnime)}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#20222b] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#2b2e3b] transition border border-[#343747] cursor-pointer"
                  >
                    <Bookmark className="w-4 h-4" /> Detail
                  </button>
                </div>
              </div>
            </div>
          )}

          <main className="max-w-7xl mx-auto px-4 md:px-12 py-10 space-y-12">
            <section>
              <div className="flex items-center justify-between mb-6 border-b border-[#252631] pb-3">
                <h2 className="text-lg md:text-xl font-black text-white uppercase tracking-wide flex items-center gap-2">
                  <Flame className="w-5 h-5 text-[#ffb703]" /> Trending Anime
                </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {trending.map((anime) => (
                  <AnimeCard key={anime.id} anime={anime} onWatch={setWatching} />
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-6 border-b border-[#252631] pb-3">
                <h2 className="text-lg md:text-xl font-black text-white uppercase tracking-wide flex items-center gap-2">
                  <Tv className="w-5 h-5 text-[#e63946]" /> Top Airing
                </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {airing.map((anime) => (
                  <AnimeCard key={anime.id} anime={anime} onWatch={setWatching} />
                ))}
              </div>
            </section>
          </main>
        </>
      )}

      {/* Video Modal */}
      {watching && (
        <HiAnimePlayerModal
          anime={watching}
          onClose={() => setWatching(null)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-[#252631] bg-[#14151a] py-10 px-4 md:px-12 text-center text-xs text-[#828290]">
        <p className="font-bold text-white mb-2">
          Kira<span className="text-[#ffb703]">Anime</span>
        </p>
        <p className="max-w-xl mx-auto text-[11px] leading-relaxed">
          Full catalog indexed via AniList GraphQL.
        </p>
      </footer>
    </div>
  );
}
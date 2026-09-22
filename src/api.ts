export interface AnimeItem {
  id: string;
  anilistId: number;
  malId: number;
  name: string;
  romajiName: string;
  poster: string;
  banner: string;
  year: number;
  rating: string;
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
  if (!html) return "No synopsis provided.";
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
    rating: "16+",
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
    if (!res.ok) throw new Error("AniList status " + res.status);
    const json = await res.json();
    return json.data?.Page?.media || [];
  } catch (err) {
    console.error("AniList API error:", err);
    return [];
  }
}

export async function getTrendingAnime(): Promise<AnimeItem[]> {
  const q = `query { Page(page: 1, perPage: 18) { media(sort: TRENDING_DESC, type: ANIME) { ${BASE_QUERY} } } }`;
  const list = await fetchAniList(q);
  return mapMedia(list);
}

export async function getAiringAnime(): Promise<AnimeItem[]> {
  const q = `query { Page(page: 1, perPage: 18) { media(status: RELEASING, sort: POPULARITY_DESC, type: ANIME) { ${BASE_QUERY} } } }`;
  const list = await fetchAniList(q);
  return mapMedia(list);
}

export async function searchAnime(keyword: string): Promise<AnimeItem[]> {
  const trimmed = keyword.trim();
  if (!trimmed) return [];
  const q = `query ($search: String) { Page(page: 1, perPage: 24) { media(search: $search, type: ANIME, sort: SEARCH_MATCH) { ${BASE_QUERY} } } }`;
  const list = await fetchAniList(q, { search: trimmed });
  return mapMedia(list);
}

// Fixed multi-server links with real anime streaming routes
export function getStreamUrl(anime: AnimeItem, episode: number = 1, server: number = 1): string {
  const mal = anime.malId || anime.anilistId;
  const ani = anime.anilistId;
  
  // Format clean anime slug (e.g. "naruto", "death-note")
  const cleanTitle = (anime.name || "anime")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  if (server === 1) {
    // Server 1: VidSrc Anime Engine (Multi-subbed, reliable)
    return `https://vidsrc.cc/v2/embed/anime/${mal}/${episode}/sub`;
  }
  if (server === 2) {
    // Server 2: AutoEmbed Anime Endpoint
    return `https://player.autoembed.cc/embed/anime/${mal}/${episode}`;
  }
  if (server === 3) {
    // Server 3: AnimeDex / HiAnime Direct Embed
    return `https://animedex.live/watch/${cleanTitle}-episode-${episode}`;
  }
  // Server 4: Official Stream / Trailer Backup
  if (anime.trailerId) {
    return `https://www.youtube-nocookie.com/embed/${anime.trailerId}?autoplay=1`;
  }
  return `https://vidsrc.cc/v2/embed/anime/${mal}/${episode}/sub`;
}
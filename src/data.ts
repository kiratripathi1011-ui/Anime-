export interface Title {
  id: string;
  name: string;
  category: "trending" | "popular" | "anime" | "latest";
  year: number;
  rating: string;
  duration: string;
  genres: string[];
  description: string;
  color: string;
  poster: string;
  video: string;
  match: number;
}

export const titles: Title[] = [
  // --- HERO / TRENDING ROW ---
  {
    id: "cote",
    name: "Classroom of the Elite",
    category: "trending",
    year: 2024,
    rating: "16+",
    duration: "3 Seasons",
    genres: ["Psychological", "Drama", "School"],
    description:
      "Kiyotaka Ayanokoji enters Tokyo Metropolitan Advanced Nurturing High School. While placed in the lowest Class D, his calm calculations and hidden intellect pull the strings behind the scenes.",
    color: "from-purple-950 to-black",
    poster: "https://cdn.myanimelist.net/images/anime/1162/122393l.jpg",
    video: "/myvideo.mp4",
    match: 99,
  },
  {
    id: "naruto",
    name: "Naruto Shippuden",
    category: "trending",
    year: 2017,
    rating: "13+",
    duration: "500 Episodes",
    genres: ["Action", "Adventure", "Ninja"],
    description:
      "Naruto returns to the Hidden Leaf stronger than ever, fighting alongside Kakashi Hatake and Team 7 to counter the Akatsuki threat and bring Sasuke back.",
    color: "from-amber-950 to-black",
    poster: "https://cdn.myanimelist.net/images/anime/1565/111305l.jpg",
    video: "/myvideo.mp4",
    match: 98,
  },
  {
    id: "jujutsu_kaisen",
    name: "Jujutsu Kaisen",
    category: "trending",
    year: 2023,
    rating: "18+",
    duration: "2 Seasons",
    genres: ["Action", "Supernatural", "Dark Fantasy"],
    description:
      "Yuji Itadori swallows a cursed finger to save a friend, unleashing Ryomen Sukuna and thrusting himself into the lethal underworld of Jujutsu sorcery.",
    color: "from-blue-950 to-black",
    poster: "https://cdn.myanimelist.net/images/anime/1171/109222l.jpg",
    video: "/myvideo.mp4",
    match: 97,
  },
  {
    id: "aot",
    name: "Attack on Titan",
    category: "trending",
    year: 2023,
    rating: "18+",
    duration: "4 Seasons",
    genres: ["Action", "Military", "Mystery"],
    description:
      "Humanity battles giant man-eating Titans behind colossal walls until the breach that sends Eren Yeager on a ruthless quest for total freedom.",
    color: "from-stone-950 to-black",
    poster: "https://cdn.myanimelist.net/images/anime/10/47347l.jpg",
    video: "/myvideo.mp4",
    match: 99,
  },

  // --- TOP ANIME RELEASES ROW ---
  {
    id: "death_note",
    name: "Death Note",
    category: "anime",
    year: 2007,
    rating: "16+",
    duration: "37 Episodes",
    genres: ["Psychological", "Supernatural", "Suspense"],
    description:
      "A brilliant high school student discovers a supernatural notebook granting him the power to kill anyone whose name he writes, sparking a cat-and-mouse duel with detective L.",
    color: "from-zinc-950 to-black",
    poster: "https://cdn.myanimelist.net/images/anime/9/9453l.jpg",
    video: "/myvideo.mp4",
    match: 96,
  },
  {
    id: "demon_slayer",
    name: "Demon Slayer: Kimetsu no Yaiba",
    category: "anime",
    year: 2024,
    rating: "16+",
    duration: "4 Seasons",
    genres: ["Action", "Historical", "Supernatural"],
    description:
      "Tanjiro Kamado embarks on a dangerous journey to avenge his slaughtered family and find a cure to turn his sister Nezuko back into a human.",
    color: "from-cyan-950 to-black",
    poster: "https://cdn.myanimelist.net/images/anime/1286/99889l.jpg",
    video: "/myvideo.mp4",
    match: 95,
  },
  {
    id: "bleach",
    name: "Bleach: Thousand-Year Blood War",
    category: "anime",
    year: 2024,
    rating: "18+",
    duration: "3 Cour",
    genres: ["Action", "Supernatural"],
    description:
      "The Soul Society faces absolute annihilation as the Quincy empire emerges from the shadows under King Yhwach to wage the final war.",
    color: "from-indigo-950 to-black",
    poster: "https://cdn.myanimelist.net/images/anime/1908/135406l.jpg",
    video: "/myvideo.mp4",
    match: 98,
  },
  {
    id: "one_piece",
    name: "One Piece",
    category: "anime",
    year: 2024,
    rating: "13+",
    duration: "1100+ Episodes",
    genres: ["Action", "Adventure", "Fantasy"],
    description:
      "Monkey D. Luffy sets out with his pirate crew across the Grand Line to find the legendary treasure One Piece and become the Pirate King.",
    color: "from-yellow-950 to-black",
    poster: "https://cdn.myanimelist.net/images/anime/1244/138851l.jpg",
    video: "/myvideo.mp4",
    match: 94,
  },

  // --- VAULT / MASTERPIECES ROW ---
  {
    id: "steins_gate",
    name: "Steins;Gate",
    category: "latest",
    year: 2011,
    rating: "16+",
    duration: "24 Episodes",
    genres: ["Sci-Fi", "Psychological", "Thriller"],
    description:
      "Self-proclaimed mad scientist Rintaro Okabe accidentally discovers a way to send text messages into the past, triggering unforeseen divergences across worldlines.",
    color: "from-emerald-950 to-black",
    poster: "https://cdn.myanimelist.net/images/anime/5/73199l.jpg",
    video: "/myvideo.mp4",
    match: 97,
  },
  {
    id: "cowboy_bebop",
    name: "Cowboy Bebop",
    category: "latest",
    year: 1998,
    rating: "18+",
    duration: "26 Episodes",
    genres: ["Action", "Sci-Fi", "Space"],
    description:
      "Spike Spiegel and his ragtag team of bounty hunters cruise the solar system on the Bebop, chasing criminals while trying to outrun their pasts.",
    color: "from-rose-950 to-black",
    poster: "https://cdn.myanimelist.net/images/anime/4/19644l.jpg",
    video: "/myvideo.mp4",
    match: 95,
  },
  {
    id: "fma_brotherhood",
    name: "Fullmetal Alchemist: Brotherhood",
    category: "latest",
    year: 2010,
    rating: "16+",
    duration: "64 Episodes",
    genres: ["Action", "Adventure", "Fantasy"],
    description:
      "Two alchemist brothers seek the Philosopher's Stone after a disastrous failed human transmutation leaves Edward without limbs and Alphonse bound to a suit of armor.",
    color: "from-red-950 to-black",
    poster: "https://cdn.myanimelist.net/images/anime/1223/96541l.jpg",
    video: "/myvideo.mp4",
    match: 99,
  },
];
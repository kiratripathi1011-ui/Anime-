import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// High-aura posters for anime, movies, sports & series
const POSTERS = [
  // Anime
  "https://cdn.myanimelist.net/images/anime/13/17405l.jpg", // Naruto
  "https://cdn.myanimelist.net/images/anime/10/47347l.jpg", // Attack on Titan
  "https://cdn.myanimelist.net/images/anime/1171/109222l.jpg", // Jujutsu Kaisen
  "https://cdn.myanimelist.net/images/anime/1286/99889l.jpg", // Demon Slayer
  "https://cdn.myanimelist.net/images/anime/1223/96541l.jpg", // Fullmetal Alchemist
  "https://cdn.myanimelist.net/images/anime/5/73199l.jpg", // Steins;Gate
  "https://cdn.myanimelist.net/images/anime/9/9453l.jpg", // Death Note
  "https://cdn.myanimelist.net/images/anime/4/19644l.jpg", // Cowboy Bebop

  // Movies & Web Series
  "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",

  // Sports & High Octane
  "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=600&q=80",
];

// Grid dimensions (7 columns x 5 rows = 35 curved tiles)
const COLS = 7;
const ROWS = 5;

export default function DomeGallery({ onSelect }: { onSelect?: (url: string) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track standard vertical page scroll
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Smooth 3D trajectory as you scroll down:
  // 1. Pitches the dome angle up and down
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [18, 0, -18]);
  // 2. Glides slightly across the horizon
  const rotateY = useTransform(scrollYProgress, [0, 0.5, 1], [-8, 0, 8]);
  // 3. Rolls the tiles upward so different rows pass through view
  const translateY = useTransform(scrollYProgress, [0, 1], [120, -120]);
  // 4. Subtle zoom in/out depth
  const translateZ = useTransform(scrollYProgress, [0, 0.5, 1], [-120, 40, -100]);

  return (
    <div
      ref={containerRef}
      className="relative h-[180vh] w-full bg-[#050507] overflow-hidden flex items-center justify-center"
    >
      {/* 3D Perspective Viewport */}
      <div
        className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden"
        style={{ perspective: "1000px" }}
      >
        {/* Ambient background glow behind the dome */}
        <div className="pointer-events-none absolute h-[600px] w-[900px] rounded-full bg-purple-900/20 blur-[150px]" />

        {/* Outer Headline */}
        <div className="absolute top-12 z-20 text-center pointer-events-none">
          <span className="text-xs font-mono tracking-[0.3em] uppercase text-purple-400">
            Omni-Dome Vault // Matrix
          </span>
          <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-white/90">
            Immersive Media Sphere
          </h2>
        </div>

        {/* 3D Curved Inverted Shell */}
        <motion.div
          style={{
            rotateX,
            rotateY,
            translateY,
            translateZ,
            transformStyle: "preserve-3d",
          }}
          className="relative grid grid-cols-7 gap-3 md:gap-4 p-8 pointer-events-auto select-none"
        >
          {Array.from({ length: ROWS }).map((_, rIdx) => {
            // Row curvature angle (curves along the Y-axis: top and bottom curve toward the viewer)
            const rOffset = rIdx - Math.floor(ROWS / 2);
            const curveX = rOffset * -9; // angle in deg

            return Array.from({ length: COLS }).map((_, cIdx) => {
              // Col curvature angle (curves along the X-axis: edges bow toward the camera)
              const cOffset = cIdx - Math.floor(COLS / 2);
              const curveY = cOffset * 10; // angle in deg
              // Push corners further forward/backward for true bowl/dome curvature
              const depthZ = -Math.abs(cOffset) * 28 - Math.abs(rOffset) * 22;

              const posterIndex = (rIdx * COLS + cIdx) % POSTERS.length;
              const posterUrl = POSTERS[posterIndex];

              return (
                <motion.div
                  key={`${rIdx}-${cIdx}`}
                  style={{
                    transform: `rotateY(${curveY}deg) rotateX(${curveX}deg) translateZ(${depthZ}px)`,
                    transformStyle: "preserve-3d",
                  }}
                  whileHover={{
                    scale: 1.15,
                    translateZ: depthZ + 60,
                    zIndex: 40,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  onClick={() => onSelect && onSelect(posterUrl)}
                  className="group relative h-28 w-24 sm:h-36 sm:w-32 md:h-48 md:w-40 cursor-pointer overflow-hidden rounded-xl border border-white/10 bg-zinc-950/80 shadow-2xl transition-all duration-300 hover:border-purple-400/80 hover:shadow-[0_0_30px_rgba(168,85,247,0.5)]"
                >
                  {/* Poster Image with Dome Tint */}
                  <img
                    src={posterUrl}
                    alt="Dome item"
                    loading="lazy"
                    className="h-full w-full object-cover grayscale contrast-125 transition-all duration-500 group-hover:grayscale-0 group-hover:scale-110"
                  />

                  {/* Glass Shimmer Outline */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity" />
                  <div className="absolute inset-0 rounded-xl border border-white/5 group-hover:border-purple-400/50 pointer-events-none" />
                </motion.div>
              );
            });
          })}
        </motion.div>

        {/* Soft Edge Vignette Mask to blend into the dark page */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,#050507_85%)]" />
      </div>
    </div>
  );
}
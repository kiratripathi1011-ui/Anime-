import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, ChevronDown } from "lucide-react";

export default function IntroHero() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll inside this hero container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Typography splits and zooms out smoothly on scroll
  const leftTextX = useTransform(scrollYProgress, [0, 0.6], [0, -180]);
  const rightTextX = useTransform(scrollYProgress, [0, 0.6], [0, 180]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  // Center liquid aura orb expands into the purple shockwave (like the video)
  const orbScale = useTransform(scrollYProgress, [0, 0.5, 0.9], [1, 3.8, 14]);
  const orbOpacity = useTransform(scrollYProgress, [0, 0.7, 1], [0.85, 0.95, 0]);

  // Reveal description card
  const cardOpacity = useTransform(scrollYProgress, [0.35, 0.65], [0, 1]);
  const cardY = useTransform(scrollYProgress, [0.35, 0.65], [60, 0]);

  return (
    <div ref={containerRef} className="relative h-[250vh] bg-[#050507]">
      {/* Sticky Fullscreen Canvas Viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        
        {/* Subtle Background Grid and Ambient Aura Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(88,28,135,0.2)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

        {/* --- CENTRAL FLUID / LIQUID AURA OBJECT --- */}
        <motion.div
          style={{
            scale: orbScale,
            opacity: orbOpacity,
          }}
          className="pointer-events-none absolute z-10 flex items-center justify-center"
        >
          {/* Outer Shockwave Ring */}
          <div className="w-56 h-56 md:w-80 md:h-80 rounded-full bg-gradient-to-tr from-purple-600/40 via-fuchsia-500/30 to-violet-900/50 blur-[60px] animate-pulse" />
          
          {/* Inner 3D Glass Artifact */}
          <div className="absolute w-36 h-36 md:w-48 md:h-48 rounded-full border border-purple-400/40 bg-gradient-to-br from-white/10 via-purple-500/20 to-transparent backdrop-blur-xl shadow-[0_0_60px_rgba(168,85,247,0.4)] flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-purple-200 animate-spin" style={{ animationDuration: "12s" }} />
          </div>
        </motion.div>

        {/* --- SPLIT EDITORIAL TYPOGRAPHY --- */}
        <div className="relative z-20 flex items-center justify-between w-full max-w-6xl px-6 md:px-12 select-none">
          {/* Left Word ("DOH" / "BORN") */}
          <motion.div
            style={{ x: leftTextX, opacity: textOpacity }}
            className="flex flex-col text-left"
          >
            <span className="text-xs font-mono tracking-[0.35em] text-purple-400 uppercase mb-2">
              Dimension // 01
            </span>
            <h1 className="text-5xl sm:text-7xl md:text-9xl font-serif tracking-tighter text-zinc-100 uppercase font-light">
              DOH
            </h1>
          </motion.div>

          {/* Right Word ("STREAM" / "NATURE") */}
          <motion.div
            style={{ x: rightTextX, opacity: textOpacity }}
            className="flex flex-col text-right"
          >
            <span className="text-xs font-mono tracking-[0.35em] text-zinc-500 uppercase mb-2">
              Beyond Limits
            </span>
            <h1 className="text-5xl sm:text-7xl md:text-9xl font-serif tracking-tighter text-zinc-100 uppercase font-light">
              STREAM
            </h1>
          </motion.div>
        </div>

        {/* --- SCROLL REVEAL CARD (Appears during the mid-scroll blast) --- */}
        <motion.div
          style={{
            opacity: cardOpacity,
            y: cardY,
          }}
          className="absolute z-20 max-w-xl text-center px-6"
        >
          <div className="p-8 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-2xl shadow-[0_0_80px_rgba(168,85,247,0.2)]">
            <span className="inline-block text-xs font-mono tracking-widest text-purple-400 uppercase mb-3">
              Transcending Dimensions
            </span>
            <p className="text-lg md:text-xl font-light text-zinc-300 leading-relaxed">
              We design digital experiences that captivate, innovate, and transform. Continuous stream architecture with uncompromising aura.
            </p>
          </div>
        </motion.div>

        {/* Scroll Indicator at bottom */}
        <motion.div
          style={{ opacity: textOpacity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-zinc-500 text-xs font-mono tracking-widest uppercase"
        >
          <span>Scroll Down</span>
          <ChevronDown className="w-4 h-4 animate-bounce text-purple-400" />
        </motion.div>
      </div>
    </div>
  );
}
import {
  ChevronLeft,
  ChevronRight,
  Compass,
  Gamepad2,
  Globe,
  Home,
  Search,
  Sparkles,
  Star,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { type GameCategory, games } from "./data/games";

type FilterCategory = "all" | GameCategory;

const NAV_LINKS = [
  { label: "HOME", icon: Home },
  { label: "EXPLORE", icon: Compass },
  { label: "NEW", icon: Sparkles },
  { label: "MULTIPLAYER", icon: Users },
  { label: "BROWSE", icon: Globe },
  { label: "ABOUT", icon: Zap },
];

const CATEGORY_FILTERS: { label: string; value: FilterCategory }[] = [
  { label: "ALL", value: "all" },
  { label: "ACTION", value: "action" },
  { label: "ADVENTURE", value: "adventure" },
  { label: "PUZZLE", value: "puzzle" },
  { label: "CASUAL", value: "casual" },
  { label: "ARCADE", value: "arcade" },
  { label: "RACING", value: "racing" },
  { label: "SPORTS", value: "sports" },
  { label: "2 PLAYERS", value: "multiplayer-2p" },
  { label: "4 PLAYERS", value: "multiplayer-4p" },
  { label: "6 PLAYERS", value: "multiplayer-6p" },
];

const HERO_SLIDES = [
  {
    id: "slide-1",
    title: "LEVEL UP",
    subtitle: "YOUR GAME!",
    desc: "100+ games waiting. Jump in and dominate the leaderboard.",
    bg: "linear-gradient(135deg, #3D0066 0%, #C00050 50%, #FF6600 100%)",
    emoji: "🎮",
  },
  {
    id: "slide-2",
    title: "PLAY WITH",
    subtitle: "FRIENDS!",
    desc: "2P, 4P & 6P multiplayer modes — challenge your crew.",
    bg: "linear-gradient(135deg, #00338C 0%, #006699 50%, #00CC88 100%)",
    emoji: "👥",
  },
  {
    id: "slide-3",
    title: "UNLOCK NEW",
    subtitle: "ADVENTURES!",
    desc: "From Subway Surfers to Minecraft — every genre covered.",
    bg: "linear-gradient(135deg, #CC5500 0%, #FF3366 50%, #9900CC 100%)",
    emoji: "🏆",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-3 h-3 ${
            s <= Math.round(rating)
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-600"
          }`}
        />
      ))}
      <span className="text-xs text-muted-foreground ml-1">{rating}</span>
    </div>
  );
}

function GameCard({ game, index }: { game: (typeof games)[0]; index: number }) {
  const playerColor =
    game.category === "multiplayer-2p"
      ? "bg-blue-900/60 text-blue-300 border-blue-700"
      : game.category === "multiplayer-4p"
        ? "bg-purple-900/60 text-purple-300 border-purple-700"
        : game.category === "multiplayer-6p"
          ? "bg-orange-900/60 text-orange-300 border-orange-700"
          : "bg-[#071A2F] text-[#9BB0C6] border-[#123A55]";

  return (
    <motion.div
      data-ocid={`games.item.${index + 1}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.6) }}
      className="card-hover rounded-2xl border border-[#123A55] bg-[#071A2F] p-3 flex flex-col gap-2 group cursor-pointer"
      style={{ boxShadow: "0 2px 12px rgba(23,227,214,0.08)" }}
    >
      <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-[#0A1C33] to-[#071427] aspect-square flex items-center justify-center border border-[#123A55] group-hover:border-[#17E3D6] transition-colors duration-200">
        <span style={{ fontSize: "2.8rem" }} className="select-none">
          {game.emoji}
        </span>
        <span
          className={`absolute top-1.5 right-1.5 text-xs font-bold px-1.5 py-0.5 rounded-md border ${playerColor}`}
        >
          {game.players}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-xs font-bold text-[#EAF2FF] uppercase tracking-wide leading-tight line-clamp-2">
          {game.title}
        </h3>
        <StarRating rating={game.rating} />
      </div>
      <button
        type="button"
        data-ocid={`games.primary_button.${index + 1}`}
        className="mt-auto w-full py-1.5 rounded-lg border border-[#17E3D6] text-[#17E3D6] text-xs font-bold uppercase tracking-widest transition-all duration-200 hover:bg-[#17E3D6] hover:text-[#050A14] hover:shadow-neon"
      >
        PLAY
      </button>
    </motion.div>
  );
}

export default function App() {
  const [activeNav, setActiveNav] = useState("HOME");
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [heroSlide, setHeroSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setHeroSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setHeroSlide(
      (prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length,
    );
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextSlide, 3000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  const filteredGames = games.filter((g) => {
    const matchesFilter = activeFilter === "all" || g.category === activeFilter;
    const matchesSearch = g.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const currentYear = new Date().getFullYear();

  return (
    <div
      className="min-h-screen font-montserrat"
      style={{
        background:
          "linear-gradient(180deg, #050A14 0%, #071427 40%, #0A1C33 100%)",
      }}
    >
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[#123A55] bg-[#050A14]/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="text-[10px] font-semibold text-[#9BB0C6] uppercase tracking-[0.2em] leading-tight">
              PINDU
            </div>
            <div
              className="text-2xl font-black uppercase tracking-tight leading-none neon-text"
              style={{
                background: "linear-gradient(90deg, #17E3D6, #2AA6FF)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              TIWANA
            </div>
          </div>

          {/* Right cluster */}
          <div className="flex items-center gap-3 flex-1 justify-end">
            {/* Search bar */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#17E3D6]" />
              <input
                data-ocid="header.search_input"
                type="text"
                placeholder="Search games, genres…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#071A2F] border border-[#17E3D6] rounded-full pl-9 pr-4 py-2 text-sm text-[#EAF2FF] placeholder-[#9BB0C6] outline-none focus:shadow-neon transition-shadow duration-200"
              />
            </div>
            {/* Login button */}
            <button
              type="button"
              data-ocid="header.primary_button"
              className="flex-shrink-0 px-4 py-2 rounded-full border border-[#17E3D6] text-[#17E3D6] text-sm font-bold uppercase tracking-wider transition-all duration-200 hover:bg-[#17E3D6] hover:text-[#050A14] hover:shadow-neon"
            >
              Login
            </button>
          </div>
        </div>

        {/* Primary nav */}
        <nav className="border-t border-[#123A55] bg-[#05101F]/80">
          <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 overflow-x-auto scrollbar-hide">
            {NAV_LINKS.map(({ label, icon: Icon }) => (
              <button
                key={label}
                type="button"
                data-ocid="nav.link"
                onClick={() => setActiveNav(label)}
                className={`flex items-center gap-1.5 px-4 py-3 text-xs font-semibold uppercase tracking-widest whitespace-nowrap transition-all duration-200 relative ${
                  activeNav === label
                    ? "text-[#17E3D6]"
                    : "text-[#9BB0C6] hover:text-[#EAF2FF]"
                }`}
              >
                <Icon className="w-3 h-3" />
                {label}
                {activeNav === label && (
                  <span
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#17E3D6] rounded-t-full"
                    style={{ boxShadow: "0 0 6px #17E3D6" }}
                  />
                )}
              </button>
            ))}
          </div>
        </nav>
      </header>

      <main>
        {/* Hero Carousel */}
        <section className="max-w-7xl mx-auto px-4 py-8 grid-bg">
          <div
            className="relative rounded-3xl overflow-hidden border border-[#17E3D6] neon-glow-strong"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={heroSlide}
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ duration: 0.4 }}
                className="relative h-64 md:h-80 flex items-center justify-between px-8 md:px-16"
                style={{ background: HERO_SLIDES[heroSlide].bg }}
              >
                <div className="flex flex-col gap-3 z-10">
                  <div>
                    <div className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white/90 leading-none">
                      {HERO_SLIDES[heroSlide].title}
                    </div>
                    <div
                      className="text-4xl md:text-6xl font-black uppercase tracking-tight leading-none"
                      style={{
                        color: "#17E3D6",
                        textShadow: "0 0 20px #17E3D6",
                      }}
                    >
                      {HERO_SLIDES[heroSlide].subtitle}
                    </div>
                  </div>
                  <p className="text-white/70 text-sm max-w-sm">
                    {HERO_SLIDES[heroSlide].desc}
                  </p>
                  <button
                    type="button"
                    data-ocid="hero.primary_button"
                    className="self-start px-8 py-3 rounded-full font-black text-sm uppercase tracking-widest transition-all duration-200"
                    style={{
                      background: "#17E3D6",
                      color: "#050A14",
                      boxShadow: "0 0 20px #17E3D6",
                    }}
                  >
                    PLAY NOW
                  </button>
                </div>
                <div className="text-[6rem] md:text-[9rem] select-none opacity-80">
                  {HERO_SLIDES[heroSlide].emoji}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Carousel controls */}
            <button
              type="button"
              data-ocid="hero.secondary_button"
              onClick={prevSlide}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full border border-[#17E3D6]/50 bg-black/40 flex items-center justify-center hover:bg-[#17E3D6]/20 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-[#17E3D6]" />
            </button>
            <button
              type="button"
              data-ocid="hero.primary_button"
              onClick={nextSlide}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full border border-[#17E3D6]/50 bg-black/40 flex items-center justify-center hover:bg-[#17E3D6]/20 transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-[#17E3D6]" />
            </button>

            {/* Dot indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {HERO_SLIDES.map((slide, i) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setHeroSlide(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === heroSlide
                      ? "w-6 h-2 bg-[#17E3D6]"
                      : "w-2 h-2 bg-white/30 hover:bg-white/60"
                  }`}
                  style={
                    i === heroSlide ? { boxShadow: "0 0 8px #17E3D6" } : {}
                  }
                />
              ))}
            </div>
          </div>
        </section>

        {/* Games Section */}
        <section className="max-w-7xl mx-auto px-4 py-8">
          {/* Section header */}
          <div className="flex items-center gap-3 mb-6">
            <Gamepad2
              className="w-6 h-6 text-[#17E3D6]"
              style={{ filter: "drop-shadow(0 0 6px #17E3D6)" }}
            />
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-widest text-[#EAF2FF]">
              EXPLORE ALL GAMES
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-[#17E3D6]/30 to-transparent" />
            <span className="text-sm text-[#9BB0C6] font-semibold">
              {filteredGames.length} games
            </span>
          </div>

          {/* Category filter pills */}
          <div data-ocid="games.tab" className="flex flex-wrap gap-2 mb-8">
            {CATEGORY_FILTERS.map(({ label, value }) => (
              <button
                key={value}
                type="button"
                onClick={() => setActiveFilter(value)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-all duration-200 ${
                  activeFilter === value
                    ? "bg-[#17E3D6] text-[#050A14] border-[#17E3D6]"
                    : "bg-[#071A2F] text-[#9BB0C6] border-[#123A55] hover:border-[#17E3D6] hover:text-[#17E3D6]"
                }`}
                style={
                  activeFilter === value
                    ? { boxShadow: "0 0 10px rgba(23,227,214,0.5)" }
                    : {}
                }
              >
                {label}
              </button>
            ))}
          </div>

          {/* Game grid */}
          {filteredGames.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredGames.map((game, idx) => (
                <GameCard key={game.id} game={game} index={idx} />
              ))}
            </div>
          ) : (
            <div
              data-ocid="games.empty_state"
              className="flex flex-col items-center py-24 gap-4"
            >
              <Trophy className="w-16 h-16 text-[#123A55]" />
              <p className="text-[#9BB0C6] font-semibold">
                No games found. Try a different search.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setActiveFilter("all");
                }}
                className="px-6 py-2 rounded-full border border-[#17E3D6] text-[#17E3D6] text-sm font-bold hover:bg-[#17E3D6] hover:text-[#050A14] transition-all"
              >
                Clear filters
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-[#123A55] bg-[#050A14]/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Brand */}
            <div>
              <div className="text-[9px] font-semibold text-[#9BB0C6] uppercase tracking-[0.25em]">
                PINDU
              </div>
              <div
                className="text-lg font-black uppercase tracking-tight"
                style={{
                  background: "linear-gradient(90deg, #17E3D6, #2AA6FF)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                TIWANA PLAYS
              </div>
            </div>

            {/* Footer links */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-[#9BB0C6] uppercase tracking-wider">
              {["Games", "About", "Contact", "Privacy", "Terms"].map((link) => (
                <a
                  key={link}
                  href="/"
                  className="hover:text-[#17E3D6] transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>

            {/* Social + copyright */}
            <div className="text-right">
              <p className="text-xs text-[#9BB0C6]">
                © {currentYear} PINDU TIWANA. All rights reserved.
              </p>
              <p className="text-xs text-[#123A55] mt-1">
                Built with ❤️ using{" "}
                <a
                  href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                    typeof window !== "undefined"
                      ? window.location.hostname
                      : "",
                  )}`}
                  className="hover:text-[#17E3D6] transition-colors"
                >
                  caffeine.ai
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const cards = [
    {
        title: "Bring Voices Together",
        desc: "We bring scholars, artists, historians, and cultural practitioners from India and across the world to share perspectives that deepen understanding of tradition, philosophy, and cultural expression.",
        poster: "/card1.png",
        video: "/bring-voices.mp4",
    },
    {
        title: "Annual Cultural Mela",
        poster: "/card2.png",
        video: "/cultural-mela.mp4",
    },
    {
        title: "Curate Monthly Experiences",
        poster: "/card3.png",
        video: "/monthly-experiences.mp4",
    },
    {
        title: "Cultural Challenges",
        poster: "/card4.png",
        video: "/cultural-challenges.mp4",
    },
];

export default function HowWeBringCultureToLife() {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <section className="relative w-full bg-[#efb896] overflow-hidden">
            <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16 md:pt-24 pb-32 md:pb-48 text-center">

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-6 text-3xl md:text-5xl font-serif text-[#5d1f08]"
                >
                    How We Bring <br className="hidden md:block" /> Culture To Life
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="mx-auto mb-10 md:mb-16 max-w-3xl text-sm md:text-base text-[#5d1f08]/80 leading-relaxed font-light"
                >
                    We curate conversations and experiences that explore India’s rich cultural landscape
                    through voices that carry knowledge, practice, and lived wisdom.
                </motion.p>

                {/* CARDS CONTAINER */}
                <div
                    className="flex flex-row gap-4 mb-12 md:mb-16 h-[550px] md:h-[450px] lg:h-[500px] overflow-x-auto md:overflow-visible snap-x snap-mandatory no-scrollbar items-stretch"
                    onMouseLeave={() => setHoveredIndex(null)}
                >
                    {cards.map((card, index) => (
                        <motion.div
                            key={index}
                            onMouseEnter={() => setHoveredIndex(index)}
                            animate={{
                                flex: typeof window !== 'undefined' && window.innerWidth < 768
                                    ? "0 0 85%"
                                    : (hoveredIndex === index ? 3 : 1)
                            }}
                            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            className="relative rounded-2xl md:rounded-3xl overflow-hidden group cursor-pointer shadow-xl snap-center shrink-0 md:shrink md:flex-1"
                        >
                            {/* VIDEO LAYER */}
                            <video
                                src={card.video}
                                muted
                                loop
                                playsInline
                                autoPlay
                                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${hoveredIndex === index ? "opacity-100" : "opacity-0 md:opacity-0"
                                    }`}
                            />

                            {/* POSTER LAYER */}
                            <Image
                                src={card.poster}
                                alt={card.title}
                                fill
                                sizes="(max-width: 768px) 100vw, 25vw"
                                className={`object-cover transition-opacity duration-700 ${hoveredIndex === index ? "md:opacity-0" : "opacity-100"
                                    }`}
                            />

                            {/* GRADIENTS: Top for title, bottom for description */}
                            <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/60 to-transparent opacity-80" />
                            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />

                            {/* TOP CONTENT: TITLE ONLY */}
                            <div className="absolute top-6 left-6 right-6 md:top-8 md:left-8 md:right-8 z-20">
                                <motion.h3
                                    layout
                                    className="font-serif text-white text-lg md:text-xl lg:text-2xl leading-tight"
                                >
                                    {card.title}
                                </motion.h3>
                            </div>

                            {/* BOTTOM CONTENT: DESCRIPTION ONLY */}
                            <div className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-8 md:right-8 z-20">
                                <AnimatePresence>
                                    {hoveredIndex === index && card.desc && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 20 }}
                                            transition={{ duration: 0.4 }}
                                            className="hidden md:block overflow-hidden"
                                        >
                                            <p className="text-sm lg:text-base text-white/90 leading-relaxed bg-black/20 backdrop-blur-md p-5 rounded-2xl border border-white/10">
                                                {card.desc}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Mobile Fallback: Simple text at bottom */}
                                <p className="md:hidden text-xs text-white/80 line-clamp-3">
                                    {card.desc}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <button className="rounded-lg bg-[#95170B] px-8 py-3 text-sm font-medium text-white shadow-lg transition hover:bg-[#5d1f08] active:scale-95">
                    Know More
                </button>
            </div>

            {/* SVG WAVE */}
            <div className="absolute bottom-0 left-0 w-full pointer-events-none leading-[0]">
                <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="w-full h-[120px] md:h-[240px]">
                    <path
                        fill="#fdfaf1"
                        d="M0,160 C320,300 1120,50 1440,200 L1440,320 L0,320 Z"
                    />
                </svg>
            </div>

            <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
        </section>
    );
}


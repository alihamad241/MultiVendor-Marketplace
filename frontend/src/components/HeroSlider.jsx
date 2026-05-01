import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
    {
        id: 0,
        title: "Fashion For You",
        text: "Discover our seasonal collection — effortless silhouettes and timeless pieces crafted for everyday wear.",
        image: "/assets/img/slider/slider_2.png",
    },
    {
        id: 1,
        title: "Fashion For You",
        text: "Elevate your wardrobe with statement tops, tailored denim, and versatile outerwear for every occasion.",
        image: "/assets/img/slider/slide_1.png",
    },
    {
        id: 2,
        title: "Fashion For You",
        text: "Shop sustainable fabrics and modern cuts — quality you can feel and style you'll love season after season.",
        image: "/assets/img/slider/slider_3.png",
    },
];

export default function HeroSlider({ autoplay = true, interval = 8000 }) {
    const [[page, direction], setPage] = useState([0, 0]);
    const index = ((page % slides.length) + slides.length) % slides.length;
    const timeoutRef = useRef(null);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (!autoplay) return;
        if (isPaused) return;
        timeoutRef.current = setTimeout(() => {
            paginate(1);
        }, interval);
        return () => clearTimeout(timeoutRef.current);
    }, [page, isPaused, autoplay, interval]);

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === "ArrowRight") paginate(1);
            if (e.key === "ArrowLeft") paginate(-1);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    const paginate = (delta) => {
        if (!delta) return;
        const direction = delta > 0 ? 1 : -1;
        setPage(([p]) => [p + delta, direction]);
    };

    // Simple swipe handling
    const touchStartX = useRef(0);
    const handleTouchStart = (e) =>
        (touchStartX.current = e.touches[0].clientX);
    const handleTouchEnd = (e) => {
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(dx) > 50) paginate(dx > 0 ? -1 : 1);
    };

    const variants = {
        enter: (dir) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
        center: { x: "0%", opacity: 1 },
        exit: (dir) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
    };

    return (
        <section className="pos_home_section py-8 md:py-12">
            <div className="w-full">
                <div className="mx-auto max-w-7xl px-0">
                    <div className="flex flex-wrap -mx-4">
                        <div className="w-full">
                            <div
                                className="banner_slider slider_two relative overflow-hidden w-full min-h-[60vh]"
                                onMouseEnter={() => setIsPaused(true)}
                                onMouseLeave={() => setIsPaused(false)}
                                onTouchStart={handleTouchStart}
                                onTouchEnd={handleTouchEnd}>
                                <AnimatePresence
                                    initial={false}
                                    custom={direction}
                                    mode="wait">
                                    <motion.div
                                        key={index}
                                        className="single_slider absolute inset-0 bg-center bg-cover flex items-center justify-center min-h-[60vh]"
                                        style={{
                                            backgroundImage: `url(${slides[index].image})`,
                                            pointerEvents: "none",
                                        }}
                                        custom={direction}
                                        variants={variants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        transition={{ duration: 0.7 }}>
                                        <div className="w-full h-full">
                                            <div className="slider_content h-full">
                                                <div
                                                    className="slider_content_inner max-w-xl text-center mx-auto py-6 md:py-8 text-white px-4 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                                                    style={{
                                                        pointerEvents: "auto",
                                                    }}>
                                                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                                                        {slides[index].title}
                                                    </h1>
                                                    <p className="mt-4">
                                                        {slides[index].text}
                                                    </p>
                                                    <a
                                                        href="#"
                                                        className="inline-block mt-6 bg-blue-600 text-white px-5 py-2 rounded">
                                                        shop now
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>

                                {/* Arrows */}
                                <button
                                    aria-label="Previous"
                                    className="absolute left-4 top-1/2 -translate-y-1/2 z-50 bg-black/40 text-white p-2 rounded-full pointer-events-auto cursor-pointer"
                                    onClick={() => paginate(-1)}>
                                    ‹
                                </button>
                                <button
                                    aria-label="Next"
                                    className="absolute right-4 top-1/2 -translate-y-1/2 z-50 bg-black/40 text-white p-2 rounded-full pointer-events-auto cursor-pointer"
                                    onClick={() => paginate(1)}>
                                    ›
                                </button>

                                {/* Dots */}
                                <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-50 pointer-events-auto">
                                    {slides.map((s, i) => (
                                        <button
                                            key={s.id}
                                            onClick={() => {
                                                const delta = i - index;
                                                if (delta !== 0)
                                                    paginate(delta);
                                            }}
                                            className={`w-3 h-3 rounded-full ${
                                                i === index
                                                    ? "bg-white"
                                                    : "bg-white/50"
                                            }`}
                                            aria-label={`Go to slide ${i + 1}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

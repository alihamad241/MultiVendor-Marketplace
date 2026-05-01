import React, { useEffect, useRef, useState } from "react";

export default function Carousel({
    children,
    autoplay = false,
    interval = 5000,
    className = "",
}) {
    const trackRef = useRef(null);
    const containerRef = useRef(null);
    const [pages, setPages] = useState(1);
    const [pageIndex, setPageIndex] = useState(0);
    const autoplayRef = useRef(null);
    const [itemsPerPage, setItemsPerPage] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const pointerIdRef = useRef(null);
    const dragStartX = useRef(0);
    const dragStartScroll = useRef(0);

    // Filter children to remove null/false/undefined (Fixes ghost element spacing)
    const validChildren = React.Children.toArray(children).filter(Boolean);

    useEffect(() => {
        const compute = () => {
            const c = containerRef.current;
            const t = trackRef.current;
            if (!c || !t) return;
            const visibleW = c.clientWidth;

            // Determine items per page
            let per = 1;
            if (visibleW >= 1024) per = 4;
            else if (visibleW >= 768) per = 2;
            else per = 1;
            setItemsPerPage(per);

            const childCount = validChildren.length || 1;
            const p = Math.max(1, Math.ceil(childCount / per));
            setPages(p);

            // clamp current index to available children
            setCurrentIndex((ci) => Math.min(ci, Math.max(0, childCount - 1)));
            // update page index so dots/pages remain consistent
            setPageIndex((ci) => Math.min(ci, Math.max(0, p - 1)));

            // ensure track starts scrolled to the left when layout changes

            requestAnimationFrame(() => {
                try {
                    // scroll the actual scrollable element (track)

                    if (trackRef.current)
                        trackRef.current.scrollTo({ left: 0 });
                } catch (e) {}
            });
        };

        compute();
        const ro = new ResizeObserver(compute);
        if (containerRef.current) ro.observe(containerRef.current);

        return () => ro.disconnect();
    }, [validChildren.length]); // Depend on the COUNT of valid children

    // Force scroll reset when data changes (Fixes the whitespace on load issue)
    useEffect(() => {
        if (trackRef.current) {
            trackRef.current.scrollTo({ left: 0, behavior: "auto" });
            setPageIndex(0);
        }
    }, [validChildren.length]);

    useEffect(() => {
        if (!autoplay) return;
        if (autoplayRef.current) clearInterval(autoplayRef.current);
        autoplayRef.current = setInterval(() => {
            goToPage((pageIndex + 1) % pages);
        }, interval);
        return () => clearInterval(autoplayRef.current);
    }, [autoplay, interval, pageIndex, pages]);

    // Item-based navigation: move by one item width
    const goToItem = (i) => {
        const t = trackRef.current;
        if (!t) return;
        const firstChild = t.children[0];
        const itemWidth = firstChild ? firstChild.clientWidth : t.clientWidth;
        const clamped = Math.min(Math.max(0, i), Math.max(0, validChildren.length - 1));
        const left = Math.round(clamped * itemWidth);
        t.scrollTo({ left, behavior: "smooth" });
        setCurrentIndex(clamped);
        setPageIndex(Math.floor(clamped / Math.max(1, itemsPerPage)));
    };

    const next = () => goToItem(currentIndex + 1);
    const prev = () => goToItem(currentIndex - 1);

    return (
        <div className={`${className} relative group`}>
            <div
                ref={containerRef}
                className="overflow-hidden w-full"
                style={{ scrollSnapType: "x mandatory" }}>
                <div
                    ref={trackRef}
                    // IMPORTANT: w-full ensures it spans the full container
                    // justify-start ensures items start from the left, not centered
                    className="flex w-full justify-start"
                    style={{
                        overflowX: "auto",
                        scrollSnapType: "x mandatory",
                        scrollbarWidth: "none",
                        msOverflowStyle: "none", // IE/Edge hide scrollbar
                    }}>
                    {validChildren.map((child, idx) => {
                        const pct =
                            itemsPerPage > 0
                                ? `${100 / itemsPerPage}%`
                                : "100%";
                        return (
                            <div
                                key={idx}
                                style={{
                                    scrollSnapAlign: "start",
                                    flex: `0 0 ${pct}`, // Shorthand for flex-grow, flex-shrink, flex-basis
                                    maxWidth: pct,
                                    width: pct, // Force explicit width
                                    boxSizing: "border-box",
                                }}
                                className="shrink-0">
                                {child}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Arrows */}
            {pages > 1 && (
                <>
                    <button
                        onClick={prev}
                        className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition-opacity duration-200 ${
                            pageIndex === 0
                                ? "opacity-0 pointer-events-none"
                                : "opacity-100"
                        }`}
                        aria-label="Previous">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-5 h-5">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15.75 19.5L8.25 12l7.5-7.5"
                            />
                        </svg>
                    </button>
                    <button
                        onClick={next}
                        className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition-opacity duration-200 ${
                            pageIndex === pages - 1
                                ? "opacity-0 pointer-events-none"
                                : "opacity-100"
                        }`}
                        aria-label="Next">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-5 h-5">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M8.25 4.5l7.5 7.5-7.5 7.5"
                            />
                        </svg>
                    </button>
                </>
            )}
        </div>
    );
}

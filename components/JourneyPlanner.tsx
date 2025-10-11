"use client";

import { useEffect, useRef } from "react";

/**
 * JourneyPlanner
 * - Displays a vertical timeline of journey “stops”
 * - Each stop fades/slides in on scroll (IntersectionObserver)
 * - Optional “promptNote” line (use for Arthur’s Pass necklace prompt)
 * - Supports per-segment travel icon: "plane" | "car"
 *
 * Images:
 *   Use Webflow or CDN URLs or public assets. The component just renders the URL you provide.
 */

type Stop = {
  id: string;
  title: string;
  location?: string;
  date?: string;
  imageUrl?: string;
  caption?: string;
  promptNote?: string; // e.g., "Tell me about this piece of New Zealand craftsmanship…"
  travel?: "plane" | "car"; // icon displayed leading into this stop
};

type Props = {
  stops: Stop[];
};

export default function JourneyPlanner({ stops }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const els = container.querySelectorAll<HTMLElement>(".reveal");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("show");
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.15 }
    );

    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const Icon = ({ type }: { type?: "plane" | "car" }) => {
    if (!type) return null;
    const src =
      type === "plane" ? "/Journey/icon/plane.svg" : "/Journey/icon/car.svg";
    const alt = type === "plane" ? "Plane" : "Car";
    return (
      <img
        src={src}
        alt={alt}
        aria-hidden="true"
        className="icon"
        width={22}
        height={22}
      />
    );
  };

  return (
    <section ref={containerRef} className="journey">
      <h1 className="title">Journey Planner</h1>

      <ol className="timeline">
        {stops.map((s, idx) => (
          <li key={s.id} className="item reveal">
            {/* Connector + icon */}
            <div className="rail">
              {idx > 0 && <span className="line" aria-hidden="true" />}
              <span className="dot" aria-hidden="true" />
              <span className="travel">
                <Icon type={s.travel} />
              </span>
            </div>

            {/* Content card */}
            <article className="card">
              {s.imageUrl && (
                <div className="media">
                  <img
                    src={s.imageUrl}
                    alt={s.caption || s.title}
                    loading="lazy"
                  />
                </div>
              )}

              <div className="meta">
                <h2 className="stopTitle">{s.title}</h2>
                {(s.location || s.date) && (
                  <p className="subtle">
                    {s.location && <span>{s.location}</span>}
                    {s.location && s.date && <span> • </span>}
                    {s.date && <span>{s.date}</span>}
                  </p>
                )}
                {s.caption && <p className="body">{s.caption}</p>}

                {/* Special prompt note (e.g., Arthur’s Pass necklace) */}
                {s.promptNote && (
                  <p className="note">💬 {s.promptNote}</p>
                )}
              </div>
            </article>
          </li>
        ))}
      </ol>

      <style jsx>{`
        .journey {
          --bg: #0b0e12;
          --panel: #12161c;
          --muted: #8ea0b5;
          --text: #e8eef6;
          --accent: #7aa2ff;

          padding: 48px 20px 80px;
          background: linear-gradient(180deg, #0a0d12 0%, #0b0e12 100%);
          color: var(--text);
        }

        .title {
          font-size: clamp(28px, 2.4vw, 40px);
          font-weight: 700;
          letter-spacing: 0.3px;
          text-align: center;
          margin: 0 0 28px;
        }

        .timeline {
          width: min(980px, 100%);
          margin: 0 auto;
          list-style: none;
          padding: 0;
        }

        .item {
          display: grid;
          grid-template-columns: 42px 1fr;
          gap: 16px;
          align-items: flex-start;
          margin-bottom: 28px;
        }

        /* Scroll reveal */
        .reveal {
          opacity: 0;
          transform: translateY(14px);
          transition: opacity 600ms ease, transform 600ms ease;
        }
        .reveal.show {
          opacity: 1;
          transform: translateY(0);
        }

        .rail {
          position: relative;
          display: grid;
          place-items: center;
          padding-top: 2px;
        }
        .line {
          position: absolute;
          top: -28px;
          bottom: 16px;
          width: 2px;
          background: linear-gradient(180deg, #1b2230, #2a3446);
        }
        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 0 4px rgba(122, 162, 255, 0.18);
          z-index: 2;
        }
        .travel {
          position: absolute;
          top: -26px;
          background: #0e131a;
          border: 1px solid #1f2a3b;
          border-radius: 10px;
          padding: 6px 8px;
          display: grid;
          place-items: center;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.35);
        }
        .icon {
          display: block;
          width: 22px;
          height: 22px;
          opacity: 0.9;
        }

        .card {
          background: var(--panel);
          border: 1px solid #1e2633;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 28px rgba(0, 0, 0, 0.35);
        }

        .media img {
          width: 100%;
          height: auto;
          display: block;
          object-fit: cover;
          aspect-ratio: 16/9;
          filter: contrast(1.02) saturate(1.02);
        }

        .meta {
          padding: 16px 18px 18px;
        }
        .stopTitle {
          margin: 0 0 4px;
          font-size: clamp(18px, 1.4vw, 22px);
          line-height: 1.2;
        }
        .subtle {
          margin: 0 0 10px;
          color: var(--muted);
          font-size: 14px;
        }
        .body {
          margin: 0 0 10px;
          line-height: 1.55;
        }
        .note {
          margin: 8px 0 0;
          padding: 10px 12px;
          border-radius: 10px;
          background: #0e131a;
          border: 1px dashed #2a3751;
          color: #b6c6dc;
          font-size: 14px;
        }

        @media (max-width: 640px) {
          .item {
            grid-template-columns: 30px 1fr;
          }
          .travel {
            top: -24px;
            padding: 5px 7px;
          }
          .icon {
            width: 18px;
            height: 18px;
          }
        }
      `}</style>
    </section>
  );
}

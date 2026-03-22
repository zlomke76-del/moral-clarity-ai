export default function EdgePage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      {/* ===================================================== */}
      {/* EDGE HEADER */}
      {/* ===================================================== */}
      <section className="edge-hero">
        <div className="edge-hero-inner">
          
          {/* LEFT: TEXT */}
          <div className="edge-hero-content">
            <h1>The Edge Framework</h1>

            <p className="edge-sub">
              Artificial intelligence becomes admissible only when reality holds across ordered boundaries.
            </p>

            <p className="edge-desc">
              If an earlier Edge fails, every downstream claim becomes invalid.
            </p>
          </div>

          {/* RIGHT: LOGO */}
          <div className="edge-hero-logo">
            <img
              src="/assets/image_edge_logo_trans_01.png"
              alt="The Edge Logo"
            />
          </div>

        </div>
      </section>

      {/* ===================================================== */}
      {/* EDGE LIST */}
      {/* ===================================================== */}
      <section className="edge-list">
        <div className="edge-card">
          <span>Edge 01</span>
          <h3>Edge of Knowledge</h3>
          <p>
            Knowledge is admissible only if the epistemic boundary holds. This Edge defines what is known, unknown, observable, or falsely assumed before action can begin.
          </p>
        </div>

        <div className="edge-card">
          <span>Edge 02</span>
          <h3>Edge of Practice</h3>
          <p>
            Practice is admissible only if reality does not fail under stress. This Edge evaluates falsification, operational breakdown, and real-world constraint failure.
          </p>
        </div>

        <div className="edge-card">
          <span>Edge 03</span>
          <h3>Edge of Protection</h3>
          <p>
            Protection is admissible only if harm is structurally prevented. This Edge governs misuse, authority leakage, refusal integrity, and boundary enforcement.
          </p>
        </div>

        <div className="edge-card">
          <span>Edge 04</span>
          <h3>Edge of Stewardship</h3>
          <p>
            Stewardship is admissible only if responsibility is bounded and enforceable. This Edge defines accountability, delegated authority, and human responsibility.
          </p>
        </div>
      </section>

      {/* ===================================================== */}
      {/* STYLES */}
      {/* ===================================================== */}
      <style jsx>{`
        .edge-hero {
          margin-bottom: 40px;
        }

        .edge-hero-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 40px;

          padding: 40px;
          border-radius: 20px;

          background: linear-gradient(
            180deg,
            rgba(20,40,80,0.35),
            rgba(5,10,20,0.6)
          );

          border: 1px solid rgba(122,162,255,0.18);
          box-shadow: 0 20px 60px rgba(0,0,0,0.6);
        }

        .edge-hero-content {
          max-width: 520px;
        }

        .edge-hero-content h1 {
          font-size: 40px;
          font-weight: 700;
          margin-bottom: 12px;
        }

        .edge-sub {
          font-size: 16px;
          color: rgba(232,238,246,0.8);
          margin-bottom: 10px;
        }

        .edge-desc {
          font-size: 14px;
          color: rgba(232,238,246,0.6);
        }

        .edge-hero-logo {
          width: 140px;
          height: 140px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .edge-hero-logo img {
          width: 100%;
          height: auto;
          object-fit: contain;
          filter:
            drop-shadow(0 0 12px rgba(122,162,255,0.4))
            drop-shadow(0 10px 30px rgba(0,0,0,0.6));
        }

        .edge-list {
          display: grid;
          gap: 20px;
        }

        .edge-card {
          padding: 24px;
          border-radius: 16px;

          background: linear-gradient(
            180deg,
            rgba(20,40,80,0.25),
            rgba(5,10,20,0.6)
          );

          border: 1px solid rgba(122,162,255,0.15);
        }

        .edge-card span {
          font-size: 12px;
          color: rgba(122,162,255,0.8);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .edge-card h3 {
          font-size: 20px;
          margin: 6px 0 8px;
        }

        .edge-card p {
          font-size: 14px;
          color: rgba(232,238,246,0.7);
          line-height: 1.5;
        }

        /* MOBILE */
        @media (max-width: 768px) {
          .edge-hero-inner {
            flex-direction: column;
            text-align: center;
          }

          .edge-hero-logo {
            width: 100px;
            height: 100px;
          }
        }
      `}</style>
    </main>
  );
}

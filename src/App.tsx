import { useState } from "react";

function App() {
  const data = {
    vinyl: [
      "/images/Blackpink_Pink_Venom.jpg",
      "/images/BTS_Love_Yourself_Her.jpg",
      "/images/Depeche_Mode_Sounds_of_the_Universe.jpg",
      "/images/Depeche_Mode_Spirit.jpg",
      "/images/Lana_Del_Rey_Splendour_in_the_Park.jpg",
      "/images/Muse_Black_Holes_and_Revelations.jpg",
      "/images/Muse_Origin_of_Symmetry.jpg",
      "/images/Panick_At_The_Disco_Pray_for_the_Wicked.jpg",
      "/images/RM_Right_Place_Wrong-Person.jpg",
      "/images/ROSE_Rosie.jpg",
      "/images/The_Doors_Strange_Days_1967.jpg",
      "/images/Twenty_One_Pilots_Clancy.jpg",
    ],
    funko: [
      "/images/funko_1.jpg",
      "/images/funko_2.jpg",
      "/images/funko_3.jpg",
      "/images/funko_4.jpg",
      "/images/funko_5.jpg",
    ],
    lego: ["/images/lego1.jpg"],
    wishlist: ["/images/wish1.jpg"],
  } as const;

  const tabs: Array<keyof typeof data> = ["vinyl", "funko", "lego", "wishlist"];

  const [activeTab, setActiveTab] = useState<keyof typeof data>("vinyl");
  const [viewMode, setViewMode] = useState<"grid" | "album">("grid");
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = data[activeTab] as readonly string[];
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Titles for vinyl (same order as `data.vinyl`)
  const titlesMap: Record<string, readonly string[]> = {
    vinyl: [
      "Blackpink — Born Pink",
      "BTS — Love Yourself: Her",
      "Depeche Mode — Sounds of the Universe",
      "Depeche Mode — Spirit",
      "Lana Del Rey — Splendour In The Park",
      "Muse — Black Holes and Revelations",
      "Muse — Origin of Symmetry",
      "Panic! At the Disco — Pray for the Wicked",
      "RM — Right Place, Wrong Person",
      "ROSÉ — rosie",
      "The Doors — Strange Days 1967: A Work In Progress",
      "Twenty One Pilots — Clancy",
    ],
    funko: [
      "Funko Pop 1",
      "Funko Pop 2",
      "Funko Pop 3",
      "Funko Pop 4",
      "Funko Pop 5",
    ],
  };

  return (
    <div
      style={{
        background: "#0f0f14",
        minHeight: "100vh",
        width: "100%",
        color: "white",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          backdropFilter: "blur(30px)",
          background: "rgba(20,20,25,0.75)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          padding: "20px 60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <h2 style={{ margin: 0, fontWeight: 600 }}>Моя коллекция</h2>

        <div
          style={{
            display: "flex",
            gap: 8,
            background: "rgba(255,255,255,0.06)",
            padding: 6,
            borderRadius: 999,
            backdropFilter: "blur(20px)",
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setViewMode("grid");
                setCurrentIndex(0);
              }}
              aria-label={`Вкладка ${tab}`}
              aria-pressed={activeTab === tab}
              style={{
                padding: "8px 22px",
                borderRadius: 999,
                border: "none",
                background: activeTab === tab ? "rgba(255,255,255,0.18)" : "transparent",
                color: "white",
                fontWeight: 500,
                cursor: "pointer",
                outline: "none",
                boxShadow: "none",
                transition: "all .25s ease",
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            background: "rgba(255,255,255,0.06)",
            padding: 4,
            borderRadius: 14,
            gap: 4,
          }}
        >
          <button
            onClick={() => setViewMode("grid")}
            aria-label="Переключить на сетку"
            style={{
              width: 40,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "none",
              borderRadius: 10,
              background: viewMode === "grid" ? "rgba(255,255,255,0.15)" : "transparent",
              cursor: "pointer",
              outline: "none",
              boxShadow: "none",
            }}
          >
            <img src="/icons/icon_w_2.png" height={18} alt="grid view" />
          </button>

          <button
            onClick={() => setViewMode("album")}
            aria-label="Переключить на альбомный просмотр"
            style={{
              width: 40,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "none",
              borderRadius: 10,
              background: viewMode === "album" ? "rgba(255,255,255,0.15)" : "transparent",
              cursor: "pointer",
              outline: "none",
              boxShadow: "none",
            }}
          >
            <img src="/icons/icon_w_1.png" height={18} alt="album view" />
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ width: "100%", padding: "60px 80px", boxSizing: "border-box" }}>
        {/* GRID VIEW: 4 square cards */}
        {viewMode === "grid" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32, width: "100%" }}>
                {images.map((src, index) => {
                  const title = (titlesMap as any)[activeTab]?.[index] ?? "";
                  const isHovered = hoveredIndex === index;
                  return (
                    <div
                      key={index}
                      onClick={() => {
                        setCurrentIndex(index);
                        setViewMode("album");
                      }}
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      style={{
                        width: "100%",
                        aspectRatio: "1 / 1",
                        borderRadius: 20,
                        overflow: "hidden",
                        cursor: "pointer",
                        boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                        transition: "transform .18s ease",
                        transform: isHovered ? "scale(1.03)" : "scale(1)",
                        position: "relative",
                        background: "#000",
                      }}
                    >
                      <img src={encodeURI(src)} alt={`${activeTab} ${index + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />

                      {/* bottom gradient overlay (20% height) with title */}
                      <div
                        style={{
                          position: "absolute",
                          left: 0,
                          right: 0,
                          bottom: 0,
                          height: "20%",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "flex-end",
                          padding: "8% 10%",
                          boxSizing: "border-box",
                          pointerEvents: "none",
                          transition: "opacity .25s ease",
                          opacity: isHovered ? 1 : 0,
                          background: "linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0))",
                        }}
                      >
                        {title ? (
                          (() => {
                            const parts = title.split(" — ");
                            const artist = parts[0] ?? title;
                            const album = parts.slice(1).join(" — ") || "";
                            return (
                              <>
                                <div style={{ color: "#fff", fontSize: 13, fontWeight: 600, lineHeight: 1 }}>{artist}</div>
                                {album && <div style={{ color: "rgba(255,255,255,0.9)", fontSize: 12, marginTop: 4 }}>{album}</div>}
                              </>
                            );
                          })()
                        ) : null}
                      </div>
                    </div>
                  );
                })}
          </div>
        )}

        {/* ALBUM / CAROUSEL VIEW */}
        {viewMode === "album" && (
          <div style={{ width: "100%", minHeight: "70vh" }}>
            {images.length === 0 ? (
              <div style={{ color: "rgba(255,255,255,0.7)", textAlign: "center" }}>Нет изображений в этой вкладке</div>
            ) : (
              <div style={{ position: "relative", height: "75vh", width: "100%", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <button
                  onClick={() => setCurrentIndex((currentIndex - 1 + images.length) % images.length)}
                  aria-label="Предыдущее"
                  style={{ position: "absolute", left: 24, background: "none", border: "none", color: "white", fontSize: 40, cursor: "pointer", outline: "none", zIndex: 30 }}
                >
                  ‹
                </button>

                <div style={{ position: "relative", width: "100%", height: "100%", pointerEvents: "none" }}>
                  {images.map((src, i) => {
                    const n = images.length;
                    let rel = ((i - currentIndex) % n + n) % n; // 0..n-1
                    if (rel > n / 2) rel -= n; // center nearest (signed)
                    const absRel = Math.abs(rel);

                    // show up to 3 layers (center + 2 behind)
                    const show = absRel <= 2;
                    if (!show) return null;

                    const isCenter = rel === 0;
                    const isNeighbor = absRel === 1;

                    const CENTER_W = 630;
                    const CENTER_H = 630;
                    const NEIGHBOR_SCALE = 0.6; // 60%
                    const FAR_SCALE = 0.4; // 40%

                    const neighborW = Math.round(CENTER_W * NEIGHBOR_SCALE);
                    const neighborH = Math.round(CENTER_H * NEIGHBOR_SCALE);
                    const farW = Math.round(CENTER_W * FAR_SCALE);
                    const farH = Math.round(CENTER_H * FAR_SCALE);

                    // compute pixel offsets so neighbor & far rows peek ~10% beyond previous
                    const PEEK_PERCENT = 0.1; // 10% visible beyond the previous card

                    const neighborOffsetPx = Math.round((CENTER_W + neighborW) / 2 - neighborW * PEEK_PERCENT);
                    const farOffsetPx = Math.round((CENTER_W + neighborW + farW) / 2 - farW * PEEK_PERCENT);

                    const translateXpx = rel === 0 ? 0 : isNeighbor ? neighborOffsetPx * Math.sign(rel) : farOffsetPx * Math.sign(rel);
                    const translateY = isCenter ? 0 : isNeighbor ? 12 : 24;
                    const rotateY = rel * -12;
                    const zIndex = 100 - absRel * 10;

                    const cardStyle: any = {
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: `translate(-50%, -50%) translateX(${translateXpx}px) translateY(${translateY}px) rotateY(${rotateY}deg)`,
                      transformOrigin: "50% 50%",
                      transition: "transform 420ms cubic-bezier(.2,.8,.2,1), opacity 320ms",
                      borderRadius: 24,
                      overflow: "hidden",
                      zIndex,
                      pointerEvents: isCenter || isNeighbor ? "auto" : "none",
                      cursor: isCenter ? "default" : "pointer",
                    };
                    if (isCenter) {
                      cardStyle.width = `${CENTER_W}px`;
                      cardStyle.height = `${CENTER_H}px`;
                      cardStyle.boxShadow = "0 90px 210px rgba(0,0,0,0.75)";
                    } else if (isNeighbor) {
                      cardStyle.width = `${neighborW}px`;
                      cardStyle.height = `${neighborH}px`;
                      cardStyle.boxShadow = "0 60px 150px rgba(0,0,0,0.65)";
                    } else {
                      cardStyle.width = `${farW}px`;
                      cardStyle.height = `${farH}px`;
                      cardStyle.boxShadow = "0 45px 120px rgba(0,0,0,0.6)";
                    }

                    const overlayColor = isCenter ? "rgba(0,0,0,0)" : isNeighbor ? "rgba(0,0,0,0.25)" : "rgba(0,0,0,0.45)";

                    const title = (titlesMap as any)[activeTab]?.[i] ?? "";
                    const isHovered = hoveredIndex === i;

                    return (
                      <div
                        key={i}
                        onClick={() => { if (!isCenter) setCurrentIndex(i); }}
                        onMouseEnter={() => setHoveredIndex(i)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        role="button"
                        aria-label={`Показать ${i + 1}`}
                        style={cardStyle}
                      >
                        <div style={{ width: "100%", height: "100%", background: "#000", position: "relative" }}>
                          <img src={encodeURI(src)} alt={`${activeTab} ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                          <div style={{ position: "absolute", inset: 0, background: overlayColor, pointerEvents: "none" }} />

                          {/* bottom gradient overlay & title (appear on hover, no scale) */}
                          <div
                            style={{
                              position: "absolute",
                              left: 0,
                              right: 0,
                              bottom: 0,
                              height: "20%",
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "flex-end",
                              padding: "6% 8%",
                              boxSizing: "border-box",
                              pointerEvents: "none",
                              transition: "opacity .22s ease",
                              opacity: isHovered ? 1 : 0,
                              background: "linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0))",
                              zIndex: 5,
                            }}
                          >
                            {title ? (
                              (() => {
                                const parts = title.split(" — ");
                                const artist = parts[0] ?? title;
                                const album = parts.slice(1).join(" — ") || "";
                                return (
                                  <>
                                    <div style={{ color: "#fff", fontSize: 15, fontWeight: 700, lineHeight: 1 }}>{artist}</div>
                                    {album && <div style={{ color: "rgba(255,255,255,0.95)", fontSize: 13, marginTop: 4 }}>{album}</div>}
                                  </>
                                );
                              })()
                            ) : null}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button onClick={() => setCurrentIndex((currentIndex + 1) % images.length)} aria-label="Следующее" style={{ position: "absolute", right: 24, background: "none", border: "none", color: "white", fontSize: 40, cursor: "pointer", outline: "none", zIndex: 30 }}>
                  ›
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
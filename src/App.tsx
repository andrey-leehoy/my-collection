import { useState, useEffect } from "react";

const RESERVED_STORAGE_KEY = "my-collection-reserved";

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
      "/images/Panic_At_The_Disco_Pray_for_the_Wicked.jpg",
      "/images/RM_Right_Place_Wrong-Person.jpg",
      "/images/ROSE_Rosie.jpg",
      "/images/The_Doors_Strange_Days_1967.jpg",
      "/images/Twenty_One_Pilots_Clancy.jpg",
    ],
    funko: [
      "/images/funko_1.png",
      "/images/funko_2.png",
      "/images/funko_3.png",
      "/images/funko_4.png",
      "/images/funko_5.png",
    ],
    lego: ["/images/lego1.jpg"],
    wishlist: [
      {
        id: 1,
        image: "/images/optimize-5.webp",
        title: "Marshall Acton III Brown",
        description: "Портативная акустика мощностью 60 Вт. Легендарный дизайн и глубокий звук в компактном корпусе.",
        link: "https://market.yandex.ru/card/portativnaya-akustika-kolonka-marshall-acton-iii-60-vt-korichnevyy/4514904246",
        price: "21 522 ₽"
      },
      {
        id: 2,
        image: "/images/optimize-2.webp",
        title: "Nike M2K Tekno Gray/Red",
        description: "Стильные массивные кроссовки в стиле 'dad shoes'. Удобная подошва и износостойкие материалы.",
        link: "https://market.yandex.ru/card/nike-m2k-tekno-anti-slip-wear-resistant-low-top-chunky-sneakers-unisex-gray-red-42/4462411402",
        price: "22 014 ₽"
      },
      {
        id: 3,
        image: "/images/optimize-3.webp",
        title: "Alive Audio Symphony Dark Wood",
        description: "Проигрыватель виниловых пластинок с классическим дизайном под дерево и встроенными динамиками.",
        link: "https://market.yandex.ru/card/proigryvatel-vinilovykh-plastinok-alive-audio-symphony-dark-wood/103196881754",
        price: "23 446 ₽"
      },
      {
        id: 4,
        image: "/images/optimize-4.webp",
        title: "Stranger Things OST (2LP Vinyl)",
        description: "Саундтрек к сериалу 'Очень странные дела' на двойном виниле. HQ звук и коллекционное издание.",
        link: "https://market.yandex.ru/card/ost---stranger-things-music-from-the-netflix-original-series--vinilovaya-plastinka--format-2lp--novaya--hq-zvuk/4308768079",
        price: "25 458 ₽"
      }
    ],
  } as const;

  const tabs: Array<keyof typeof data> = ["vinyl", "funko", "lego", "wishlist"];

  const [activeTab, setActiveTab] = useState<keyof typeof data>("vinyl");
  const [viewMode, setViewMode] = useState<"grid" | "album">("grid");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedWish, setSelectedWish] = useState<typeof data.wishlist[number] | null>(null);
  const [reservedWishes, setReservedWishes] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem(RESERVED_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(RESERVED_STORAGE_KEY, JSON.stringify(reservedWishes));
  }, [reservedWishes]);

  useEffect(() => {
    if (!selectedWish) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedWish(null);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [selectedWish]);

  const images = activeTab === "wishlist" 
    ? data.wishlist.map(item => item.image)
    : data[activeTab] as readonly string[];
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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
      "Funko POP! Pochita 1682",
      "Funko POP! Logan/Wolverine 1433",
      "Funko POP! Peter Parker 971",
      "Funko POP! Cuclops 502",
      "Funko POP! Steve 475",
    ],
  };

  const albumTracks: Record<number, string[]> = {
    0: ["Pink Venom", "Shut Down", "Typa Girl"],
    1: ["Intro: Serendipity", "DNA", "Best of Me"],
    2: ["In Chains", "Hole to Feed", "Wrong"],
    3: ["Going Backwards", "Where's the Revolution", "The Worst Crime"],
    4: ["Cruel World", "Ultraviolence", "Shades of Cool"],
    5: ["Take a Bow", "Starlight", "Supermassive Black Hole"],
    6: ["New Born", "Bliss", "Space Dementia"],
    7: ["Say Amen", "High Hopes", "Roaring 20s"],
    8: ["Right People, Wrong Place", "Nuts", "out of love"],
    9: ["Number One Girl", "APT.", "Toxic Till the End"],
    10: ["Strange Days", "You're Lost Little Girl", "Love Me Two Times"],
    11: ["Overcompensate", "Next Semester", "Backslide"],
  };

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isHoveringAlbum, setIsHoveringAlbum] = useState(false);

  const FunkoShelf = () => {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(var(--funko-cols), 1fr)", gap: "var(--funko-gap-y) var(--funko-gap-x)", width: "100%", justifyItems: "center" }}>
        {images.map((src, index) => {
          const isHovered = hoveredIndex === index;
          const title = titlesMap.funko[index] || `Funko POP! ${index + 1}`;
          return (
            <div key={index} onMouseEnter={() => setHoveredIndex(index)} onMouseLeave={() => setHoveredIndex(null)} onClick={() => { setCurrentIndex(index); setViewMode("album"); }} style={{ position: "relative", width: "100%", maxWidth: "var(--funko-item-max-width)", height: "320px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", cursor: "pointer" }}>
              <div style={{ position: "absolute", top: "-80px", left: "50%", transform: "translateX(-50%)", width: "var(--funko-shelf-glow-w)", height: "var(--funko-shelf-glow-h)", background: "radial-gradient(ellipse at top, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)", clipPath: "polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)", opacity: isHovered ? 1 : 0, transition: "opacity 0.5s ease", pointerEvents: "none", zIndex: 1 }} />
              <img src={encodeURI(src)} alt={title} style={{ width: "var(--funko-img-width)", height: "auto", maxHeight: "var(--funko-img-max-height)", objectFit: "contain", zIndex: 2, transition: "all 0.4s ease", transform: isHovered ? "scale(1.08) translateY(-15px)" : "scale(1)", filter: isHovered ? "drop-shadow(0 0 25px rgba(255,255,255,0.5)) brightness(1.1)" : "brightness(0.4) grayscale(0.2)" }} />
              <div style={{ width: "var(--funko-shelf-width)", height: "var(--funko-shelf-height)", background: "#1a1a20", marginTop: "-35px", position: "relative", zIndex: 0, transform: "perspective(600px) rotateX(60deg)", boxShadow: "0 25px 50px rgba(0,0,0,0.9)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)" }} />
              </div>
              <div style={{ width: "var(--funko-shelf-width)", height: "var(--funko-label-height)", background: "#141418", borderRadius: "0 0 4px 4px", zIndex: 1, borderTop: "1px solid rgba(255,255,255,0.15)", boxShadow: "0 10px 20px rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 10px" }}>
                <span style={{ color: isHovered ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.3)", fontSize: "10px", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", transition: "color 0.4s ease", textAlign: "center", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const WishlistPinterest = () => {
    return (
      <div style={{ columnCount: "var(--wishlist-cols)", columnGap: "var(--wishlist-gap)", width: "100%", maxWidth: "1200px", margin: "0 auto" }}>
        {data.wishlist.map((item, index) => {
          const isReserved = reservedWishes.includes(item.id);
          return (
            <div key={item.id} onClick={() => setSelectedWish(item)} onMouseEnter={() => setHoveredIndex(index)} onMouseLeave={() => setHoveredIndex(null)} style={{ breakInside: "avoid", marginBottom: "24px", borderRadius: "24px", overflow: "hidden", cursor: "pointer", position: "relative", transition: "all 0.3s ease", transform: hoveredIndex === index ? "scale(1.02)" : "scale(1)", boxShadow: "0 10px 30px rgba(0,0,0,0.3)", background: "#1a1a20", opacity: isReserved ? 0.4 : 1 }}>
              <img src={encodeURI(item.image)} alt={item.title} style={{ width: "100%", display: "block", height: "auto" }} />
              {isReserved && (
                <div style={{ position: "absolute", top: "20px", right: "20px", background: "#fff", borderRadius: "50%", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 10px rgba(0,0,0,0.3)", zIndex: 10 }}>
                  <span style={{ color: "#000", fontSize: "18px", fontWeight: "bold" }}>✓</span>
                </div>
              )}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)", opacity: hoveredIndex === index ? 1 : 0, transition: "opacity 0.3s ease", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "20px" }}>
                <div style={{ color: "#fff", fontWeight: 600, fontSize: "16px" }}>{item.title}</div>
                <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px", marginTop: "4px" }}>{item.price}</div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="app-responsive" style={{ background: "#0f0f14", minHeight: "100vh", width: "100%", color: "white", fontFamily: "system-ui, sans-serif" }}>
      <div className="app-header" style={{ position: "sticky", top: 0, zIndex: 1000, backdropFilter: "blur(30px)", background: "rgba(20,20,25,0.75)", borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "var(--header-padding)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "var(--header-gap)", width: "100%", boxSizing: "border-box" }}>
        <h2 className="app-title" style={{ margin: 0, fontWeight: 600, whiteSpace: "nowrap" }}>Моя коллекция</h2>
        <div className="app-header-tabs" style={{ display: "flex", gap: "var(--header-gap)", background: "rgba(255,255,255,0.06)", padding: 6, borderRadius: 999, backdropFilter: "blur(20px)", flexShrink: 0 }}>
          {tabs.map((tab) => (
            <button key={tab} onClick={() => { setActiveTab(tab); setViewMode("grid"); setCurrentIndex(0); }} style={{ padding: "8px 22px", borderRadius: 999, border: "none", background: activeTab === tab ? "rgba(255,255,255,0.18)" : "transparent", color: "white", fontWeight: 500, cursor: "pointer", transition: "all .25s ease", outline: "none", WebkitTapHighlightColor: "transparent", flexShrink: 0 }}>{tab}</button>
          ))}
        </div>
        <div style={{ display: "flex", background: "rgba(255,255,255,0.06)", padding: 4, borderRadius: 14, gap: 4, flexShrink: 0 }}>
          <button onClick={() => setViewMode("grid")} aria-label="Вид сетки" style={{ width: "var(--nav-btn-size)", minWidth: "var(--nav-btn-size)", height: 36, display: "flex", alignItems: "center", justifyContent: "center", border: "none", borderRadius: 10, background: viewMode === "grid" ? "rgba(255,255,255,0.15)" : "transparent", cursor: "pointer", outline: "none", WebkitTapHighlightColor: "transparent" }}>
            <img src="/icons/icon_w_2.png" height={18} alt="" />
          </button>
          <button onClick={() => setViewMode("album")} aria-label="Вид альбома" style={{ width: "var(--nav-btn-size)", minWidth: "var(--nav-btn-size)", height: 36, display: "flex", alignItems: "center", justifyContent: "center", border: "none", borderRadius: 10, background: viewMode === "album" ? "rgba(255,255,255,0.15)" : "transparent", cursor: "pointer", outline: "none", WebkitTapHighlightColor: "transparent" }}>
            <img src="/icons/icon_w_1.png" height={18} alt="" />
          </button>
        </div>
      </div>

      <div className="app-content" style={{ width: "100%", padding: "var(--content-padding)", boxSizing: "border-box" }}>
        {activeTab === "wishlist" ? (
          <WishlistPinterest />
        ) : activeTab === "funko" && viewMode === "grid" ? (
          <FunkoShelf />
        ) : (
          <>
            {viewMode === "grid" && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(var(--grid-cols), 1fr)", gap: "var(--grid-gap)", width: "100%" }}>
                {images.map((src, index) => {
                  const title = titlesMap[activeTab]?.[index] ?? "";
                  const isHovered = hoveredIndex === index;
                  return (
                    <div key={index} onClick={() => { setCurrentIndex(index); setViewMode("album"); }} onMouseEnter={() => setHoveredIndex(index)} onMouseLeave={() => setHoveredIndex(null)} style={{ width: "100%", aspectRatio: "1/1", borderRadius: 20, overflow: "hidden", cursor: "pointer", boxShadow: "0 20px 60px rgba(0,0,0,0.5)", transition: "transform .18s ease", transform: isHovered ? "scale(1.03)" : "scale(1)", position: "relative", background: "#000" }}>
                      <img src={encodeURI(src)} alt={title} style={{ width: "100%", height: "100%", objectFit: activeTab === "funko" ? "contain" : "cover" }} />
                      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "20%", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "8% 10%", boxSizing: "border-box", opacity: isHovered ? 1 : 0, transition: "opacity .25s ease", background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)" }}>
                        {title && (() => { const parts = title.split(" — "); return (<><div style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{parts[0]}</div>{parts[1] && <div style={{ color: "rgba(255,255,255,0.9)", fontSize: 12 }}>{parts[1]}</div>}</>); })()}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {viewMode === "album" && (
              <div style={{ height: "70vh", minHeight: "var(--album-view-min-height)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", perspective: "1200px", overflow: "visible", width: "100%" }}>
                {activeTab === "funko" ? (
                  <div style={{ height: "100%", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "visible" }}>
                    <div style={{ position: "absolute", display: "flex", alignItems: "flex-end", transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)", transform: `translateX(calc(-1 * ${currentIndex} * var(--funko-carousel-item-width)))`, left: "50%", marginLeft: "var(--funko-carousel-ml)", bottom: "15%" }}>
                      {images.map((src, i) => {
                        const isSelected = currentIndex === i;
                        const title = titlesMap.funko[i] || `Funko POP! ${i + 1}`;
                        return (
                          <div key={i} onClick={() => { setCurrentIndex(i); setViewMode("album"); }} style={{ width: "var(--funko-carousel-item-width)", display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", flexShrink: 0, position: "relative", overflow: "visible" }}>
                            {isSelected && <div style={{ position: "absolute", top: "-400px", left: "50%", transform: "translateX(-50%)", width: "600px", height: "700px", background: "radial-gradient(ellipse at top, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 80%)", clipPath: "polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)", pointerEvents: "none", zIndex: 1 }} />}
                            <img src={encodeURI(src)} alt={title} style={{ width: "var(--funko-carousel-img-width)", height: "var(--funko-carousel-img-height)", objectFit: "contain", zIndex: 2, transition: "all 0.6s ease", filter: isSelected ? "drop-shadow(0 0 40px rgba(255,255,255,0.4)) brightness(1.1)" : "brightness(0.1) grayscale(0.9) blur(2px)", transform: isSelected ? "scale(1.3) translateY(-30px)" : "scale(0.85)" }} />
                            <div style={{ position: "absolute", bottom: "-25px", width: "100%", textAlign: "center", zIndex: 5 }}><span style={{ color: isSelected ? "#fff" : "rgba(255,255,255,0.05)", fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>{title}</span></div>
                          </div>
                        );
                      })}
                      <div style={{ position: "absolute", bottom: "0", left: "-2000px", right: "-2000px", height: "60px", background: "#1a1a20", transform: "perspective(600px) rotateX(60deg)", transformOrigin: "bottom", boxShadow: "0 30px 60px rgba(0,0,0,0.9)", border: "1px solid rgba(255,255,255,0.05)", zIndex: 0 }} />
                      <div style={{ position: "absolute", bottom: "-30px", left: "-2000px", right: "-2000px", height: "30px", background: "#141418", borderTop: "1px solid rgba(255,255,255,0.15)", zIndex: 1 }} />
                    </div>
                  </div>
                ) : (
                  images.map((src, i) => {
                    let offset = i - currentIndex;
                    const half = Math.floor(images.length / 2);
                    if (offset > half) offset -= images.length;
                    if (offset < -half) offset += images.length;
                    const absOffset = Math.abs(offset);
                    if (absOffset > 3) return null;
                    return (
                      <div key={i} onClick={() => setCurrentIndex(i)} onMouseEnter={() => absOffset === 0 && setIsHoveringAlbum(true)} onMouseLeave={() => setIsHoveringAlbum(false)} style={{ position: "absolute", width: "var(--album-base-width)", height: "var(--album-base-width)", transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)", transform: `translateX(calc(${offset} * var(--album-offset-pct) * 1%)) translateZ(${-absOffset * 250}px) rotateY(${offset > 0 ? -55 : offset < 0 ? 55 : 0}deg)`, zIndex: 100 - absOffset, opacity: absOffset > 2.5 ? 0 : 1, cursor: "pointer", boxShadow: "0 30px 80px rgba(0,0,0,0.6)", borderRadius: "min(20px, 4vw)", overflow: "hidden", background: "#000" }}>
                        <img src={encodeURI(src)} alt={activeTab} style={{ width: "100%", height: "100%", objectFit: "cover", filter: absOffset > 0 ? "brightness(0.35) blur(1px)" : "none" }} />
                        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: activeTab === "vinyl" && absOffset === 0 && (isHoveringAlbum || "ontouchstart" in window) ? "55%" : "25%", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "5% 8%", boxSizing: "border-box", transition: "all 0.4s ease-in-out", opacity: absOffset === 0 ? 1 : 0, background: (isHoveringAlbum || "ontouchstart" in window) && absOffset === 0 ? "linear-gradient(to top, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.85) 60%, rgba(0,0,0,0) 100%)" : "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%)", zIndex: 3 }}>
                          {(() => {
                            const title = titlesMap[activeTab]?.[i] ?? "";
                            if (!title) return null;
                            const parts = title.split(" — ");
                            const tracks = albumTracks[i] || [];
                            return (
                              <div style={{ pointerEvents: "auto" }}>
                                <div style={{ color: "#fff", fontSize: "clamp(14px, 2.5vw, 18px)", fontWeight: 600 }}>{parts[0]}</div>
                                {parts[1] && <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "clamp(12px, 2vw, 14px)", marginTop: 4 }}>{parts[1]}</div>}
                                {activeTab === "vinyl" && absOffset === 0 && (
                                  <div style={{ marginTop: 15, borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 15, opacity: (isHoveringAlbum || "ontouchstart" in window) ? 1 : 0, transform: (isHoveringAlbum || "ontouchstart" in window) ? "translateY(0)" : "translateY(20px)", transition: "all 0.4s ease", maxHeight: (isHoveringAlbum || "ontouchstart" in window) ? "300px" : "0", overflow: "hidden" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 15, marginBottom: 15 }}>
                                      <button onClick={(e) => { e.stopPropagation(); setIsPlaying(!isPlaying); }} style={{ background: "#fff", border: "none", borderRadius: "50%", width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", outline: "none", WebkitTapHighlightColor: "transparent" }}>
                                        <span style={{ color: "#000", fontSize: 16, marginLeft: isPlaying ? 0 : 2 }}>{isPlaying ? "⏸" : "▶"}</span>
                                      </button>
                                      <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>Now Playing</div>
                                        <div style={{ fontSize: 14, color: "#fff", fontWeight: 500 }}>{tracks[currentTrackIndex]}</div>
                                      </div>
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                      {tracks.map((track, tIdx) => (
                                        <div key={tIdx} onClick={(e) => { e.stopPropagation(); setCurrentTrackIndex(tIdx); setIsPlaying(true); }} style={{ fontSize: 13, color: currentTrackIndex === tIdx ? "#fff" : "rgba(255,255,255,0.4)", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
                                          <span style={{ opacity: 0.3, width: 18 }}>{String(tIdx + 1).padStart(2, '0')}</span>{track}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    );
                  })
                )}
                <div style={{ position: "absolute", bottom: "2%", textAlign: "center", zIndex: 200, width: "100%", display: "flex", gap: 20, justifyContent: "center" }}>
                  <button onClick={() => setCurrentIndex((p) => (p > 0 ? p - 1 : images.length - 1))} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "white", cursor: "pointer", padding: "10px 25px", borderRadius: 99, backdropFilter: "blur(10px)", outline: "none", WebkitTapHighlightColor: "transparent" }}>←</button>
                  <button onClick={() => setCurrentIndex((p) => (p < images.length - 1 ? p + 1 : 0))} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "white", cursor: "pointer", padding: "10px 25px", borderRadius: 99, backdropFilter: "blur(10px)", outline: "none", WebkitTapHighlightColor: "transparent" }}>→</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {selectedWish && (
        <div
          onClick={() => setSelectedWish(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="wish-modal-title"
          className="app-modal-overlay"
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(20px) saturate(180%)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", overflowY: "auto" }}
        >
          <div onClick={(e) => e.stopPropagation()} className="app-modal-inner" style={{ background: "rgba(30, 30, 35, 0.7)", backdropFilter: "blur(40px) saturate(200%) brightness(1.2)", WebkitBackdropFilter: "blur(40px) saturate(200%) brightness(1.2)", borderRadius: "40px", width: "100%", maxWidth: "1000px", maxHeight: "95vh", display: "flex",  overflow: "auto", boxShadow: "0 40px 100px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <div style={{ width: "var(--modal-img-width)", minWidth: "var(--modal-img-width)", display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--modal-img-padding)", position: "relative", minHeight: "200px" }}>
              <img src={encodeURI(selectedWish.image)} alt={selectedWish.title} style={{ maxWidth: "100%", maxHeight: "75vh", width: "auto", height: "auto", objectFit: "contain", borderRadius: "24px", filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.5))", zIndex: 2, display: "block" }} />
            </div>
            <div style={{ width: "var(--modal-text-width)", padding: "var(--modal-text-padding)", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", zIndex: 2, boxSizing: "border-box" }}>
              <h2 id="wish-modal-title" style={{ fontSize: "var(--modal-title-size)", margin: "0 0 12px 0", fontWeight: 700, letterSpacing: "-0.5px" }}>{selectedWish.title}</h2>
              <div style={{ fontSize: "var(--modal-price-size)", fontWeight: 600, color: "#fff", marginBottom: "20px", display: "inline-block", padding: "8px 20px", background: "rgba(255,255,255,0.1)", borderRadius: "16px", width: "fit-content" }}>{selectedWish.price}</div>
              <p style={{ fontSize: "var(--modal-desc-size)", lineHeight: "1.6", color: "rgba(255,255,255,0.7)", marginBottom: "24px" }}>{selectedWish.description}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <button onClick={() => { window.open(selectedWish.link, '_blank'); }} style={{ background: "#fff", color: "#000", border: "none", padding: "var(--modal-btn-padding)", borderRadius: "24px", fontWeight: 700, fontSize: "var(--modal-btn-font)", cursor: "pointer", transition: "all 0.3s", minHeight: "44px" }}>Посмотреть</button>
                <button 
                  onClick={() => {
                    const isReserved = reservedWishes.includes(selectedWish.id);
                    if (isReserved) {
                      setReservedWishes(reservedWishes.filter(id => id !== selectedWish.id));
                    } else {
                      setReservedWishes([...reservedWishes, selectedWish.id]);
                    }
                  }} 
                  style={{ 
                    background: reservedWishes.includes(selectedWish.id) ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.2)", 
                    color: "#fff", 
                    border: "1px solid rgba(255,255,255,0.3)", 
                    padding: "var(--modal-btn-padding)", 
                    borderRadius: "24px", 
                    fontWeight: 700, 
                    fontSize: "var(--modal-btn-font)", 
                    cursor: "pointer", 
                    transition: "all 0.3s",
                    minHeight: "44px"
                  }}
                >
                  {reservedWishes.includes(selectedWish.id) ? "Забронировано ✓" : "Хочу подарить"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

const fs = require("fs"); const path = "./src/App.jsx"; const content = fs.readFileSync(path, "utf8"); const lines = content.split("\n"); const startIdx = 2485; const endIdx = 2854; const newModal = `        {/* TAB 3: CREATE CHALLENGE (INSTAGRAM / TIKTOK POST STYLE WIZARD) */}
        {activeTab === "create" && (
          <div className="creator-container" style={{maxWidth: "600px", margin: "0 auto"}}>
            <div className="creator-header-row">
              <h2 className="creator-main-title" style={{ fontWeight: 800 }}>????? ????? ?????? ????</h2>
            </div>

            {currentUser.isBlocked ? (
              <div className="glass-card" style={{ padding: "2rem", textAlign: "center" }}>
                <p style={{ color: "#ff4d4d", fontWeight: "bold", fontSize: "1.1rem" }}>?????? ????. ???? ???? ????? ?????? ?????.</p>
              </div>
            ) : (
              <div>
                {/* Step indicator */}
                <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "1.5rem", direction: "rtl", padding: "0 0.5rem" }}>
                  <div style={{ fontWeight: creationStep === 1 ? "bold" : "normal", color: creationStep === 1 ? "var(--accent)" : "var(--text-muted)", borderBottom: creationStep === 1 ? "2px solid var(--accent)" : "none", paddingBottom: "4px" }}>1. ?????? ???</div>
                  <div style={{ fontWeight: creationStep === 2 ? "bold" : "normal", color: creationStep === 2 ? "var(--accent)" : "var(--text-muted)", borderBottom: creationStep === 2 ? "2px solid var(--accent)" : "none", paddingBottom: "4px" }}>2. ????? ??</div>
                  <div style={{ fontWeight: creationStep === 3 ? "bold" : "normal", color: creationStep === 3 ? "var(--accent)" : "var(--text-muted)", borderBottom: creationStep === 3 ? "2px solid var(--accent)" : "none", paddingBottom: "4px" }}>3. ????? ??</div>
                </div>

                <form onSubmit={handleCreateChallenge}>
                  <div className="creator-details-pane" style={{ width: "100%" }}>
                    
                    {/* Step 1: Media Selection */}
                    {creationStep === 1 && (
                      <div className="glass-card creator-section-card">
                        <h3 className="section-title" style={{ fontWeight: 700 }}>??? ????? ??????</h3>
                        <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>???? ?? 10 ?????? ??????? ???? ????? ????:</p>
                        
                        <div className="media-preset-section" style={{ padding: 0, margin: 0 }}>
                          <div className="media-presets-grid">
                            {[
                              { name: "????", url: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=300&auto=format&fit=crop&q=80" },
                              { name: "???/???????", url: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=300&auto=format&fit=crop&q=80" },
                              { name: "????? ????", url: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=300&auto=format&fit=crop&q=80" },
                              { name: "????/??????", url: "https://images.unsplash.com/photo-1502224562085-639556652f33?w=300&auto=format&fit=crop&q=80" },
                              { name: "???/?????", url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=300&auto=format&fit=crop&q=80" }
                            ].map((preset, idx) => (
                              <button
                                key={idx}
                                type="button"
                                className={\`preset-thumb-btn \${newChallengeImages.includes(preset.url) ? "active" : ""}\`}
                                onClick={() => {
                                  if (newChallengeImages.includes(preset.url)) {
                                    setNewChallengeImages(newChallengeImages.filter(url => url !== preset.url));
                                  } else if (newChallengeImages.length < 10) {
                                    setNewChallengeImages([...newChallengeImages, preset.url]);
                                  }
                                }}
                              >
                                <img src={preset.url} alt={preset.name} />
                                <span>{preset.name}</span>
                              </button>
                            ))}
                          </div>

                          <div className="form-group" style={{ marginTop: "1rem" }}>
                            <label className="form-label" style={{ fontSize: "0.8rem" }}>?? ????? ????? ?????? ????? (URL):</label>
                            <div style={{ display: "flex", gap: "0.5rem" }}>
                              <input 
                                type="url" 
                                id="customImageUrl"
                                className="form-control" 
                                placeholder="https://..."
                                style={{ fontSize: "0.8rem", flex: 1 }}
                              />
                              <button 
                                type="button" 
                                className="btn btn-secondary"
                                onClick={() => {
                                  const url = document.getElementById("customImageUrl").value;
                                  if (url && newChallengeImages.length < 10 && !newChallengeImages.includes(url)) {
                                    setNewChallengeImages([...newChallengeImages, url]);
                                    document.getElementById("customImageUrl").value = "";
                                  }
                                }}
                              >????</button>
                            </div>
                          </div>
                          
                          {newChallengeImages.length > 0 && (
                            <div style={{ marginTop: "1rem" }}>
                              <p style={{ fontSize: "0.8rem", fontWeight: "bold" }}>????? ({newChallengeImages.length}/10):</p>
                              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
                                {newChallengeImages.map((img, idx) => (
                                  <div key={idx} style={{ position: "relative", width: "60px", height: "60px", borderRadius: "8px", overflow: "hidden" }}>
                                    <img src={img} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                    <button 
                                      type="button" 
                                      onClick={() => setNewChallengeImages(newChallengeImages.filter(url => url !== img))}
                                      style={{ position: "absolute", top: "2px", right: "2px", background: "rgba(0,0,0,0.5)", color: "white", border: "none", borderRadius: "50%", width: "20px", height: "20px", fontSize: "10px", cursor: "pointer" }}
                                    >X</button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Step 2: Soundtrack */}
                    {creationStep === 2 && (
                      <div className="glass-card creator-section-card">
                        <h3 className="section-title" style={{ fontWeight: 700 }}>?? ????? ?????</h3>
                        <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>???? ?????? ??? ?????? ?? ????? ????:</p>
                        
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                          {[
                            { id: "none", name: "??? ?????", artist: "" },
                            { id: "workout", name: "Energetic Workout", artist: "Pulse Music" },
                            { id: "chill", name: "Chill Vibes", artist: "Lofi Beats" },
                            { id: "epic", name: "Epic Motivation", artist: "Cinematic" },
                            { id: "run", name: "Running Tempo 160bpm", artist: "Pulse Fitness" }
                          ].map(track => (
                            <div 
                              key={track.id}
                              onClick={() => setNewChallengeSoundtrack(track.id === "none" ? "" : track.name)}
                              style={{ 
                                display: "flex", alignItems: "center", justifyContent: "space-between", 
                                padding: "0.75rem", borderRadius: "12px", 
                                background: newChallengeSoundtrack === track.name || (track.id === "none" && !newChallengeSoundtrack) ? "var(--accent-glow)" : "var(--bg-tertiary)",
                                border: \`1px solid \${newChallengeSoundtrack === track.name || (track.id === "none" && !newChallengeSoundtrack) ? "var(--accent)" : "transparent"}\`,
                                cursor: "pointer"
                              }}
                            >
                              <div>
                                <div style={{ fontWeight: "bold", fontSize: "0.9rem", color: newChallengeSoundtrack === track.name || (track.id === "none" && !newChallengeSoundtrack) ? "#000" : "inherit" }}>{track.name}</div>
                                {track.artist && <div style={{ fontSize: "0.75rem", color: newChallengeSoundtrack === track.name || (track.id === "none" && !newChallengeSoundtrack) ? "#333" : "var(--text-muted)" }}>{track.artist}</div>}
                              </div>
                              <div>
                                <input type="radio" checked={newChallengeSoundtrack === track.name || (track.id === "none" && !newChallengeSoundtrack)} readOnly />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Step 3: Details */}
                    {creationStep === 3 && (
                      <>
                        <div className="glass-card creator-section-card">
                          <h3 className="section-title" style={{ fontWeight: 700 }}>?? ????? ??????? (Bio)</h3>
                          
                          <div className="form-group">
                            <label className="form-label">????? ????? (Bio)</label>
                            <input 
                              type="text" 
                              className="form-control" 
                              placeholder="????? ?????..." 
                              value={newChallengeTitle}
                              onChange={(e) => setNewChallengeTitle(e.target.value)}
                              required
                            />
                          </div>
                          
                          <div className="form-group">
                            <label className="form-label">????? ??????? ????? (Caption)</label>
                            <textarea 
                              className="form-control" 
                              rows="3"
                              placeholder="???? ??? ?? ?????, ????? ????? ??????? ??????..." 
                              value={newChallengeProofText}
                              onChange={(e) => setNewChallengeProofText(e.target.value)}
                              required
                            ></textarea>

                            {/* Hashtag helpers */}
                            <div className="hashtag-helpers" style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
                              {["#Fitness", "#Pulse", "#NoExcuses", "#WorkoutDone", "#ChallengeAccepted"].map(tag => (
                                <button
                                  type="button"
                                  key={tag}
                                  className="hashtag-btn"
                                  onClick={() => {
                                    if (!newChallengeProofText.includes(tag)) {
                                      setNewChallengeProofText(prev => prev + " " + tag);
                                    }
                                  }}
                                  style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border)", borderRadius: "12px", padding: "0.2rem 0.5rem", fontSize: "0.75rem", cursor: "pointer", color: "var(--text-secondary)" }}
                                >
                                  {tag}
                                </button>
                              ))}
                            </div>
                          </div>
                          
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "1rem" }}>
                            <div className="form-group">
                              <label className="form-label">???????</label>
                              <select 
                                className="form-control"
                                value={newChallengeCategory}
                                onChange={(e) => setNewChallengeCategory(e.target.value)}
                              >
                                <option value="???">??? ??</option>
                                <option value="??????">?????? ?????</option>
                                <option value="????">???? ??</option>
                                <option value="???">??? ??</option>
                              </select>
                            </div>

                            <div className="form-group">
                              <label className="form-label">??? ????</label>
                              <select 
                                className="form-control"
                                value={newChallengeDifficulty}
                                onChange={(e) => setNewChallengeDifficulty(e.target.value)}
                              >
                                <option value="??">??</option>
                                <option value="??????">??????</option>
                                <option value="???">???</option>
                                <option value="??? ????">??? ????</option>
                              </select>
                            </div>
                          </div>

                          {/* Location Pinning Component */}
                          <div className="form-group" style={{ background: "var(--bg-tertiary)", padding: "1rem", borderRadius: "16px", border: "1px solid var(--border)", marginTop: "1rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                              <input 
                                type="checkbox" 
                                id="pin-location-check"
                                checked={newChallengePinLocation}
                                onChange={(e) => {
                                  setNewChallengePinLocation(e.target.checked);
                                  if (e.target.checked && userCoords) {
                                    setNewChallengeLat(userCoords[0]);
                                    setNewChallengeLng(userCoords[1]);
                                  }
                                }}
                                style={{ width: "18px", height: "18px", cursor: "pointer" }}
                              />
                              <label htmlFor="pin-location-check" style={{ fontWeight: "bold", fontSize: "0.85rem", cursor: "pointer", color: "var(--text-primary)" }}>
                                ?? ????? ????? ???????? ???? ???????
                              </label>
                            </div>

                            {newChallengePinLocation && (
                              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "0.75rem" }}>
                                <div className="form-group" style={{ margin: 0 }}>
                                  <label className="form-label" style={{ fontSize: "0.75rem", marginBottom: "0.25rem" }}>?? ?????? ????</label>
                                  <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="??????: ???? ????? ???????"
                                    value={newChallengeLocationName}
                                    onChange={(e) => setNewChallengeLocationName(e.target.value)}
                                    style={{ padding: "0.4rem 0.75rem", fontSize: "0.8rem" }}
                                    required={newChallengePinLocation}
                                  />
                                </div>
                                <div className="form-group" style={{ margin: 0 }}>
                                  <label className="form-label" style={{ fontSize: "0.75rem", marginBottom: "0.25rem" }}>????? ??? ??????</label>
                                  <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="?????? ???? ?? ????? ??????..."
                                    value={newChallengeLocationDesc}
                                    onChange={(e) => setNewChallengeLocationDesc(e.target.value)}
                                    style={{ padding: "0.4rem 0.75rem", fontSize: "0.8rem" }}
                                  />
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                                  <div className="form-group" style={{ margin: 0 }}>
                                    <label className="form-label" style={{ fontSize: "0.75rem", marginBottom: "0.25rem" }}>?? ???? (Lat)</label>
                                    <input 
                                      type="number" 
                                      step="0.0001"
                                      className="form-control" 
                                      value={newChallengeLat}
                                      onChange={(e) => setNewChallengeLat(e.target.value)}
                                      style={{ padding: "0.4rem 0.75rem", fontSize: "0.8rem" }}
                                      required={newChallengePinLocation}
                                    />
                                  </div>
                                  <div className="form-group" style={{ margin: 0 }}>
                                    <label className="form-label" style={{ fontSize: "0.75rem", marginBottom: "0.25rem" }}>?? ???? (Lng)</label>
                                    <input 
                                      type="number" 
                                      step="0.0001"
                                      className="form-control" 
                                      value={newChallengeLng}
                                      onChange={(e) => setNewChallengeLng(e.target.value)}
                                      style={{ padding: "0.4rem 0.75rem", fontSize: "0.8rem" }}
                                      required={newChallengePinLocation}
                                    />
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  className="btn btn-secondary"
                                  onClick={() => {
                                    if (navigator.geolocation) {
                                      navigator.geolocation.getCurrentPosition((pos) => {
                                        setNewChallengeLat(pos.coords.latitude.toFixed(4));
                                        setNewChallengeLng(pos.coords.longitude.toFixed(4));
                                      });
                                    }
                                  }}
                                  style={{ padding: "0.4rem", fontSize: "0.75rem", background: "var(--bg-secondary)", border: "1px solid var(--border)" }}
                                >
                                  ?? ???? ?? ?????? ?????? ???
                                </button>
                              </div>
                            )}
                          </div>
                          
                          <div style={{ marginTop: "1.5rem", padding: "1rem", borderRadius: "12px", background: "rgba(255, 215, 0, 0.1)", border: "1px solid rgba(255, 215, 0, 0.3)", textAlign: "center" }}>
                            <span style={{ fontSize: "0.9rem", color: "var(--text-primary)" }}>
                              ??????? (XP) ????? ?????? ???????? ??? ??? ?????.
                            </span>
                          </div>

                          <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "1.5rem", background: "var(--accent)", color: "#000", fontWeight: "bold", fontSize: "1.05rem", boxShadow: "0 4px 15px var(--accent-glow)", padding: "0.8rem" }}>
                            ??? ????? ???? ????? ??
                          </button>
                        </div>
                      </>
                    )}

                    {/* Navigation Buttons for Wizard */}
                    <div style={{ display: "flex", gap: "1rem", marginTop: "1rem", justifyContent: "space-between", direction: "rtl" }}>
                      {creationStep < 3 ? (
                        <button 
                          type="button" 
                          className="btn btn-primary" 
                          onClick={() => {
                            if (creationStep === 1 && newChallengeImages.length === 0) {
                              alert("?? ????? ????? ????? ??? ??? ??????.");
                              return;
                            }
                            setCreationStep(prev => prev + 1);
                          }}
                          style={{ flex: 1, background: "var(--accent)", color: "#000", fontWeight: "bold" }}
                        >
                          ???? ?
                        </button>
                      ) : null}
                      
                      {creationStep > 1 && (
                        <button 
                          type="button" 
                          className="btn btn-secondary" 
                          onClick={() => setCreationStep(prev => prev - 1)}
                          style={{ flex: 1 }}
                        >
                          ? ????
                        </button>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}`;
lines.splice(startIdx, endIdx - startIdx + 1, newModal);
fs.writeFileSync(path, lines.join("\n"), "utf8");
console.log("Done");

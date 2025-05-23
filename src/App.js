import React, { useState, useEffect } from "react";
import "./styles.css";

import { getSongsByMood } from "./getSongsByMood";
import { getSpotifyToken } from "./getSpotifyToken";
import { enrichWithSpotify } from "./getSpotifyTrackData";

export default function App() {
  const [mood, setMood] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savedVibes, setSavedVibes] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("lastMood");
    if (saved) setMood(saved);

    const stored = JSON.parse(localStorage.getItem("savedVibes") || "[]");
    setSavedVibes(stored);
  }, []);

  useEffect(() => {
    document.body.style.background = mood.includes("sad")
      ? "#001f3f"
      : mood.includes("happy")
      ? "#FFDC00"
      : mood.includes("love")
      ? "#FF4136"
      : "linear-gradient(to bottom right, #0f9d58, #000000)";
  }, [mood]);

  const handleSearch = async () => {
    if (!mood.trim()) return;
    setLoading(true);
    try {
      const rawSongs = await getSongsByMood(mood);
      const token = await getSpotifyToken();
      const fullData = await enrichWithSpotify(rawSongs.slice(0, 5), token);
      setResults(fullData);
      localStorage.setItem("lastMood", mood);
    } catch (err) {
      console.error("Something went wrong:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleShuffle = () => {
    const shuffled = [...results].sort(() => 0.5 - Math.random());
    setResults(shuffled);
  };

  const handleSaveVibe = () => {
    const vibeData = {
      mood,
      results,
      timestamp: new Date().toLocaleString(),
    };
    const existing = JSON.parse(localStorage.getItem("savedVibes") || "[]");
    const updated = [...existing, vibeData];
    localStorage.setItem("savedVibes", JSON.stringify(updated));
    setSavedVibes(updated);
  };

  return (
    <div className="App">
      <div className="header">
        🎧 <span className="logo-text">LyricLink</span>
      </div>

      <h2 className="subheading">feel something. press play.</h2>

      <button className="detect-btn" onClick={() => setMood("heartbreak")}>
        Use AI Mood Detector
      </button>

      <div className="trending">
        Trending:
        <button onClick={() => setMood("love")}> love ❤️ </button>
        <button onClick={() => setMood("sad")}> sad 💔</button>
        <button onClick={() => setMood("party")}> party 🎉 </button>
      </div>

      <div className="input-row">
        <input
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          placeholder="type your mood (e.g. heartbreak, confident, chill)"
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <button className="shuffle-btn" onClick={handleShuffle}>
        shuffle songs 🔀
      </button>

      {results.length > 0 && (
        <button className="save-vibe-btn" onClick={handleSaveVibe}>
          save this vibe 💾
        </button>
      )}

      {loading && <p className="loading">Loading songs...</p>}

      <div className="results">
        {results.length === 0 && !loading && (
          <p className="empty-state">no songs yet. try a mood above.</p>
        )}

        {results.map((song) => (
          <div key={`${song.title}-${song.artist}`} className="song-card">
            <h2>
              {song.title} – {song.artist}
            </h2>
            {song.image && (
              <img src={song.image} alt={`${song.album} cover`} width="200" />
            )}
            {song.album && (
              <p>
                <strong>Album:</strong> {song.album}
              </p>
            )}
            {song.spotify_url && song.spotify_url.includes("/track/") ? (
              <iframe
                src={`https://open.spotify.com/embed/track/${
                  song.spotify_url.split("/track/")[1]
                }`}
                width="100%"
                height="80"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                style={{ borderRadius: "12px", marginTop: "1rem" }}
                title={`${song.title} – ${song.artist}`}
              ></iframe>
            ) : (
              <p>
                <em>Spotify track unavailable</em>
              </p>
            )}
          </div>
        ))}
      </div>

      {savedVibes.length > 0 && (
        <div className="saved-vibes">
          <h3>📁 saved vibes</h3>
          {savedVibes.map((vibe, index) => (
            <div key={index} className="saved-vibe-card">
              <button
                onClick={() => {
                  setMood(vibe.mood);
                  setResults(vibe.results);
                }}
              >
                {vibe.mood} — {vibe.timestamp}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export async function getSongsByMood(mood) {
  const API_KEY = "8871796360739eba824b727cd495947e";
  const endpoint = `https://ws.audioscrobbler.com/2.0/?method=tag.gettoptracks&tag=${mood}&api_key=${API_KEY}&format=json`;

  try {
    const res = await fetch(endpoint);
    const data = await res.json();
    return data.tracks.track.map((track) => ({
      title: track.name,
      artist: track.artist.name,
    }));
  } catch (err) {
    console.error("Error fetching from Last.fm:", err);
    return [];
  }
}

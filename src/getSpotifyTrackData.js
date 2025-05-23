export async function enrichWithSpotify(songs, token) {
  const enriched = [];

  for (let song of songs) {
    const query = `${song.title} ${song.artist}`;
    const res = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(
        query
      )}&type=track&limit=1`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await res.json();
    const match = data.tracks.items[0];

    if (match) {
      enriched.push({
        title: song.title,
        artist: song.artist,
        album: match.album.name,
        image: match.album.images[0]?.url,
        preview_url: match.preview_url,
        spotify_url: match.external_urls?.spotify,
        spotify_uri: match.uri,
      });
    }
  }

  return enriched;
}

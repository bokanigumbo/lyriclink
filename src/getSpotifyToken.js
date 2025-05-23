export async function getSpotifyToken() {
  const CLIENT_ID = "ab35241d1c924739863cf596b3e71f2b";
  const CLIENT_SECRET = "787eebb37dd24fd894ce0ff138ba73de";

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: "Basic " + btoa(CLIENT_ID + ":" + CLIENT_SECRET),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = await res.json();
  return data.access_token;
}

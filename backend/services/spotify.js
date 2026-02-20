let spotifyAccessToken = null;
let tokenExpiry = null;

export async function getSpotifyAccessToken() {
    if (spotifyAccessToken && Date.now() < tokenExpiry) {
        return spotifyAccessToken;
    }

    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            'grant_type': 'client_credentials'
        }),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error('Failed to get Spotify access token: ' + error);
    }

    const data = await response.json();
    spotifyAccessToken = data.access_token;
    tokenExpiry = Date.now() + (data.expires_in - 30) * 1000;

    return spotifyAccessToken;
}

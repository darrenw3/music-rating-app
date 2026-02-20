import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();

const connectionString = process.env.DATABASE_URL;
const adapter = new PrismaBetterSqlite3({ url: connectionString });
const prisma = new PrismaClient({ adapter });

app.use(cors());
app.use(express.json());

let spotifyAccessToken = null;
let tokenExpiry = null;
async function getSpotifyAccessToken() {
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

app.get('/api/search', async (req, res) => {
    const query = req.query.q;
    
    if (!query) {
        return res.status(400).json({ error: 'Search query required' });
    }
    
    try {
        const accessToken = await getSpotifyAccessToken();

        const response = await fetch(`https://api.spotify.com/v1/search?` + 
            new URLSearchParams({
                q: query,
                type: ['track'],
                limit: 10
            }),
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        );

        if (!response.ok) {
            const error = await response.text();
            return res.status(500).json({ error: 'Spotify search failed: ' + error });
        }

        const data = await response.json();
        const results = data.tracks.items.map(item => ({
            id: item.id,
            type: item.type,
            title: item.name,
            artist: item.artists.map(artist => artist.name).join(', '),
            album: item.album.name,
            image: item.album.images[0].url || null,
            spotifyUrl: item.external_urls.spotify
        }));

        return res.json(results);
    } catch (error) {
        console.error('Error during Spotify search:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/track/:id', async (req, res) => {
    const token = await getSpotifyAccessToken();
    const trackId = req.params.id;

    const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, 
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );

    if (!response.ok) {
        const error = await response.text();
        return res.status(500).json({ error: 'Spotify track fetch failed: ' + error });
    }

    const data = await response.json();
    return res.json({
        id: data.id,
        type: data.type,
        title: data.name,
        artist: data.artists.map(artist => artist.name).join(', '),
        album: data.album.name,
        image: data.album.images[0].url || null,
        spotifyUrl: data.external_urls.spotify
    });
});

app.post("/api/track/:id/review", async (req, res) => {
    const trackId = req.params.id;
    const { rating, review } = req.body;

    try {
        const newReview = await prisma.review.create({
            data: {
                userId: "testUserId2",
                trackId,
                rating,
                review
            }
        });

        res.json(newReview);
    } catch (error) {
        console.error('Error creating review:', error);
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'You have already reviewed this track.' });
        }
    }
});

app.get("/api/track/:id/reviews", async (req, res) => {
    const trackId = req.params.id;

    const reviewList = await prisma.review.findMany({
        where: { trackId },
        orderBy: { createdAt: 'desc' }
    });

    const averageRating = reviewList.length > 0 ? reviewList.reduce((sum, r) => sum + r.rating, 0) / reviewList.length : null;

    res.json({ reviewList, averageRating });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
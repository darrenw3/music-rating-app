import express from 'express';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '@prisma/client';
import { getSpotifyAccessToken } from '../services/spotify.js';

const router = express.Router();

const connectionString = process.env.DATABASE_URL;
const adapter = new PrismaBetterSqlite3({ url: connectionString });
const prisma = new PrismaClient({ adapter });

router.get('/:id', async (req, res) => {
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

router.post("/:id/review", async (req, res) => {
    const trackId = req.params.id;
    const { rating, review } = req.body;

    const userId = 1;
    
    try {
        const newReview = await prisma.review.create({
            data: {
                userId,
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

router.get("/:id/reviews", async (req, res) => {
    const trackId = req.params.id;

    const reviewList = await prisma.review.findMany({
        where: { trackId },
        orderBy: { createdAt: 'desc' }
    });

    const averageRating = reviewList.length > 0 ? reviewList.reduce((sum, r) => sum + r.rating, 0) / reviewList.length : null;

    res.json({ reviewList, averageRating });
});

export default router;

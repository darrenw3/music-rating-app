import express from 'express';
import prisma from '../db.js';
import { getSpotifyAccessToken } from '../services/spotify.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { formatDuration } from '../utils/format.js';

const router = express.Router();

router.get('/:id', async (req, res) => {
    const token = await getSpotifyAccessToken();
    const albumId = req.params.id;

    const response = await fetch(`https://api.spotify.com/v1/albums/${albumId}`, 
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );

    if (!response.ok) {
        const error = await response.text();
        return res.status(500).json({ error: 'Spotify fetch failed: ' + error });
    }

    const data = await response.json();
    return res.json({
        id: data.id,
        type: data.type,
        title: data.name,
        artist: data.artists.map(artist => artist.name).join(', '),
        releaseDate: data.release_date,
        tracks: data.tracks.items.map(track => ({
            id: track.id,
            trackNumber: track.track_number,
            title: track.name,
            duration: formatDuration(track.duration_ms)
        })),
        image: data.images[0].url || null,
        spotifyUrl: data.external_urls.spotify
    });
});

router.post("/:id/review", requireAuth, async (req, res) => {
    const albumId = req.params.id;
    const userId = req.userId;
    const { rating, review } = req.body;
    
    try {
        const newReview = await prisma.review.create({
            data: {
                userId,
                spotifyId: albumId,
                rating,
                review
            }
        });

        res.json(newReview);
    } catch (error) {
        console.error('Error creating review:', error);
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'You have already reviewed this album.' });
        }
    }
});

router.get("/:id/reviews", async (req, res) => {
    const albumId = req.params.id;

    const reviewList = await prisma.review.findMany({
        where: { spotifyId: albumId },
        orderBy: { createdAt: 'desc' }
    });

    const averageRating = reviewList.length > 0 ? reviewList.reduce((sum, r) => sum + r.rating, 0) / reviewList.length : null;

    res.json({ reviewList, averageRating });
});

export default router;

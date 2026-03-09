import express from 'express';
import prisma from '../db.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { formatDuration } from '../utils/format.js';

const router = express.Router();

router.get('/:id', async (req, res) => {
    const trackId = req.params.id;

    const response = await fetch(`https://api.deezer.com/track/${trackId}`);

    if (!response.ok) {
        const error = await response.text();
        return res.status(500).json({ error: 'Deezer track fetch failed: ' + error });
    }

    const data = await response.json();
    return res.json({
        id: data.id,
        title: data.title,
        artist: data.artist.name,
        album: data.album.title,
        releaseDate: data.release_date,
        image: data.album.cover,
        duration: formatDuration(data.duration),
        previewUrl: data.preview,
    });
});

router.post("/:id/review", requireAuth, async (req, res) => {
    const trackId = req.params.id;
    const userId = req.userId;
    const { rating, review } = req.body;
    
    try {
        const newReview = await prisma.review.create({
            data: {
                userId,
                deezerId: trackId,
                type: 'track',
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
        where: { deezerId: trackId, type: 'track' },
        orderBy: { createdAt: 'desc' }
    });

    const averageRating = reviewList.length > 0 ? reviewList.reduce((sum, r) => sum + r.rating, 0) / reviewList.length : null;

    res.json({ reviewList, averageRating });
});

export default router;

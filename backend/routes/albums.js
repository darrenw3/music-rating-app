import express from 'express';
import prisma from '../db.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { formatDuration } from '../utils/format.js';

const router = express.Router();

router.get('/:id', async (req, res) => {
    const albumId = req.params.id;

    const response = await fetch(`https://api.deezer.com/album/${albumId}`);

    if (!response.ok) {
        const error = await response.text();
        return res.status(500).json({ error: 'Deezer fetch failed: ' + error });
    }

    const data = await response.json();
    return res.json({
        id: data.id,
        title: data.title,
        artist: data.artist.name,
        releaseDate: data.release_date,
        genre: data.genres.data.map(g => g.name).join(', '),
        tracks: data.tracks.data.map(track => ({
            id: track.id,
            title: track.title,
            duration: formatDuration(track.duration),
            previewUrl: track.preview,
        })),
        image: data.cover,
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
                deezerId: albumId,
                type: 'album',
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
        where: { deezerId: albumId, type: 'album' },
        orderBy: { createdAt: 'desc' }
    });

    const averageRating = reviewList.length > 0 ? reviewList.reduce((sum, r) => sum + r.rating, 0) / reviewList.length : null;

    res.json({ reviewList, averageRating });
});

export default router;

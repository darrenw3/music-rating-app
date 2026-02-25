import express from 'express';
import { getSpotifyAccessToken } from '../services/spotify.js';

const router = express.Router();

router.get('/track', async (req, res) => {
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
        }));

        return res.json(results);
    } catch (error) {
        console.error('Error during Spotify search:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/album', async (req, res) => {
    const query = req.query.q;
    
    if (!query) {
        return res.status(400).json({ error: 'Search query required' });
    }
    
    try {
        const accessToken = await getSpotifyAccessToken();

        const response = await fetch(`https://api.spotify.com/v1/search?` + 
            new URLSearchParams({
                q: query,
                type: ['album'],
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
        const results = data.albums.items.map(item => ({
            id: item.id,
            type: item.type,
            title: item.name,
            artist: item.artists.map(artist => artist.name).join(', '),
            image: item.images[0].url || null,
        }));

        return res.json(results);
    } catch (error) {
        console.error('Error during Spotify search:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});


export default router;

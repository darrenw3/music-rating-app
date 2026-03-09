import express from 'express';

const router = express.Router();

router.get('/track', async (req, res) => {
    const query = req.query.q;
    
    if (!query) {
        return res.status(400).json({ error: 'Search query required' });
    }
    
    try {
        const response = await fetch(`https://api.deezer.com/search?` + 
            new URLSearchParams({
                q: query,
                limit: 10
            }),
        );

        if (!response.ok) {
            const error = await response.text();
            return res.status(500).json({ error: 'Deezer search failed: ' + error });
        }

        const data = await response.json();
        const results = data.data.map(item => ({
            id: item.id,
            title: item.title,
            artist: item.artist.name,
            album: item.album.title,
            image: item.album.cover,
        }));

        return res.json(results);
    } catch (error) {
        console.error('Error during Deezer search:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/album', async (req, res) => {
    const query = req.query.q;
    
    if (!query) {
        return res.status(400).json({ error: 'Search query required' });
    }
    
    try {
        const response = await fetch(`https://api.deezer.com/search/album?` + 
            new URLSearchParams({
                q: query,
                limit: 10
            }),
        );

        if (!response.ok) {
            const error = await response.text();
            return res.status(500).json({ error: 'Deezer search failed: ' + error });
        }

        const data = await response.json();
        const results = data.data.map(item => ({
            id: item.id,
            title: item.title,
            artist: item.artist.name,
            image: item.cover,
        }));

        return res.json(results);
    } catch (error) {
        console.error('Error during Deezer search:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});


export default router;

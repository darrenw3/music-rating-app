import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function TrackPage() {
    const { id } = useParams();
    const [track, setTrack] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch(`http://localhost:5000/api/track/${id}`)
            .then(response => response.json())
            .then(setTrack);
    }, [id]);

    if (!track) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h2>{track.title}</h2>
            <p>{track.artist}</p>
            <i>{track.album}</i>
            {track.image && <img src={track.image} alt={track.title} style={{ width: 200 }} />}
            <p><a href={track.spotifyUrl} target="_blank" rel="noopener noreferrer">Listen on Spotify</a></p>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    )
}

import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
  Container,
  Typography,
  Box,
  Card,
  CardMedia,
  CardContent,
  Rating,
  TextField,
  Button,
  Stack,
} from "@mui/material"

export default function AlbumPage() {
  const { id } = useParams();

  const [album, setAlbum] = useState(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [reviewList, setReviewList] = useState([]);
  const [averageRating, setAverageRating] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
      fetch(`http://localhost:5000/api/albums/${id}`)
          .then(response => response.json())
          .then(setAlbum);
  }, [id]);

  const loadReviews = async () => {
    const response = await fetch(`http://localhost:5000/api/albums/${id}/reviews`);

    if (response.ok) {
        const data = await response.json();
        setReviewList(data.reviewList);
        setAverageRating(data.averageRating);
    }
  };

  useEffect(() => {
      loadReviews();
  }, [id]);

  const submitReview = async () => {
    if (!rating) {
      alert("Please provide a rating before submitting your review.");
      return;
    }

    const response = await fetch(`http://localhost:5000/api/albums/${id}/review`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ rating, review }),
    });

    if (response.ok) {
      setRating(0);
      setReview("");
      loadReviews();
    } else {
      const data = await response.json();
      alert(`Failed to submit review: ${data.error}`);
    }
  };

  if (!album) {
      return <p>Loading...</p>;
  }
  
  
  return (
    <Container maxWidth="sm" sx={{ mt: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>

        <Card sx={{ display: "flex", width: "100%", mb: 3 }}>
            <CardMedia
                component="img"
                image={album.image}
                alt={`${album.title} album cover`}
                sx={{ width: 120, height: 120, objectFit: "cover" }}
            />
            <CardContent>
                <Typography variant="h5">{album.title}</Typography>
                <Typography color="text.secondary">{album.artist}</Typography>
                <Typography color="text.secondary">{album.releaseDate}</Typography>
                {averageRating && (
                    <Box sx={{ mt: 1, display: "flex", alignItems: "center" }}>
                    <Rating value={averageRating} precision={0.1} readOnly />
                    <Typography sx={{ ml: 1 }}>{averageRating.toFixed(1)}</Typography>
                    </Box>
                )}
            </CardContent>
        </Card>

        <Stack spacing={1} sx={{ mb: 4, width: "200%" }}>
            {album.tracks.map(track => (
                <Card
                key={track.id}
                sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
                onClick={() => navigate(`/track/${track.id}`)}
                >
                <CardContent sx={{ flexGrow: 1 }}>
                    <Typography>{track.trackNumber}. {track.title}</Typography>
                </CardContent>
                <Typography sx={{ pr: 2 }}>{track.duration}</Typography>
                </Card>
            ))}
        </Stack>

        <Box sx={{ width: "100%" }}>
            <Typography variant="h6" gutterBottom>
                Your Rating
            </Typography>
            <Rating
                value={rating}
                precision={0.5}
                onChange={(e, newValue) => setRating(newValue)}
            />
            <TextField
                placeholder="Write a review..."
                multiline
                minRows={3}
                fullWidth
                sx={{ mt: 2, 
                    backgroundColor: "white", 
                    borderRadius: 1,
                    "& .MuiInputBase-input": {
                        color: "black",
                    },
                 }}
                value={review}
                onChange={(e) => setReview(e.target.value)}
            />
            <Button variant="contained" sx={{ mt: 2 }} onClick={submitReview}>
                Submit Review
            </Button>
        </Box>

        <Typography variant="h6" gutterBottom>
            All Reviews:
        </Typography>

        {reviewList.length === 0 && (
            <Typography>No reviews yet.</Typography>
        )}

        {reviewList.map((r) => (
            <Card
            key={r.id}
            sx={{ mb: 2 }}
            >
            <CardContent>
                <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={1}
                >
                <Rating
                    value={r.rating}
                    precision={0.5}
                    readOnly
                />

                <Typography
                    variant="caption"
                    color="text.secondary"
                >
                    {new Date(
                    r.createdAt
                    ).toLocaleDateString()}
                </Typography>
                </Box>

                <Typography>
                {r.review}
                </Typography>
            </CardContent>
            </Card>
        ))}
    </Container>
  )
}

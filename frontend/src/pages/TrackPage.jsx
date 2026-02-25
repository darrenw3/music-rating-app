import { useParams } from 'react-router-dom'
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

export default function TrackPage() {
  const { id } = useParams();
  const [track, setTrack] = useState(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [reviewList, setReviewList] = useState([]);
  const [averageRating, setAverageRating] = useState(null);

  useEffect(() => {
      fetch(`http://localhost:5000/api/tracks/${id}`)
          .then(response => response.json())
          .then(setTrack);
  }, [id]);

  const loadReviews = async () => {
    const response = await fetch(`http://localhost:5000/api/tracks/${id}/reviews`);

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

    const response = await fetch(`http://localhost:5000/api/tracks/${id}/review`, {
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

  if (!track) {
      return <p>Loading...</p>;
  }
  
  
  return (
    <Container maxWidth="sm" sx={{ mt: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>

      <Card sx={{ display: "flex", width: "100%", mb: 3 }}>
        <CardMedia
          component="img"
          image={track.image}
          alt={`${track.title} album cover`}
          sx={{ width: 120, height: 120, objectFit: "cover" }}
        />
        <CardContent>
          <Typography variant="h5">{track.title}</Typography>
          <Typography color="text.secondary">{track.artist}</Typography>
          <Typography color="text.secondary">{track.releaseDate}</Typography>
          {averageRating && (
            <Box sx={{ mt: 1, display: "flex", alignItems: "center" }}>
              <Rating value={averageRating} precision={0.1} readOnly />
              <Typography sx={{ ml: 1 }}>{averageRating.toFixed(1)}</Typography>
            </Box>
          )}
        </CardContent>
      </Card>


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
        All Reviews
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

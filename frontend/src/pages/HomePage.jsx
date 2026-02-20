import { use, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SearchIcon from '@mui/icons-material/Search'
import {
  Container, 
  TextField,
  Typography,
  Card,
  CardContent,
  Stack,
  Box,
  IconButton,
  CardMedia
} from '@mui/material'

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const search = async () => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`http://localhost:5000/api/search?q=${encodeURIComponent(trimmedQuery)}`);
      if (!response.ok) {
        const errorMsg = await response.text();
        throw new Error(errorMsg || 'Search request failed');
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.error(err);
      setError('Error during search: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>

      <Typography variant="h4" gutterBottom align="center">
        WAVrater
      </Typography>

      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          search();
        }}
      >
        <Stack direction="row" spacing={1}>
          <TextField
            fullWidth
            placeholder="Search for a song"
            color="primary"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{
              backgroundColor: "white",
              borderRadius: 1
            }}
          />

          <IconButton onClick={search} disabled={loading}>
            <SearchIcon sx={{ color: "white" }} />
          </IconButton>
        </Stack>
      </Box>

      <Stack spacing={1} sx={{ mt: 4 }}>
        {results.map((item) => (
          <Card
            key={item.id}
            sx={{ cursor: "pointer", display: "flex", backgroundColor: "#f5f5f5ec" }}
            onClick={() => navigate(`/track/${item.id}`)}
          >
            <CardMedia
              component="img"
              image={item.image}
              sx={{ width: 100, height: 100, objectFit: "cover" }}
            />

            <CardContent>
              <Typography variant="h6"> {item.title} </Typography>
              <Typography color="text.secondary"> {item.artist} </Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>

    </Container>
  );
}

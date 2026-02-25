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
  CardMedia,
  Select,
  MenuItem,
  InputAdornment
} from '@mui/material'

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [queryType, setQueryType] = useState("track");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const placeholders = {
    track: "Search for a track",
    album: "Search for an album",
    artist: "Search for an artist"
  }

  const search = async () => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    try {
      setLoading(true);

      const response = await fetch(`http://localhost:5000/api/search/${queryType}?q=${encodeURIComponent(trimmedQuery)}`);
      if (!response.ok) {
        const errorMsg = await response.text();
        throw new Error(errorMsg || 'Search request failed');
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.error(err);
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
            placeholder={placeholders[queryType]}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{
              backgroundColor: "whitesmoke",
              borderRadius: 1,
              input: {
                color: "black",
              }
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start" sx={{ borderRight: "1px solid #ccc", mr: 1, pr: 1 }}>
                    <Select
                      variant="standard"
                      value={queryType}
                      onChange={(e) => setQueryType(e.target.value)}
                      sx={{ 
                        minWidth: 90,
                        color: "black", 
                      }}
                    >
                      <MenuItem value="track">Track</MenuItem>
                      <MenuItem value="album">Album</MenuItem>
                      <MenuItem value="artist">Artist</MenuItem>
                    </Select>
                  </InputAdornment>
                ),
              },
            }}
          />

          <IconButton type="submit" disabled={loading}>
            <SearchIcon sx={{ color: "white" }} />
          </IconButton>
        </Stack>
      </Box>

      <Stack spacing={1} sx={{ mt: 4 }}>
        {results.map((item) => (
          <Card
            key={item.id}
            sx={{ cursor: "pointer", display: "flex", backgroundColor: "#f5f5f5ec" }}
            onClick={() => navigate(`/${queryType}/${item.id}`)}
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

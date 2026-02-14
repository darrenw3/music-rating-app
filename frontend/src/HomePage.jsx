import { useState } from 'react'
import { Link } from 'react-router-dom'
import './App.css'

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    <div style={{ padding: 20 }}>
      <h1>🎵 Music Rater</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          search();
        }}
      >
        <input
          type="text"
          value={query}
          placeholder="Search for a song or artist"
          onChange={(e) => setQuery(e.target.value)}
          disabled={loading}
        />

        <button type="submit" style={{ marginLeft: 8 }} disabled={loading}>
          Search
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>
        {results.map((item) => (
          <li key={item.id}>
            <Link to={`/${item.type}/${item.id}`}>
                {item.title} – {item.artist}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

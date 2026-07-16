import { useState } from "react";
import axios from "axios";
import "./style.css";

function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setMovies([]);

    try {
      const { data } = await axios.post("http://127.0.0.1:8000/recommend", {
        query,
      });

      setMovies(data.movies || []);
    } catch (err) {
      console.error(err);
      setError("Unable to fetch movie recommendations.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="search-box">
        <h1>Movie Recommendation System</h1>
        <p>Describe the type of movie you'd like to watch.</p>

        <textarea
          placeholder="Example: Action movies with time travel and a strong female lead..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          rows={5}
        />

        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Searching..." : "Get Recommendations"}
        </button>

        {error && <p className="error">{error}</p>}
      </div>

      {movies.length > 0 && (
        <div className="movie-grid">
          {movies.map((movie, index) => (
            <div className="movie-card" key={index}>
              <img
                src={
                  movie.poster ||
                  "https://via.placeholder.com/300x450?text=No+Poster"
                }
                alt={movie.title}
              />

              <div className="movie-info">
                <h3>{movie.title}</h3>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
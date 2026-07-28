import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../home.css'

function Home({ query, setQuery, movies, setMovies }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [justSearched, setJustSearched] = useState(false); // NEW
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setMovies([]);
    setJustSearched(false); // reset before fetch

    try {
      const { data } = await axios.post("http://127.0.0.1:8000/recommend", {
        query,
      });

      setMovies(data.movies || []);
      setJustSearched(true); // NEW — mark this batch as "fresh"
    } catch (err) {
      console.error(err);
      setError("Unable to fetch movie recommendations.");
    } finally {
      setLoading(false);
    }
  };

  const handlePosterClick = (movie) => {
    const params = new URLSearchParams({
      title: movie.title || "",
      overview: movie.overview || "",
      director: movie.director || "",
      cast: movie.cast || "",
      genres: movie.genres || "",
      runtime: movie.runtime || "",
      release_date: movie.release_date || "",
      poster: movie.poster || "",
      score: movie.score ?? "",
    });

    navigate(`/movie?${params.toString()}`);
  };

  return (
    <div className="app">
      <div className="search-box">
        <h1>CineMatch</h1>
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
            <div
              className={`movie-card${justSearched ? " animate-in" : ""}`}
              key={index}
              onClick={() => handlePosterClick(movie)}
              style={{
                cursor: "pointer",
                animationDelay: justSearched ? `${index * 60}ms` : "0ms",
              }}
            >
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

export default Home;
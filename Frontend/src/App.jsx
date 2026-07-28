import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Movie from "./pages/Movie.jsx";

function App() {
  // Lifted state — lives here so it survives navigating away and back
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Home
            query={query}
            setQuery={setQuery}
            movies={movies}
            setMovies={setMovies}
          />
        }
      />
      <Route path="/movie" element={<Movie />} />
    </Routes>
  );
}

export default App;
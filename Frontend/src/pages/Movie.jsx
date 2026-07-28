import { useSearchParams, useNavigate } from "react-router-dom";
import "../movie.css";

// Converts "['Ellen Page', 'Woody Allen']" -> "Ellen Page, Woody Allen"
function formatList(value) {
  if (!value) return "N/A";
  try {
    // Handles Python-style list strings with single quotes
    const cleaned = value
      .replace(/^\[|\]$/g, "")       // remove leading/trailing brackets
      .split(",")
      .map((item) =>
        item
          .trim()
          .replace(/^['"]|['"]$/g, "") // strip surrounding quotes
      )
      .filter(Boolean);
    return cleaned.length ? cleaned.join(", ") : "N/A";
  } catch {
    return value;
  }
}

// Converts 111 -> "1h 51m"
function formatRuntime(minutes) {
  const total = parseInt(minutes, 10);
  if (!total || isNaN(total)) return "N/A";
  const hours = Math.floor(total / 60);
  const mins = total % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

// Converts "2012-04-20" -> "20 April 2012"
function formatDate(dateStr) {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  if (isNaN(date)) return dateStr;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function Movie() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const title = searchParams.get("title");
  const overview = searchParams.get("overview");
  const director = searchParams.get("director");
  const cast = formatList(searchParams.get("cast"));
  const genres = formatList(searchParams.get("genres"));
  const runtime = formatRuntime(searchParams.get("runtime"));
  const release_date = formatDate(searchParams.get("release_date"));
  const poster = searchParams.get("poster");

  return (
    <div className="movie-details">
      <div className="details-content">
        <div className="poster-wrap">
          <img
            src={poster || "https://via.placeholder.com/300x450?text=No+Poster"}
            alt={title}
          />
        </div>

        <div className="details-info">
          <button className="back-btn" onClick={() => navigate(-1)}>
            &larr; Back
          </button>
          <div className="details-header">
            <h1>{title}</h1>
          </div>

          <div className="details-subline">
            {genres !== "N/A" && <span className="genres">{genres}</span>}
            {genres !== "N/A" && runtime !== "N/A" && (
              <span className="dot">&middot;</span>
            )}
            {runtime !== "N/A" && <span className="runtime">{runtime}</span>}
          </div>

          <p>{overview}</p>
          <p><strong>Release Date:</strong> {release_date}</p>
          <p><strong>Director:</strong> {director}</p>
          <p><strong>Cast:</strong> {cast}</p>
        </div>
      </div>
    </div>
  );
}

export default Movie;
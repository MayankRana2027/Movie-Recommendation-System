from sklearn.metrics.pairwise import cosine_similarity
import requests
import pandas as pd
import pickle
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

API_KEY = "20f159696c931d74c72562494cb309e1"
movies = pd.read_csv("Dataset/movies.csv")
cv = pickle.load(open("cv.pkl", "rb"))
vectors = pickle.load(open("vectors.pkl", "rb"))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React app
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Query(BaseModel):
    query: str

session = requests.Session()

def fetchPoster(movie_id):
    try:
        response = session.get(
            f'https://api.themoviedb.org/3/movie/{int(movie_id)}',
            params={"api_key": API_KEY},
            timeout=10,
        )
        response.raise_for_status()
        data = response.json()
        poster_path = data.get('poster_path')
        return f"https://image.tmdb.org/t/p/original{poster_path}" if poster_path else None
    except (requests.RequestException, ValueError) as e:
        print(f"Request failed for movie {movie_id}: {e}")
        return None

def recommend(query):
    query_vector = cv.transform([query])
    similarity_scores = cosine_similarity(query_vector, vectors).flatten()
    top_movies = similarity_scores.argsort()[::-1][:10]

    recommended_movies_names = []
    recommended_movies_posters = []

    for idx in top_movies:
        recommended_movies_names.append(movies.iloc[idx]['title'])
        recommended_movies_posters.append(fetchPoster(movies.iloc[idx]['id']))
    
    return recommended_movies_names, recommended_movies_posters

@app.post("/recommend")
def get_recommendations(data: Query):
    query = data.query.strip()
    if not query:
        raise HTTPException(status_code=400, detail="Query cannot be empty")
    
    names, posters = recommend(query)

    return {
        "movies": [
            {"title": name, "poster": poster}
            for name, poster in zip(names, posters)
        ]
    }
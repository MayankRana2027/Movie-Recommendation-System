# Movie Recommendation System

## 📌 Dataset

**Dataset:** 
https://www.kaggle.com/datasets/tmdb/tmdb-movie-metadata

## 🚀 How It Works

This project recommends movies by comparing the user's input with information extracted from the dataset.

For every movie, a **tag** is created by combining the following attributes:

* 🎥 Movie Title
* 🎭 Genres
* 🔑 Keywords
* 🎬 Director
* 👥 Cast
* 📝 Overview

The generated tags are preprocessed and converted into numerical vectors using **Bag of Words** vectorization technique.

When a user searches for a movie or enters a text query:

1. The query is converted into a vector using the same vectorizer.
2. Cosine similarity is calculated between the query vector and every movie vector.
3. The **top 10 most similar movies** are returned as recommendations.

## 🛠️ Recommendation Pipeline

```text
TMDB Dataset
      │
      ▼
Extract Features
(Title + Genres + Keywords + Director + Cast + Overview)
      │
      ▼
Create Tags
      │
      ▼
Vectorization
      │
      ▼
Store Movie Vectors
      │
      ▼
User Query
      │
      ▼
Vectorize Query
      │
      ▼
Cosine Similarity
      │
      ▼
Top 10 Recommended Movies
```

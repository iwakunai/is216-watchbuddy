const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || "";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

export async function fetchTrending() {
  if (TMDB_API_KEY) {
    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/trending/movie/day?api_key=${TMDB_API_KEY}`
      );
      if (response.ok) {
        const data = await response.json();
        return data.results;
      }
    } catch (err) {
      
      return [];
    }
  }
}

// Search both movies and TV shows
export async function searchMulti(query: string) {
  if (!TMDB_API_KEY || !query.trim()) {
    return [];
  }

  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
        query
      )}&page=1&include_adult=false`
    );

    if (response.ok) {
      const data = await response.json();
      // Filter to only movies and TV shows, exclude people
      return data.results
        .filter(
          (item: any) => item.media_type === "movie" || item.media_type === "tv"
        )
        .map((item: any) => ({
          id: item.id,
          title: item.media_type === "movie" ? item.title : item.name,
          type: item.media_type,
          year:
            item.media_type === "movie"
              ? item.release_date
                ? new Date(item.release_date).getFullYear()
                : 0
              : item.first_air_date
              ? new Date(item.first_air_date).getFullYear()
              : 0,
          poster: item.poster_path
            ? `${TMDB_IMAGE_BASE_URL}${item.poster_path}`
            : "",
          overview: item.overview || "",
          rating: item.vote_average || 0,
        }));
    }
  } catch (err) {
    
    return [];
  }

  return [];
}

// Search only movies
export async function searchMovies(query: string) {
  if (!TMDB_API_KEY || !query.trim()) {
    return [];
  }

  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
        query
      )}&page=1&include_adult=false`
    );

    if (response.ok) {
      const data = await response.json();
      return data.results.map((item: any) => ({
        id: item.id,
        title: item.title,
        type: "movie",
        year: item.release_date ? new Date(item.release_date).getFullYear() : 0,
        poster: item.poster_path
          ? `${TMDB_IMAGE_BASE_URL}${item.poster_path}`
          : "",
        overview: item.overview || "",
        rating: item.vote_average || 0,
      }));
    }
  } catch (err) {
    
    return [];
  }

  return [];
}

// Search only TV shows
export async function searchTVShows(query: string) {
  if (!TMDB_API_KEY || !query.trim()) {
    return [];
  }

  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
        query
      )}&page=1&include_adult=false`
    );

    if (response.ok) {
      const data = await response.json();
      return data.results.map((item: any) => ({
        id: item.id,
        title: item.name,
        type: "tv",
        year: item.first_air_date
          ? new Date(item.first_air_date).getFullYear()
          : 0,
        poster: item.poster_path
          ? `${TMDB_IMAGE_BASE_URL}${item.poster_path}`
          : "",
        overview: item.overview || "",
        rating: item.vote_average || 0,
      }));
    }
  } catch (err) {
    
    return [];
  }

  return [];
}

// Get movie details by ID
export async function getMovieDetails(movieId: string) {
  if (!TMDB_API_KEY) {
    return null;
  }

  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}`
    );

    if (response.ok) {
      const item = await response.json();
      return {
        id: item.id,
        title: item.title,
        type: "movie",
        year: item.release_date ? new Date(item.release_date).getFullYear() : 0,
        poster: item.poster_path
          ? `${TMDB_IMAGE_BASE_URL}${item.poster_path}`
          : "",
        overview: item.overview || "",
        rating: item.vote_average || 0,
        runtime: item.runtime || 0,
        genres: item.genres?.map((g: any) => g.name) || [],
      };
    }
  } catch (err) {
    
    return null;
  }

  return null;
}

// Get TV show details by ID
export async function getTVShowDetails(tvId: string) {
  if (!TMDB_API_KEY) {
    return null;
  }

  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/tv/${tvId}?api_key=${TMDB_API_KEY}`
    );

    if (response.ok) {
      const item = await response.json();
      return {
        id: item.id,
        title: item.name,
        type: "tv",
        year: item.first_air_date
          ? new Date(item.first_air_date).getFullYear()
          : 0,
        poster: item.poster_path
          ? `${TMDB_IMAGE_BASE_URL}${item.poster_path}`
          : "",
        overview: item.overview || "",
        rating: item.vote_average || 0,
        seasons: item.number_of_seasons || 0,
        episodes: item.number_of_episodes || 0,
        genres: item.genres?.map((g: any) => g.name) || [],
      };
    }
  } catch (err) {
    
    return null;
  }

  return null;
}
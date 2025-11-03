const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || "";

export async function fetchTrending() {
  if (TMDB_API_KEY) {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/trending/movie/day?api_key=${TMDB_API_KEY}`
      );
      if (response.ok) {
        const data = await response.json();
        return data.results;
      }
    } catch (err) {
      console.error("Error fetching movies: ", err);
      return [];
    }
  }
}

// AI service - calls Claude API with backend proxy
interface Movie {
  id: number;
  title: string;
  overview: string;
  genre_ids: number[];
  vote_average: number;
  popularity: number;
  release_date: string;
}

interface AIRecommendationRequest {
  mood: string;
  genres: string[];
  movies: Movie[];
}

interface AIRecommendationResponse {
  rankedMovies: Array<{
    id: number;
    score: number;
    reasoning: string;
  }>;
  personalizedInsight: string;
}

export class AIRecommenderService {
  private backendUrl: string = "";
  private requestCache: Map<string, { data: AIRecommendationResponse; timestamp: number }>;
  private cacheDuration = 3600000;


  constructor(backendUrl: string = '') {

  // Auto-detect environment
  this.backendUrl = backendUrl || (
    import.meta.env.PROD 
      ? import.meta.env.VITE_BACKEND_URL || '' // Production: use env variable
      : 'http://localhost:3001' // Development: use localhost
  );
  this.requestCache = new Map();
    
}

  async getRankedRecommendations(request: AIRecommendationRequest): Promise<AIRecommendationResponse> {
      
    
    const cacheKey = this.getCacheKey(request);
    const cached = this.requestCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
        
      return cached.data;
    }

    try {
      const response = await fetch(`${this.backendUrl}/api/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mood: request.mood,
          genres: request.genres,
          movies: request.movies,
        }),
      });

      if (!response.ok) {
        throw new Error(`Backend error: ${response.statusText}`);
      }

      const result = await response.json();
        
      
      this.requestCache.set(cacheKey, { data: result, timestamp: Date.now() });
      return result;
    } catch (error) {
      
      return this.fallbackRanking(request.movies);
    }
  }

  private fallbackRanking(movies: Movie[]): AIRecommendationResponse {
    return {
      rankedMovies: movies
        .sort((a, b) => b.vote_average - a.vote_average)
        .map(m => ({
          id: m.id,
          score: Math.min(m.vote_average * 10, 100),
          reasoning: "Ranked by ratings",
        })),
      personalizedInsight: "Backend unavailable - showing top-rated movies.",
    };
  }

  private getCacheKey(request: AIRecommendationRequest): string {
    const movieIds = request.movies.map(m => m.id).sort().slice(0, 10).join(",");
    return `${request.mood}-${request.genres.sort().join(",")}-${movieIds}`;
  }

  clearCache(): void {
    this.requestCache.clear();
  }
}
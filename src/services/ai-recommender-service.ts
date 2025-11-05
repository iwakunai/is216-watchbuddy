// Enhanced AI-Powered Movie Recommendation Service with Pagination Support
// Improved mood+genre algorithm with better accuracy

interface Movie {
  id: number;
  title: string;
  overview: string;
  genre_ids: number[];
  vote_average: number;
  popularity: number;
  release_date: string;
  poster_path?: string;
}

interface AIRecommendationRequest {
  mood: string;
  genres: string[];
  movies: Movie[];
  userHistory?: string[];
  previousRecommendations?: number[]; // Track what we've already shown
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
  private apiKey: string;
  private apiUrl = 'https://api.anthropic.com/v1/messages';
  private requestCache: Map<string, { data: AIRecommendationResponse; timestamp: number }>;
  private cacheDuration = 3600000; // 1 hour in milliseconds

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.requestCache = new Map();
  }

  /**
   * Use AI to analyze and rank movies based on user's mood and preferences
   * Now supports larger batches for "load more" functionality
   */
  async getRankedRecommendations(
    request: AIRecommendationRequest
  ): Promise<AIRecommendationResponse> {
    // Check cache first
    const cacheKey = this.getCacheKey(request);
    const cached = this.requestCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
      console.log('✅ Using cached AI recommendations');
      return cached.data;
    }

    const prompt = this.buildEnhancedPrompt(request);

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 3072, // Increased for more detailed analysis
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`AI API error: ${response.statusText}`);
      }

      const data = await response.json();
      const aiResponse = data.content[0].text;
      const result = this.parseAIResponse(aiResponse);
      
      // Cache the result
      this.requestCache.set(cacheKey, { data: result, timestamp: Date.now() });
      
      return result;
    } catch (error) {
      console.error('Error getting AI recommendations:', error);
      return this.fallbackRanking(request.movies);
    }
  }

  /**
   * Enhanced prompt builder with better mood+genre combination logic
   */
  private buildEnhancedPrompt(request: AIRecommendationRequest): string {
    const { mood, genres, movies, userHistory, previousRecommendations } = request;

    // Build mood+genre combination instructions
    let moodGenreInstructions = '';
    if (mood && genres.length > 0) {
      moodGenreInstructions = `
IMPORTANT - MOOD + GENRE COMBINATION:
The user has selected BOTH a mood (${mood}) AND specific genres (${genres.join(', ')}).

Your ranking MUST satisfy BOTH criteria:
1. The movie MUST contain at least one of the selected genres
2. The movie MUST strongly match the ${mood} mood

For mood+genre combinations:
- A genre-matching movie with weak mood alignment: Score 30-50
- A genre-matching movie with moderate mood alignment: Score 60-75
- A genre-matching movie with strong mood alignment: Score 80-95
- A non-genre-matching movie regardless of mood: Score 0-20 (heavily penalize)

Examples for "${mood}" mood + "${genres.join(', ')}" genres:
- Perfect match: High emotional resonance AND genre match → 90-95
- Good match: Decent emotional fit AND genre match → 75-85
- Okay match: Weak emotional fit BUT genre match → 50-70
- Poor match: Great mood BUT wrong genre → 20-30
- Reject: Wrong genre AND wrong mood → 0-15`;
    } else if (mood) {
      moodGenreInstructions = `
The user has selected a mood (${mood}) with NO specific genres.

Your ranking should PRIORITIZE mood matching above all:
- Focus on emotional tone, themes, and narrative arc
- Consider any genre as long as it matches the mood
- Score range: 0-100 based purely on mood alignment`;
    } else if (genres.length > 0) {
      moodGenreInstructions = `
The user has selected genres (${genres.join(', ')}) with NO specific mood.

Your ranking should PRIORITIZE genre matching with quality:
- Movie MUST be in selected genres
- Within genre, rank by quality, popularity, and critical acclaim
- Score range: 0-100 based on genre fit and quality`;
    }

    let prompt = `You are an expert movie recommendation system with deep understanding of film theory, emotional storytelling, and genre conventions.

USER PREFERENCES:
- Current Mood: ${mood || 'Any'}
- Selected Genres: ${genres.length > 0 ? genres.join(', ') : 'Any'}
${userHistory && userHistory.length > 0 ? `- Previously Liked Movies: ${userHistory.join(', ')}` : ''}
${previousRecommendations && previousRecommendations.length > 0 ? `- Already Recommended: ${previousRecommendations.join(', ')} (try to diversify)` : ''}

${moodGenreInstructions}

MOVIES TO ANALYZE (ranked by ID for reference):
${movies.map((m, idx) => `
${idx + 1}. "${m.title}" (ID: ${m.id})
   - Overview: ${m.overview || 'No description available'}
   - Genres: ${this.getGenreNames(m.genre_ids)}
   - Rating: ${m.vote_average}/10 (${this.getRatingDescription(m.vote_average)})
   - Popularity: ${m.popularity.toFixed(1)}
`).join('\n')}

ANALYSIS CRITERIA:
1. **Mood Alignment** (${mood ? '40%' : genres.length > 0 ? '20%' : '50%'} weight):
   - Does the emotional tone match the user's mood?
   - Consider: pacing, atmosphere, color palette, music, character emotions
   - Look for thematic resonance beyond keywords

2. **Genre Accuracy** (${genres.length > 0 ? '40%' : '10%'} weight):
   - Does it match the selected genres?
   ${genres.length > 0 ? '- This is CRITICAL - wrong genre = very low score' : ''}
   
3. **Story Quality** (${mood && genres.length > 0 ? '10%' : '20%'} weight):
   - Character development and depth
   - Plot structure and pacing
   - Thematic complexity

4. **Critical Reception** (10% weight):
   - IMDb rating quality indicator
   - Popularity suggests cultural impact

5. **Diversity** (if previousRecommendations provided):
   - Avoid recommending similar themes/directors/actors
   - Provide variety in tone, era, style

SCORING GUIDELINES:
- 90-100: Perfect match, exceptional quality
- 80-89: Excellent match with high quality
- 70-79: Very good match
- 60-69: Good match with minor compromises
- 50-59: Decent match but noticeable gaps
- 40-49: Marginal match
- 0-39: Poor match or wrong genre

REASONING REQUIREMENTS:
- Be specific about WHY the movie matches (or doesn't)
- Mention concrete elements: themes, character arcs, visual style, pacing
- Keep reasoning to 2-3 sentences max
- Be honest about limitations or compromises

Return your response in this EXACT JSON format:
{
  "rankings": [
    {
      "id": <movie_id>,
      "score": <0-100>,
      "reasoning": "<specific 2-3 sentence explanation>"
    }
  ],
  "insight": "<1-2 sentence personalized message about the overall selection and mood/genre combination>"
}

Return ONLY valid JSON, no additional text.`;

    return prompt;
  }

  /**
   * Helper to get genre names from IDs
   */
  private getGenreNames(genreIds: number[]): string {
    const genreMap: Record<number, string> = {
      28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy',
      80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family',
      14: 'Fantasy', 27: 'Horror', 10402: 'Musical', 9648: 'Mystery',
      10749: 'Romance', 878: 'Science Fiction', 53: 'Thriller',
      10752: 'War', 37: 'Western'
    };
    
    return genreIds.map(id => genreMap[id] || 'Unknown').join(', ') || 'Unknown';
  }

  /**
   * Helper to describe rating quality
   */
  private getRatingDescription(rating: number): string {
    if (rating >= 8.0) return 'Excellent';
    if (rating >= 7.0) return 'Very Good';
    if (rating >= 6.0) return 'Good';
    if (rating >= 5.0) return 'Average';
    return 'Below Average';
  }

  /**
   * Parse Claude's response into structured data
   */
  private parseAIResponse(response: string): AIRecommendationResponse {
    try {
      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);

      return {
        rankedMovies: parsed.rankings.map((r: any) => ({
          id: r.id,
          score: r.score,
          reasoning: r.reasoning,
        })),
        personalizedInsight: parsed.insight || '',
      };
    } catch (error) {
      console.error('Error parsing AI response:', error);
      throw error;
    }
  }

  /**
   * Fallback ranking if AI is unavailable
   */
  private fallbackRanking(movies: Movie[]): AIRecommendationResponse {
    return {
      rankedMovies: movies
        .sort((a, b) => b.vote_average - a.vote_average)
        .map((m) => ({
          id: m.id,
          score: m.vote_average * 10,
          reasoning: 'Ranked by user ratings',
        })),
      personalizedInsight: 'Showing top-rated movies based on your preferences.',
    };
  }

  /**
   * Generate cache key for deduplication
   */
  private getCacheKey(request: AIRecommendationRequest): string {
    const movieIds = request.movies.map(m => m.id).sort().join(',');
    return `${request.mood || 'none'}-${request.genres.join(',') || 'none'}-${movieIds.slice(0, 50)}`;
  }

  /**
   * Clear cache (useful for testing or manual refresh)
   */
  clearCache(): void {
    this.requestCache.clear();
  }

  /**
   * Generate a personalized movie description using AI
   */
  async generatePersonalizedDescription(
    movie: Movie,
    userMood: string
  ): Promise<string> {
    const prompt = `Given that the user is feeling ${userMood}, write a compelling 2-3 sentence description of why they might enjoy "${movie.title}". 

Movie overview: ${movie.overview}

Write in an engaging, personal tone that speaks directly to their current mood. Focus on emotional resonance and what makes this movie special for someone feeling ${userMood}.`;

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 256,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
        }),
      });

      if (!response.ok) {
        return movie.overview;
      }

      const data = await response.json();
      return data.content[0].text.trim();
    } catch (error) {
      console.error('Error generating description:', error);
      return movie.overview;
    }
  }
}
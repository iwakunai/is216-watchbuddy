// AI-Powered Movie Recommendation Service
// This service uses Claude API to enhance movie recommendations

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
  userHistory?: string[]; // Optional: previous movies the user liked
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

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Use AI to analyze and rank movies based on user's mood and preferences
   */
  async getRankedRecommendations(
    request: AIRecommendationRequest
  ): Promise<AIRecommendationResponse> {
    const prompt = this.buildPrompt(request);

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
          max_tokens: 2048,
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

      return this.parseAIResponse(aiResponse);
    } catch (error) {
      console.error('Error getting AI recommendations:', error);
      // Fallback to basic scoring if AI fails
      return this.fallbackRanking(request.movies);
    }
  }

  /**
   * Build a detailed prompt for Claude to analyze movies
   */
  private buildPrompt(request: AIRecommendationRequest): string {
    const { mood, genres, movies, userHistory } = request;

    let prompt = `You are an expert movie recommendation system. Analyze the following movies and rank them based on how well they match the user's preferences.

USER PREFERENCES:
- Current Mood: ${mood}
- Selected Genres: ${genres.length > 0 ? genres.join(', ') : 'Any'}
${userHistory && userHistory.length > 0 ? `- Previously Liked Movies: ${userHistory.join(', ')}` : ''}

MOVIES TO ANALYZE:
${movies.map((m, idx) => `
${idx + 1}. "${m.title}" (ID: ${m.id})
   - Overview: ${m.overview || 'No description available'}
   - Rating: ${m.vote_average}/10
   - Popularity Score: ${m.popularity.toFixed(1)}
`).join('\n')}

TASK:
Analyze each movie and provide:
1. A relevance score (0-100) for how well it matches the user's ${mood} mood
2. A brief explanation (1-2 sentences) of why it's a good or poor match
3. An overall personalized insight about the recommendations

Consider:
- How well the movie's themes, tone, and story match the mood
- The quality indicators (rating, popularity)
- Genre alignment
- Emotional impact and pacing

Return your response in this EXACT JSON format:
{
  "rankings": [
    {
      "id": <movie_id>,
      "score": <0-100>,
      "reasoning": "<brief explanation>"
    }
  ],
  "insight": "<personalized message to the user about these recommendations>"
}

Return ONLY valid JSON, no additional text.`;

    return prompt;
  }

  /**
   * Parse Claude's response into structured data
   */
  private parseAIResponse(response: string): AIRecommendationResponse {
    try {
      // Extract JSON from response (in case there's extra text)
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
      rankedMovies: movies.map((m) => ({
        id: m.id,
        score: m.vote_average * 10,
        reasoning: 'Ranked by user ratings',
      })),
      personalizedInsight: 'Showing top-rated movies based on your preferences.',
    };
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

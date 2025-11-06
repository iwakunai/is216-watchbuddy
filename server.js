// server.js - Backend API proxy for Anthropic Claude
// Run this with: node server.js

import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
// Replace the cors() line with:
app.use(cors({
  origin: [
    'http://localhost:5173',  // Local development
    'https:/watchbuddy.win',  // Deployment
  ],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Environment variable for API key (server-side only)
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

if (!ANTHROPIC_API_KEY) {
  console.error('❌ ANTHROPIC_API_KEY not found in environment variables');
  process.exit(1);
}

console.log('✅ Anthropic API key loaded');

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// AI recommendation endpoint
app.post('/api/recommend', async (req, res) => {
  console.log('🎬 Received recommendation request');
  
  try {
    const { mood, genres, movies } = req.body;
    
    if (!movies || !Array.isArray(movies)) {
      return res.status(400).json({ error: 'Movies array is required' });
    }

    console.log(`📊 Processing ${movies.length} movies for mood: ${mood}, genres: ${genres?.join(', ')}`);
    
    // Build the prompt
    const prompt = buildPrompt({ mood, genres, movies });
    
    console.log('🚀 Calling Anthropic API...');
    const startTime = Date.now();
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        temperature: 0.7,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    const endTime = Date.now();
    console.log(`⏱️ API call took ${endTime - startTime}ms`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Anthropic API error:', response.status, errorText);
      return res.status(response.status).json({ 
        error: 'Anthropic API error', 
        details: errorText 
      });
    }

    const data = await response.json();
    const aiResponse = data.content[0].text;
    
    console.log('✅ Successfully got AI response');
    
    // Parse the response
    const parsed = parseAIResponse(aiResponse);
    
    res.json(parsed);
  } catch (error) {
    console.error('💥 Error:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message 
    });
  }
});

// Helper function to build prompt
function buildPrompt({ mood, genres, movies }) {
  const moodDescriptions = {
    happy: "uplifting, joyful, feel-good, optimistic, heartwarming, comedic",
    sad: "melancholic, emotional, tearjerker, contemplative, bittersweet, dramatic",
    excited: "thrilling, action-packed, intense, adrenaline-pumping, fast-paced, suspenseful",
    relaxed: "calm, peaceful, slow-paced, soothing, gentle, meditative",
    scared: "frightening, suspenseful, horror, tense, eerie, psychological thriller",
    romantic: "love story, passionate, tender, heartfelt, relationship-focused",
    curious: "thought-provoking, mysterious, intellectually engaging, puzzle-like, investigative",
    motivated: "inspirational, empowering, triumph-over-adversity, heroic, achievement-focused"
  };

  const genreMap = {
    28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
    80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family",
    14: "Fantasy", 27: "Horror", 10402: "Musical", 9648: "Mystery",
    10749: "Romance", 878: "Science Fiction", 53: "Thriller",
    10752: "War", 37: "Western"
  };

  const getGenreNames = (genreIds) => {
    return genreIds.map(id => genreMap[id] || "Unknown").join(", ") || "Unknown";
  };

  const extractYear = (dateString) => {
    if (!dateString) return "N/A";
    return dateString.split("-")[0];
  };

  const moodKeywords = mood ? moodDescriptions[mood] || mood : "";

  return `You are an expert movie recommendation AI. Analyze these ${movies.length} movies and rank them based on how well they match the user's preferences.

USER PREFERENCES:
${mood ? `- Mood: ${mood} (keywords: ${moodKeywords})` : "- No specific mood"}
${genres && genres.length > 0 ? `- Genres: ${genres.join(", ")}` : "- No specific genres"}

CRITICAL INSTRUCTIONS:
${mood && genres && genres.length > 0 ? `
1. BOTH mood AND genre must match for high scores
2. Movies matching genre but wrong mood: max 60/100
3. Movies matching mood but wrong genre: max 40/100
4. Movies matching BOTH: 70-100 based on quality
5. Movies matching NEITHER: 0-30
` : mood ? `
1. Focus ENTIRELY on mood/emotional tone
2. Genre is flexible
3. Score based on mood alignment: 0-100
` : genres && genres.length > 0 ? `
1. Focus on genre accuracy
2. Movies MUST be in selected genres for scores above 50
3. Score based on genre fit + quality: 0-100
` : `
1. Rank by overall quality and popularity
2. Provide diverse recommendations
`}

MOVIES TO RANK:
${movies.slice(0, 30).map((m, idx) => `
${idx + 1}. ID: ${m.id} | "${m.title}" (${extractYear(m.release_date)})
   Overview: ${m.overview?.substring(0, 200) || "No description"}...
   Genres: ${getGenreNames(m.genre_ids)}
   Rating: ${m.vote_average.toFixed(1)}/10
   Popularity: ${m.popularity.toFixed(0)}
`).join("\n")}

SCORING CRITERIA:
- 90-100: Perfect match (${mood ? `strongly ${mood}` : "high quality"}, ${genres && genres.length > 0 ? `${genres.join("/")}` : "popular"})
- 80-89: Excellent match
- 70-79: Very good match
- 60-69: Good match with minor gaps
- 50-59: Decent but compromises
- 0-49: Poor match or wrong type

RESPONSE FORMAT (valid JSON only):
{
  "rankings": [
    {"id": <number>, "score": <0-100>, "reasoning": "<why this score in 15 words>"},
    ...
  ],
  "insight": "<personalized 1-sentence message about these picks>"
}

Rank ALL ${Math.min(movies.length, 30)} movies. Return ONLY valid JSON.`;
}

// Helper function to parse AI response
function parseAIResponse(response) {
  try {
    let jsonStr = response;
    jsonStr = jsonStr.replace(/```json\n?/g, "").replace(/```\n?/g, "");
    
    const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in response");
    }

    const parsed = JSON.parse(jsonMatch[0]);

    if (!parsed.rankings || !Array.isArray(parsed.rankings)) {
      throw new Error("Invalid response format");
    }

    return {
      rankedMovies: parsed.rankings.map(r => ({
        id: Number(r.id),
        score: Number(r.score),
        reasoning: String(r.reasoning || ""),
      })),
      personalizedInsight: String(parsed.insight || "Here are your recommendations!"),
    };
  } catch (error) {
    console.error("Failed to parse AI response:", error);
    throw error;
  }
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on  port ${PORT}`);
  console.log(`📍 Endpoints:
  - GET  /health
  - POST /api/recommend
  `);
});
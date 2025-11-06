# 🎬 WatchBuddy - AI-Powered Movie Recommendations

WatchBuddy is an intelligent movie discovery platform that uses AI to provide personalized movie recommendations based on your mood and preferences.

App Link : https://watchbuddy.win

Do create an account and login or some features (recommender, watchparty, reviews) will be unavailable!

Account features (login, signup) might also be unavailable on more restricted networks.

## ✨ Features

- 🤖 **AI-Powered Recommendations** - Claude AI analyzes and ranks movies based on your mood and genre preferences
- 🎭 **Mood-Based Discovery** - Select from 8 different moods (Happy, Sad, Excited, Relaxed, Scared, Romantic, Curious, Motivated)
- 🎪 **Genre Filtering** - Choose from 17 different genres to refine your results
- 🎲 **Random Movie Shuffle** - Can't decide? Let us pick a random movie for you
- 🔍 **Movie Details** - View comprehensive information including cast, crew, trailers, and ratings
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices

---

## 🚀 Quick Start

### Prerequisites

Before you begin, make sure you have:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **TMDB API Key** - [Get free key here](https://www.themoviedb.org/settings/api)
- **Anthropic API Key** - [Get key here](https://console.anthropic.com/)
- **Clerk API Key** - [Get key here](https://clerk.com/)
- **Supabase API Keys** - Database set up required

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/iwakunai/is216-watchbuddy.git
   ```

## Frontend

1. **Install dependencies**

   ```bash
   cd frontend
   npm install
   ```

2. **Set up environment variables**
   Create a `.env.development` file in the project root:

   ```env
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   VITE_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
   VITE_TMDB_API_KEY=your-tmdb-api-key
   VITE_BACKEND_URL=your-backend-url
   ```

3. **Go back to root**

   ```bash
   cd ../
   ```

4. **Start the frontend**

   Open another terminal window:

   ```bash
   npm run dev
   ```

   You should see:

   ```
   VITE ready at http://localhost:5173
   ```

## Backend

1. **Install dependencies**

   ```bash
   cd backend
   npm install
   ```

2. **Set up environment variables**
   Create a `.env` file in the project root:

   ```env
   ANTHROPIC_API_KEY=sk-ant-api03-your-anthropic-key-here
   ```

3. **Start the backend server**
   Open a new terminal window:

   ```bash
   npm start
   ```

   You should see:

   ```
   ✅ Anthropic API key loaded
   🚀 Server running on http://localhost:3001
   ```

4. **Open the app**

   Visit `http://localhost:5173` in your browser

---

## 📁 Project Structure

```
.
├── backend
│   ├── package-lock.json
│   ├── package.json
│   └── server.js
├── frontend
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── src
│   │   ├── App.vue
│   │   ├── assets
│   │   │   ├── images
│   │   │   │   └── partyroombg.jpg
│   │   │   └── vue.svg
│   │   ├── components
│   │   │   ├── NavBar
│   │   │   ├── profile
│   │   │   ├── Reviews
│   │   │   └── WatchParty
│   │   ├── composables
│   │   ├── lib
│   │   ├── main.ts
│   │   ├── pages
│   │   │   ├── HomePage.vue
│   │   │   ├── MovieDetailPage.vue
│   │   │   ├── MoviePage.vue
│   │   │   ├── PartyRoom.vue
│   │   │   ├── PersonDetails.vue
│   │   │   ├── ProfilePage.vue
│   │   │   ├── RecommendPage.vue
│   │   │   ├── TvDetailPage.vue
│   │   │   ├── TvPage.vue
│   │   │   └── WatchPartyPage.vue
│   │   ├── route
│   │   ├── services
│   │   │   └── ai-recommender-service.ts
│   │   ├── style.css
│   │   └── types
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
├── public
└── README.md

```

---

## 🛠️ Configuration

### Backend (server.js)

The backend server runs on port **3001** by default. To change:

```javascript
const PORT = 3001; // Change to your preferred port
```

### Frontend (RecommendPage.vue)

The frontend connects to the backend. If you changed the backend port, update:

```typescript
const aiService = new AIRecommenderService("http://localhost:3001");
// Change 3001 to match your backend port
```

---

## 💡 Usage

### Getting Recommendations

1. **Select a Mood** - Click on any mood button (Happy, Sad, Excited, etc.)
2. **Choose Genres (Optional)** - Expand the Genres section and select specific genres
3. **View Results** - AI will rank movies based on your preferences
4. **Load More** - Click "Load More" to see additional recommendations

### Understanding AI Scores

- Movies display a **🤖 score** (0-100%) showing how well they match your mood/genres
- Higher scores = better match for your preferences
- Each movie includes AI reasoning explaining why it was recommended

### Random Movie Shuffle

- Click the **"Shuffle!"** button for a random movie recommendation
- Great for when you can't decide what to watch

---

## 🐛 Troubleshooting

### Backend won't start

**Error:** `❌ ANTHROPIC_API_KEY not found`

**Solution:**

- Make sure `.env` file exists in project root
- Check that it contains: `ANTHROPIC_API_KEY=sk-ant-api03-...`
- Restart the backend server

### Frontend can't connect to backend

**Error:** `ERR_CONNECTION_REFUSED` in browser console

**Solution:**

- Make sure backend is running: `node server.js`
- Check backend is on port 3001
- Verify no other app is using port 3001

### CORS errors

**Error:** `Access-Control-Allow-Origin` error

**Solution:**

- Make sure you're using `ai-recommender-service.ts` \
- Verify backend server is running
- Check that frontend is calling `localhost:3001`, not the Anthropic API directly

### AI recommendations not working

**Error:** `401 Unauthorized` or `authentication_error`

**Solution:**

- Get a fresh API key from Anthropic Console
- Update `.env` file with new key
- Restart backend server
- Make sure billing is set up on your Anthropic account

### No movies showing up

**Error:** Movies not loading

**Solution:**

- Check TMDB API key in `.env.development`
- Open browser console and look for errors
- Verify you're logged in with Clerk

---

## 💰 Cost Information

### AI Recommendations

- **Claude Sonnet 4**: ~$0.03 per recommendation request
- Each mood/genre change triggers a new AI call
- Budget accordingly based on expected usage

### Cost Optimization Tips

1. **Cache Results** - The app caches results for 1 hour automatically
2. **Limit Requests** - Be mindful of changing moods/genres frequently
3. **Use Fallback** - Toggle AI off for basic sorting (no cost)

---

## 📞 Support

Having issues? Here's how to get help:

1. **Check the Troubleshooting section** above
2. **Check browser console** for error messages
3. **Check backend terminal** for server errors
4. **Verify API keys** are correct and active
5. **Set up Supabase** correctly
   
Common fixes:

- ✅ Both frontend and backend running?
- ✅ API keys valid and in correct files?
- ✅ Dependencies installed for both frontend and backend (`npm install`)?
- ✅ Using correct ports (3001 for backend, 5173 for frontend)?

---

## 📜 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- **TMDB** - Movie data and images
- **Anthropic** - Claude AI for intelligent recommendations
- **Clerk** - User authentication
- **Vue.js** - Frontend framework
- **Express** - Backend server
- **Railway** - Deployment

---

## 🎯 Quick Command Reference

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd backend
npm install

# Start backend (Terminal 1)
cd backend
npm start

# Start frontend (Terminal 2)
cd frontend
npm run dev
```

---

**Made with ❤️ by the WatchBuddy team**

Enjoy discovering your next favorite movie! 🍿🎬

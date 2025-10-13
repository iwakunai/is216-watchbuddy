# WatchBuddy - Movie & TV Discovery Platform

A gamified, mood-based movie and TV discovery web application that helps users overcome decision fatigue in content streaming.

## Features

- **Mood-Based Recommendations**: Get personalized movie suggestions based on your current emotional state
- **Interactive UI**: Clean, modern interface with smooth animations and transitions
- **Movie Database**: Browse trending movies and TV shows
- **Watch Parties**: Join virtual watch parties with friends
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## Tech Stack

- **Frontend**: Vue.js 3, TypeScript
- **Build Tool**: Vite
- **Styling**: CSS3 with modern features
- **Deployment**: Supabase (planned)

## Prerequisites

1. **Node.js** (version 16 or higher)
   - Download from: https://nodejs.org/
   - Choose the "LTS" version
   - To check if installed: Open terminal/command prompt and type `node --version`

<!-- 2. **Git** 
   - Download from: https://git-scm.com/downloads
   - To check if installed: Type `git --version` in terminal -->


## Getting Started (First Time Setup)


### Step 1: Install Dependencies

```bash
# This installs all the required packages (might take 1-2 minutes)
npm install
```

### Step 2: Set up Environment Variables

```ini
# .env.local
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Step 3: Run Development Server
```
npm run dev
```
The app should open at: http://localhost:5173


## Project Structure

## Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).

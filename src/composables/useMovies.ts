// TODO: Debug and refactor
// TODO: Fix styles
// @ts-nocheck remove when typed

import { ref } from 'vue';
import localMovies from '@/assets/movies.json';

export function useMovies(options = {}) {
  const movies = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const useLocal = typeof options.useLocal === 'boolean'
    ? options.useLocal
    : (import.meta.env.VITE_USE_LOCAL_MOVIES === 'true') || true;
  const apiUrl = options.apiUrl || import.meta.env.VITE_MOVIES_API || '';

  // Build a filename -> url map for local posters
  // Path: file lives in src/composables so ../assets/posters points to src/assets/posters
  const posterFiles = import.meta.glob('../assets/posters/*.{jpg,png,jpeg}', { eager: true, import: 'default' });
  const posterMap = {};
  for (const p in posterFiles) {
    const fname = p.split('/').pop();
    posterMap[fname] = posterFiles[p];
  }

  function resolveLocalPoster(p) {
    if (!p) return '';
    const name = String(p).split('/').pop();
    return posterMap[name] ?? p;
  }

  async function load() {
    loading.value = true;
    error.value = null;

    try {
      if (useLocal) {
        // local JSON (synchronous) but keep async shape
        movies.value = (localMovies || []).map(m => ({
          ...m,
          poster: resolveLocalPoster(m.poster)
        }));
        return;
      }

      // API mode
      if (!apiUrl) throw new Error('No apiUrl provided for API mode.');

      const resp = await fetch(apiUrl, { method: 'GET' });

      // always read text first so we can inspect / show useful error previews
      const text = await resp.text();
      const contentType = (resp.headers.get('content-type') || '').toLowerCase();

      if (!resp.ok) {
        throw new Error(`Server returned ${resp.status} ${resp.statusText}. Preview: ${text.slice(0, 400)}`);
      }

      // If content-type isn't JSON, try to parse anyway but give a helpful error if it fails
      if (!contentType.includes('application/json')) {
        try {
          const data = JSON.parse(text);
          movies.value = (data || []).map(m => ({
            ...m,
            poster: (m.poster && !/^https?:\/\//i.test(String(m.poster))) ? resolveLocalPoster(m.poster) : m.poster
          }));
          return;
        } catch (e) {
          throw new Error(
            `Expected JSON but server returned content-type="${contentType || 'unknown'}". Preview: ${text.slice(0, 400)}`
          );
        }
      }

      // Proper JSON content-type: parse and map posters
      try {
        const data = JSON.parse(text);
        movies.value = (data || []).map(m => ({
          ...m,
          poster: (m.poster && !/^https?:\/\//i.test(String(m.poster))) ? resolveLocalPoster(m.poster) : m.poster
        }));
      } catch (e) {
        throw new Error(`Failed to parse JSON response. Preview: ${text.slice(0, 400)}`);
      }
    } catch (e) {
      console.error('useMovies load error:', e);
      error.value = e?.message || String(e);
      movies.value = [];
    } finally {
      loading.value = false;
    }
  }

  // initial load
  load();

  return { movies, loading, error, reload: load };
}



//!What this file does :
//This is a reusable data loader (a composable). 
// Think of it as a small helper that: 
// 1. Loads movie data (either from the local movies.json during dev or from a remote API when you want).
//2. Resolves poster image paths so the browser can actually load them.
//3. Tracks state: movies, loading, and error.
//4. Exposes a reload() function so the page can re-fetch if needed.

//!What was added:
//Created the file src/composables/useMovies.js (you didn’t have this before).
//Imported the local movies.json as fallback data.
//Used import.meta.glob('../assets/posters/*.{jpg,png,jpeg}', { eager: true, import: 'default' }) to build a map of filenames → Vite-processed URLs. This is what fixes the “image 404” problem when images live in src/assets/posters.
//Wrote resolveLocalPoster() to convert a poster value (filename or /assets/posters/name.jpg) into the actual URL Vite can serve.
//Implemented load() which:
//If useLocal is true (the default), maps local JSON through resolveLocalPoster and fills movies.
//If useLocal is false, fetch(apiUrl) from the backend, then:
//Reads the response text first and checks content-type.
//Parses JSON only if appropriate, or returns a helpful error preview if the server returned HTML (this prevents Unexpected token '<' errors and tells you what the server actually returned).
//Exposed { movies, loading, error, reload } for your page to use.
import { router } from "@/route/routes";

const TMDB_BASE = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/";

export function tmdbImage(path: string, size = 500) {
  const chosen = [92, 154, 185, 342, 500, 780].includes(size) ? size : 500;
  return `${TMDB_IMAGE_BASE}w${chosen}${path}`;
}

export function navigateToMovie(id: number) {
  router.push(`/movie/${id}`)
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export function navigateToShow(id: number) {
  router.push(`/tv/${id}`)
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export function navigateToPerson(id: number) {
  router.push(`/person/${id}`);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

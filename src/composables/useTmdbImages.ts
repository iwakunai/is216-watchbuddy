export function useTmdbImages(base = 'https://image.tmdb.org/t/p') {
  const poster = (path?: string, size: 'w185'|'w342'|'w500'|'original' = 'w342') =>
    path ? `${base}/${size}${path}` : null
  return { poster }
}

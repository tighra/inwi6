const API_KEY = '899cff2a35e47874aacf49ebe2ba5ab5'
const BASE_URL = 'https://api.themoviedb.org/3'
const IMG_BASE = 'https://image.tmdb.org/t/p'

export const getImageUrl = (path, size = 'w500') => {
  if (!path) return null
  return `${IMG_BASE}/${size}${path}`
}

export const getBackdropUrl = (path) => getImageUrl(path, 'w1280')

async function fetchTMDB(endpoint, params = {}) {
  const url = new URL(`${BASE_URL}${endpoint}`)
  url.searchParams.set('api_key', API_KEY)
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null) url.searchParams.set(key, val)
  })
  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`TMDB Error: ${res.status}`)
  return res.json()
}

export async function getTrending(mediaType = 'all', timeWindow = 'day') {
  return fetchTMDB(`/trending/${mediaType}/${timeWindow}`)
}

export async function getPopularMovies(page = 1) {
  return fetchTMDB('/movie/popular', { page })
}

export async function getTopRatedMovies(page = 1) {
  return fetchTMDB('/movie/top_rated', { page })
}

export async function getNowPlayingMovies(page = 1) {
  return fetchTMDB('/movie/now_playing', { page })
}

export async function getUpcomingMovies(page = 1) {
  return fetchTMDB('/movie/upcoming', { page })
}

export async function getPopularShows(page = 1) {
  return fetchTMDB('/tv/popular', { page })
}

export async function getTopRatedShows(page = 1) {
  return fetchTMDB('/tv/top_rated', { page })
}

export async function getOnTheAirShows(page = 1) {
  return fetchTMDB('/tv/on_the_air', { page })
}

export async function getMovieDetails(id) {
  return fetchTMDB(`/movie/${id}`, { append_to_response: 'videos,credits,similar' })
}

export async function getTvDetails(id) {
  return fetchTMDB(`/tv/${id}`, { append_to_response: 'videos,credits,similar' })
}

export async function searchMulti(query, page = 1) {
  return fetchTMDB('/search/multi', { query, page })
}

export async function getMovieGenres() {
  return fetchTMDB('/genre/movie/list')
}

export async function getTvGenres() {
  return fetchTMDB('/genre/tv/list')
}

export async function discoverMovies(params = {}) {
  return fetchTMDB('/discover/movie', params)
}

export async function discoverTv(params = {}) {
  return fetchTMDB('/discover/tv', params)
}

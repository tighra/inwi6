import { useFetch } from '../hooks/useFetch'
import {
  getTrending, getPopularMovies, getTopRatedMovies,
  getPopularShows, getNowPlayingMovies
} from '../services/tmdb'
import HeroBanner from '../components/HeroBanner'
import MediaRow from '../components/MediaRow'

export default function HomePage() {
  const { data: trending, loading: trendingLoading } = useFetch(
    () => getTrending('all', 'day'), []
  )
  const { data: popularMovies, loading: moviesLoading } = useFetch(
    () => getPopularMovies(), []
  )
  const { data: topRated, loading: topRatedLoading } = useFetch(
    () => getTopRatedMovies(), []
  )
  const { data: popularShows, loading: showsLoading } = useFetch(
    () => getPopularShows(), []
  )
  const { data: nowPlaying, loading: nowPlayingLoading } = useFetch(
    () => getNowPlayingMovies(), []
  )

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <HeroBanner items={trending?.results} />

      <div className="max-w-7xl mx-auto -mt-10 relative z-10 space-y-2">
        <MediaRow
          title="🔥 Trending Today"
          items={trending?.results}
          loading={trendingLoading}
        />
        <MediaRow
          title="🎬 Now Playing"
          items={nowPlaying?.results}
          type="movie"
          loading={nowPlayingLoading}
        />
        <MediaRow
          title="⭐ Top Rated Movies"
          items={topRated?.results}
          type="movie"
          loading={topRatedLoading}
        />
        <MediaRow
          title="🍿 Popular Movies"
          items={popularMovies?.results}
          type="movie"
          loading={moviesLoading}
        />
        <MediaRow
          title="📺 Popular TV Shows"
          items={popularShows?.results}
          type="tv"
          loading={showsLoading}
        />
      </div>
    </div>
  )
}

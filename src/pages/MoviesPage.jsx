import { useState } from 'react'
import { useFetch } from '../hooks/useFetch'
import { getPopularMovies, getTopRatedMovies, getNowPlayingMovies, getUpcomingMovies } from '../services/tmdb'
import MediaGrid from '../components/MediaGrid'

const tabs = [
  { id: 'popular', label: 'Popular', fetch: getPopularMovies },
  { id: 'top_rated', label: 'Top Rated', fetch: getTopRatedMovies },
  { id: 'now_playing', label: 'Now Playing', fetch: getNowPlayingMovies },
  { id: 'upcoming', label: 'Upcoming', fetch: getUpcomingMovies },
]

export default function MoviesPage() {
  const [activeTab, setActiveTab] = useState('popular')
  const [page, setPage] = useState(1)

  const activeFetch = tabs.find(t => t.id === activeTab).fetch
  const { data, loading } = useFetch(() => activeFetch(page), [activeTab, page])

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    setPage(1)
  }

  return (
    <div className="min-h-screen pt-20 pb-24 md:pb-8 px-4 sm:px-6 max-w-7xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6">Movies</h1>

      <div className="flex gap-2 mb-6 overflow-x-auto hide-scrollbar pb-2">
        {tabs.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => handleTabChange(id)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === id
                ? 'bg-accent text-white'
                : 'bg-dark-700 text-gray-400 hover:text-white hover:bg-dark-600'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <MediaGrid items={data?.results} type="movie" loading={loading} />

      {data && data.total_pages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-dark-700 rounded-lg text-sm font-medium disabled:opacity-40 hover:bg-dark-600 transition-all"
          >
            Previous
          </button>
          <span className="text-sm text-gray-400">
            Page {page} of {Math.min(data.total_pages, 500)}
          </span>
          <button
            onClick={() => setPage(p => Math.min(data.total_pages, p + 1))}
            disabled={page >= Math.min(data.total_pages, 500)}
            className="px-4 py-2 bg-dark-700 rounded-lg text-sm font-medium disabled:opacity-40 hover:bg-dark-600 transition-all"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

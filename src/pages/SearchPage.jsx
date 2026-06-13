import { useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import { useFetch } from '../hooks/useFetch'
import { searchMulti } from '../services/tmdb'
import MediaGrid from '../components/MediaGrid'

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''

  const { data, loading } = useFetch(
    () => query ? searchMulti(query) : Promise.resolve({ results: [] }),
    [query]
  )

  const results = data?.results?.filter(
    item => item.media_type === 'movie' || item.media_type === 'tv'
  ) || []

  return (
    <div className="min-h-screen pt-20 pb-24 md:pb-8 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Search size={24} className="text-accent" />
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          {query ? `Results for "${query}"` : 'Search'}
        </h1>
      </div>

      {!query ? (
        <div className="text-center py-20">
          <Search size={48} className="text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Search for movies and TV shows</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-400 mb-6">
            {results.length} result{results.length !== 1 ? 's' : ''} found
          </p>
          <MediaGrid items={results} loading={loading} />
        </>
      )}
    </div>
  )
}

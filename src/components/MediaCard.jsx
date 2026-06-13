import { Link } from 'react-router-dom'
import { Star, Play } from 'lucide-react'
import { getImageUrl } from '../services/tmdb'

export default function MediaCard({ item, type }) {
  const mediaType = type || item.media_type || (item.title ? 'movie' : 'tv')
  const title = item.title || item.name
  const year = (item.release_date || item.first_air_date || '').split('-')[0]
  const poster = getImageUrl(item.poster_path)
  const rating = item.vote_average ? item.vote_average.toFixed(1) : null

  return (
    <Link
      to={`/${mediaType}/${item.id}`}
      className="group relative block card-hover rounded-xl overflow-hidden bg-dark-800"
    >
      <div className="aspect-[2/3] relative">
        {poster ? (
          <img
            src={poster}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-dark-700 flex items-center justify-center">
            <Play size={32} className="text-gray-600" />
          </div>
        )}

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
          <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300">
            <Play size={20} className="text-white ml-0.5" fill="white" />
          </div>
        </div>

        {rating && (
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded-md">
            <Star size={10} className="text-yellow-400" fill="currentColor" />
            <span className="text-xs font-medium text-white">{rating}</span>
          </div>
        )}
      </div>

      <div className="p-3">
        <h3 className="text-sm font-medium text-white truncate group-hover:text-accent transition-colors">
          {title}
        </h3>
        {year && <p className="text-xs text-gray-500 mt-1">{year}</p>}
      </div>
    </Link>
  )
}

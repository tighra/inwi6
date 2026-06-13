import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Play, Info, Star } from 'lucide-react'
import { getBackdropUrl } from '../services/tmdb'

export default function HeroBanner({ items }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (!items || items.length === 0) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.min(items.length, 5))
    }, 6000)
    return () => clearInterval(timer)
  }, [items])

  if (!items || items.length === 0) {
    return (
      <div className="w-full h-[60vh] sm:h-[70vh] shimmer" />
    )
  }

  const item = items[currentIndex]
  const mediaType = item.media_type || (item.title ? 'movie' : 'tv')
  const title = item.title || item.name
  const backdrop = getBackdropUrl(item.backdrop_path)

  return (
    <div className="relative w-full h-[60vh] sm:h-[70vh] overflow-hidden">
      {backdrop && (
        <img
          src={backdrop}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
          key={currentIndex}
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-r from-dark-900 via-dark-900/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-dark-900/30" />

      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-12 lg:p-16 slide-up">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-3">
            {item.vote_average > 0 && (
              <div className="flex items-center gap-1 bg-yellow-500/20 px-2 py-1 rounded-md">
                <Star size={12} className="text-yellow-400" fill="currentColor" />
                <span className="text-xs font-semibold text-yellow-400">
                  {item.vote_average.toFixed(1)}
                </span>
              </div>
            )}
            <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">
              {mediaType === 'movie' ? 'Movie' : 'TV Show'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 leading-tight">
            {title}
          </h1>

          <p className="text-sm sm:text-base text-gray-300 line-clamp-2 sm:line-clamp-3 mb-6 leading-relaxed">
            {item.overview}
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              to={`/${mediaType}/${item.id}`}
              className="flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-hover rounded-lg font-semibold text-sm transition-all transform hover:scale-105"
            >
              <Play size={18} fill="white" />
              Watch Now
            </Link>
            <Link
              to={`/${mediaType}/${item.id}`}
              className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg font-semibold text-sm transition-all"
            >
              <Info size={18} />
              More Info
            </Link>
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          {items.slice(0, 5).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-1 rounded-full transition-all ${
                i === currentIndex ? 'w-8 bg-accent' : 'w-4 bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

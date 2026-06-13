import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import MediaCard from './MediaCard'

export default function MediaRow({ title, items, type, loading }) {
  const scrollRef = useRef(null)

  const scroll = (direction) => {
    if (scrollRef.current) {
      const amount = direction === 'left' ? -400 : 400
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' })
    }
  }

  if (loading) {
    return (
      <div className="mb-8">
        <div className="h-6 w-48 shimmer rounded mb-4" />
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="min-w-[160px] aspect-[2/3] shimmer rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  if (!items || items.length === 0) return null

  return (
    <div className="mb-8 fade-in">
      <div className="flex items-center justify-between mb-4 px-4 sm:px-0">
        <h2 className="text-lg sm:text-xl font-bold text-white">{title}</h2>
        <div className="hidden sm:flex gap-2">
          <button
            onClick={() => scroll('left')}
            className="p-2 rounded-full bg-dark-700 hover:bg-dark-600 text-gray-400 hover:text-white transition-all"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 rounded-full bg-dark-700 hover:bg-dark-600 text-gray-400 hover:text-white transition-all"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-3 sm:gap-4 overflow-x-auto hide-scrollbar px-4 sm:px-0 pb-2"
      >
        {items.map((item) => (
          <div key={item.id} className="min-w-[140px] sm:min-w-[160px] max-w-[160px]">
            <MediaCard item={item} type={type} />
          </div>
        ))}
      </div>
    </div>
  )
}

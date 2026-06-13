import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Star, Clock, Calendar, Play, Users } from 'lucide-react'
import { useFetch } from '../hooks/useFetch'
import { getMovieDetails, getTvDetails, getBackdropUrl, getImageUrl } from '../services/tmdb'
import { getMovieStreamUrl, getTvStreamUrl } from '../services/streams'
import VideoPlayer from '../components/VideoPlayer'
import MediaRow from '../components/MediaRow'

export default function DetailPage() {
  const { type, id } = useParams()
  const [showPlayer, setShowPlayer] = useState(false)
  const [selectedSeason, setSelectedSeason] = useState(1)
  const [selectedEpisode, setSelectedEpisode] = useState(1)

  const fetchDetails = type === 'movie' ? getMovieDetails : getTvDetails
  const { data: details, loading } = useFetch(() => fetchDetails(id), [type, id])

  if (loading) {
    return (
      <div className="min-h-screen pt-16">
        <div className="w-full h-[50vh] shimmer" />
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-4">
          <div className="h-8 w-64 shimmer rounded" />
          <div className="h-4 w-full shimmer rounded" />
          <div className="h-4 w-3/4 shimmer rounded" />
        </div>
      </div>
    )
  }

  if (!details) return null

  const title = details.title || details.name
  const year = (details.release_date || details.first_air_date || '').split('-')[0]
  const runtime = details.runtime || (details.episode_run_time && details.episode_run_time[0])
  const backdrop = getBackdropUrl(details.backdrop_path)
  const poster = getImageUrl(details.poster_path)
  const genres = details.genres || []
  const cast = details.credits?.cast?.slice(0, 10) || []
  const similar = details.similar?.results || []
  const trailer = details.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube')

  const streamUrl = type === 'movie'
    ? getMovieStreamUrl(id)
    : getTvStreamUrl(id, selectedSeason, selectedEpisode)

  const seasons = details.seasons?.filter(s => s.season_number > 0) || []

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      <div className="relative w-full h-[50vh] sm:h-[60vh]">
        {backdrop && (
          <img src={backdrop} alt={title} className="absolute inset-0 w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-900/80 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-48 relative z-10">
        <div className="flex flex-col sm:flex-row gap-6">
          {poster && (
            <img
              src={poster}
              alt={title}
              className="hidden sm:block w-48 h-72 object-cover rounded-xl shadow-2xl"
            />
          )}
          <div className="flex-1 slide-up">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">{title}</h1>

            <div className="flex flex-wrap items-center gap-3 mb-4 text-sm text-gray-400">
              {details.vote_average > 0 && (
                <span className="flex items-center gap-1">
                  <Star size={14} className="text-yellow-400" fill="currentColor" />
                  {details.vote_average.toFixed(1)}
                </span>
              )}
              {year && (
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  {year}
                </span>
              )}
              {runtime && (
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {runtime} min
                </span>
              )}
              {details.number_of_seasons && (
                <span className="flex items-center gap-1">
                  <Users size={14} />
                  {details.number_of_seasons} Season{details.number_of_seasons > 1 ? 's' : ''}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {genres.map(g => (
                <span key={g.id} className="px-3 py-1 bg-dark-700 rounded-full text-xs text-gray-300">
                  {g.name}
                </span>
              ))}
            </div>

            <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6 max-w-2xl">
              {details.overview}
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowPlayer(true)}
                className="flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-hover rounded-lg font-semibold text-sm transition-all transform hover:scale-105"
              >
                <Play size={18} fill="white" />
                Watch Now
              </button>
              {trailer && (
                <a
                  href={`https://www.youtube.com/watch?v=${trailer.key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg font-semibold text-sm transition-all"
                >
                  <Play size={18} />
                  Trailer
                </a>
              )}
            </div>
          </div>
        </div>

        {showPlayer && (
          <div className="mt-8 fade-in">
            {type === 'tv' && seasons.length > 0 && (
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-400">Season:</label>
                  <select
                    value={selectedSeason}
                    onChange={(e) => { setSelectedSeason(Number(e.target.value)); setSelectedEpisode(1) }}
                    className="bg-dark-700 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-accent/50"
                  >
                    {seasons.map(s => (
                      <option key={s.season_number} value={s.season_number}>
                        Season {s.season_number}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-400">Episode:</label>
                  <select
                    value={selectedEpisode}
                    onChange={(e) => setSelectedEpisode(Number(e.target.value))}
                    className="bg-dark-700 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-accent/50"
                  >
                    {Array.from(
                      { length: seasons.find(s => s.season_number === selectedSeason)?.episode_count || 10 },
                      (_, i) => (
                        <option key={i + 1} value={i + 1}>Episode {i + 1}</option>
                      )
                    )}
                  </select>
                </div>
              </div>
            )}
            <VideoPlayer src={streamUrl} poster={backdrop} title={title} type="embed" />
          </div>
        )}

        {cast.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-bold text-white mb-4">Cast</h2>
            <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
              {cast.map((person) => (
                <div key={person.id} className="min-w-[100px] text-center">
                  <div className="w-20 h-20 mx-auto rounded-full overflow-hidden bg-dark-700 mb-2">
                    {person.profile_path ? (
                      <img
                        src={getImageUrl(person.profile_path, 'w185')}
                        alt={person.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600">
                        <Users size={24} />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-white font-medium truncate">{person.name}</p>
                  <p className="text-xs text-gray-500 truncate">{person.character}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {similar.length > 0 && (
          <div className="mt-10">
            <MediaRow title="Similar" items={similar} type={type} />
          </div>
        )}
      </div>
    </div>
  )
}

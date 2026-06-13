import { useState } from 'react'
import { Radio, Play, Signal } from 'lucide-react'
import { liveChannels, channelCategories } from '../services/streams'
import VideoPlayer from '../components/VideoPlayer'

export default function LivePage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedChannel, setSelectedChannel] = useState(null)

  const filteredChannels = activeCategory === 'All'
    ? liveChannels
    : liveChannels.filter(ch => ch.category === activeCategory)

  return (
    <div className="min-h-screen pt-20 pb-24 md:pb-8 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Radio size={24} className="text-accent" />
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Live TV</h1>
        <span className="flex items-center gap-1 px-2 py-1 bg-red-500/20 rounded-full">
          <Signal size={12} className="text-red-400 animate-pulse" />
          <span className="text-xs text-red-400 font-medium">LIVE</span>
        </span>
      </div>

      {selectedChannel && (
        <div className="mb-8 fade-in">
          <div className="bg-dark-800 rounded-xl overflow-hidden">
            <VideoPlayer
              src={selectedChannel.streamUrl}
              title={selectedChannel.name}
              type={selectedChannel.streamUrl.includes('.m3u8') ? 'hls' : 'embed'}
            />
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-dark-700 rounded-lg flex items-center justify-center overflow-hidden">
                  {selectedChannel.logo ? (
                    <img src={selectedChannel.logo} alt="" className="w-8 h-8 object-contain" />
                  ) : (
                    <Radio size={18} className="text-gray-400" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-white">{selectedChannel.name}</h3>
                  <p className="text-xs text-gray-400">{selectedChannel.category}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedChannel(null)}
                className="px-3 py-1 text-sm bg-dark-700 hover:bg-dark-600 rounded-lg text-gray-400 hover:text-white transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-2 mb-6 overflow-x-auto hide-scrollbar pb-2">
        {channelCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeCategory === cat
                ? 'bg-accent text-white'
                : 'bg-dark-700 text-gray-400 hover:text-white hover:bg-dark-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 fade-in">
        {filteredChannels.map((channel) => (
          <button
            key={channel.id}
            onClick={() => channel.streamUrl && setSelectedChannel(channel)}
            disabled={!channel.streamUrl}
            className={`group relative bg-dark-800 rounded-xl p-4 text-left transition-all hover:bg-dark-700 ${
              !channel.streamUrl ? 'opacity-50 cursor-not-allowed' : 'card-hover cursor-pointer'
            } ${selectedChannel?.id === channel.id ? 'ring-2 ring-accent' : ''}`}
          >
            <div className="w-full aspect-square flex items-center justify-center mb-3 bg-dark-700 rounded-lg overflow-hidden">
              {channel.logo ? (
                <img src={channel.logo} alt={channel.name} className="w-2/3 h-2/3 object-contain" />
              ) : (
                <Radio size={32} className="text-gray-600" />
              )}
            </div>
            <h3 className="text-sm font-medium text-white truncate">{channel.name}</h3>
            <p className="text-xs text-gray-500 mt-1">{channel.category}</p>

            {channel.streamUrl && (
              <div className="absolute top-3 right-3 w-6 h-6 bg-accent/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Play size={12} fill="white" className="ml-0.5" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

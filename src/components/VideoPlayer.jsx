import { useRef, useEffect, useState } from 'react'
import Hls from 'hls.js'
import {
  Play, Pause, Volume2, VolumeX, Maximize, Minimize,
  SkipBack, SkipForward, Settings, Loader
} from 'lucide-react'

export default function VideoPlayer({ src, poster, title, type = 'embed' }) {
  const videoRef = useRef(null)
  const containerRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showControls, setShowControls] = useState(true)
  const [ready, setReady] = useState(false)
  const controlsTimer = useRef(null)

  useEffect(() => {
    if (type === 'embed' || !src || !videoRef.current) return

    const video = videoRef.current
    let hls = null

    if (src.includes('.m3u8')) {
      if (Hls.isSupported()) {
        hls = new Hls({ enableWorker: true, lowLatencyMode: true })
        hls.loadSource(src)
        hls.attachMedia(video)
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setReady(true)
          setLoading(false)
        })
        hls.on(Hls.Events.ERROR, (_, data) => {
          if (data.fatal) setLoading(false)
        })
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src
        video.addEventListener('loadeddata', () => setReady(true), { once: true })
      }
    } else {
      video.src = src
      video.addEventListener('loadeddata', () => setReady(true), { once: true })
    }

    return () => {
      if (hls) hls.destroy()
    }
  }, [src, type])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      video.play()
      setPlaying(true)
    } else {
      video.pause()
      setPlaying(false)
    }
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return
    video.muted = !video.muted
    setMuted(video.muted)
  }

  const toggleFullscreen = () => {
    const container = containerRef.current
    if (!container) return
    if (!document.fullscreenElement) {
      container.requestFullscreen()
      setFullscreen(true)
    } else {
      document.exitFullscreen()
      setFullscreen(false)
    }
  }

  const handleTimeUpdate = () => {
    const video = videoRef.current
    if (!video) return
    setCurrentTime(video.currentTime)
    setDuration(video.duration || 0)
    setProgress(video.duration ? (video.currentTime / video.duration) * 100 : 0)
  }

  const handleSeek = (e) => {
    const video = videoRef.current
    if (!video || !duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percent = x / rect.width
    video.currentTime = percent * duration
  }

  const skip = (seconds) => {
    const video = videoRef.current
    if (!video) return
    video.currentTime = Math.max(0, Math.min(duration, video.currentTime + seconds))
  }

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleMouseMove = () => {
    setShowControls(true)
    clearTimeout(controlsTimer.current)
    controlsTimer.current = setTimeout(() => {
      if (playing) setShowControls(false)
    }, 3000)
  }

  if (type === 'embed') {
    return (
      <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden">
        <iframe
          src={src}
          className="absolute inset-0 w-full h-full"
          frameBorder="0"
          allowFullScreen
          allow="autoplay; encrypted-media; picture-in-picture"
          title={title || 'Video Player'}
        />
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video bg-black rounded-xl overflow-hidden group"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => playing && setShowControls(false)}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        poster={poster}
        onTimeUpdate={handleTimeUpdate}
        onLoadedData={() => setLoading(false)}
        onWaiting={() => setLoading(true)}
        onPlaying={() => { setLoading(false); setPlaying(true) }}
        onPause={() => setPlaying(false)}
        onClick={togglePlay}
        playsInline
      />

      {loading && ready && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <Loader size={40} className="text-accent animate-spin" />
        </div>
      )}

      <div
        className={`absolute inset-0 flex flex-col justify-end transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 pt-20">
          <div
            className="w-full h-1 bg-white/20 rounded-full cursor-pointer mb-4 group/seek"
            onClick={handleSeek}
          >
            <div
              className="h-full bg-accent rounded-full relative transition-all"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-accent rounded-full opacity-0 group-hover/seek:opacity-100 transition-opacity" />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => skip(-10)} className="text-white/80 hover:text-white transition-colors">
                <SkipBack size={20} />
              </button>
              <button onClick={togglePlay} className="w-10 h-10 flex items-center justify-center bg-accent rounded-full hover:bg-accent-hover transition-all">
                {playing ? <Pause size={18} fill="white" /> : <Play size={18} fill="white" className="ml-0.5" />}
              </button>
              <button onClick={() => skip(10)} className="text-white/80 hover:text-white transition-colors">
                <SkipForward size={20} />
              </button>
              <button onClick={toggleMute} className="text-white/80 hover:text-white transition-colors">
                {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <span className="text-xs text-gray-400 ml-2">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button className="text-white/80 hover:text-white transition-colors">
                <Settings size={18} />
              </button>
              <button onClick={toggleFullscreen} className="text-white/80 hover:text-white transition-colors">
                {fullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

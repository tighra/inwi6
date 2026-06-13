export function getMovieStreamUrl(movieId) {
  return `https://vidsrc.xyz/embed/movie/${movieId}`
}

export function getTvStreamUrl(tvId, season = 1, episode = 1) {
  return `https://vidsrc.xyz/embed/tv/${tvId}/${season}/${episode}`
}

export const liveChannels = [
  {
    id: 'bein-sports-1',
    name: 'beIN Sports 1',
    category: 'Sports',
    logo: 'https://i.imgur.com/8jW4sDi.png',
    streamUrl: 'https://stream.crichd.vip/update/bein-sport-1.php',
  },
  {
    id: 'bein-sports-2',
    name: 'beIN Sports 2',
    category: 'Sports',
    logo: 'https://i.imgur.com/8jW4sDi.png',
    streamUrl: 'https://stream.crichd.vip/update/bein-sport-2.php',
  },
  {
    id: 'bein-sports-3',
    name: 'beIN Sports 3',
    category: 'Sports',
    logo: 'https://i.imgur.com/8jW4sDi.png',
    streamUrl: 'https://stream.crichd.vip/update/bein-sport-3.php',
  },
  {
    id: 'ssc-1',
    name: 'SSC 1',
    category: 'Sports',
    logo: 'https://upload.wikimedia.org/wikipedia/en/4/48/Saudi_Sport_Company_Logo.png',
    streamUrl: 'https://stream.crichd.vip/update/ssc1.php',
  },
  {
    id: 'ssc-2',
    name: 'SSC 2',
    category: 'Sports',
    logo: 'https://upload.wikimedia.org/wikipedia/en/4/48/Saudi_Sport_Company_Logo.png',
    streamUrl: 'https://stream.crichd.vip/update/ssc2.php',
  },
  {
    id: 'mbc-1',
    name: 'MBC 1',
    category: 'Entertainment',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/MBC_1_logo.svg/200px-MBC_1_logo.svg.png',
    streamUrl: '',
  },
  {
    id: 'mbc-2',
    name: 'MBC 2',
    category: 'Movies',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/MBC_2_logo.svg/200px-MBC_2_logo.svg.png',
    streamUrl: '',
  },
  {
    id: 'aljazeera',
    name: 'Al Jazeera',
    category: 'News',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f2/Aljazeera_eng.svg/200px-Aljazeera_eng.svg.png',
    streamUrl: 'https://live-hls-web-aje.getaj.net/AJE/01.m3u8',
  },
  {
    id: 'france24',
    name: 'France 24',
    category: 'News',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/France_24_logo.svg/200px-France_24_logo.svg.png',
    streamUrl: 'https://stream.france24.com/france24/fr/hls/live_stream.m3u8',
  },
  {
    id: 'sky-news',
    name: 'Sky News',
    category: 'News',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/7/74/Sky_News_logo.svg/200px-Sky_News_logo.svg.png',
    streamUrl: 'https://linear-55.frequency.stream/dist/skynews/55/hls/master/all.m3u8',
  },
  {
    id: 'nat-geo',
    name: 'National Geographic',
    category: 'Documentary',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Natgeologo.svg/200px-Natgeologo.svg.png',
    streamUrl: '',
  },
  {
    id: 'discovery',
    name: 'Discovery Channel',
    category: 'Documentary',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Discovery_Channel_logo.svg/200px-Discovery_Channel_logo.svg.png',
    streamUrl: '',
  },
]

export const channelCategories = ['All', 'Sports', 'News', 'Entertainment', 'Movies', 'Documentary']

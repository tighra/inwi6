import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import BottomNav from './components/BottomNav'
import HomePage from './pages/HomePage'
import MoviesPage from './pages/MoviesPage'
import ShowsPage from './pages/ShowsPage'
import LivePage from './pages/LivePage'
import DetailPage from './pages/DetailPage'
import SearchPage from './pages/SearchPage'

export default function App() {
  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/shows" element={<ShowsPage />} />
          <Route path="/live" element={<LivePage />} />
          <Route path="/movie/:id" element={<DetailPage />} />
          <Route path="/tv/:id" element={<DetailPage />} />
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  )
}

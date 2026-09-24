import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Chapters from './pages/Chapters'
import ChapterDetail from './pages/ChapterDetail'
import Members from './pages/Members'
import MemberProfile from './pages/MemberProfile'
import VisitMeeting from './pages/VisitMeeting'
import EventsPage from './pages/EventsPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        {/* <Route path="chapters" element={<Chapters />} />
        <Route path="chapters/:slug" element={<ChapterDetail />} /> */}
        <Route path="members" element={<Members />} />
        <Route path="/members/:uid" element={<MemberProfile />} />
        <Route path="about" element={<Navigate to="/" replace />} />
        <Route path="visit-meeting" element={<VisitMeeting />} />
        <Route path="events" element={<EventsPage />} />
      </Route>
    </Routes>
  )
}
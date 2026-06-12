import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Splash from './pages/Splash'
import AddChild from './pages/AddChild'
import ChildProfile from './pages/ChildProfile'
import Home from './pages/Home'
import Insights from './pages/Insights'
import Settings from './pages/Settings'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"           element={<Splash />} />
        <Route path="/add-child"  element={<AddChild />} />
        <Route path="/child/:id"  element={<ChildProfile />} />
        <Route path="/home"       element={<Home />} />
        <Route path="/insights"   element={<Insights />} />
        <Route path="/settings"   element={<Settings />} />
        <Route path="*"           element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

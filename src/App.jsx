import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './store/authStore'
import AuthGuard from './components/AuthGuard'
import Splash from './pages/Splash'
import Login from './pages/Login'
import Signup from './pages/Signup'
import AddChild from './pages/AddChild'
import ChildProfile from './pages/ChildProfile'
import EditChild from './pages/EditChild'
import Home from './pages/Home'
import Insights from './pages/Insights'
import Settings from './pages/Settings'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"          element={<Splash />} />
          <Route path="/login"     element={<Login />} />
          <Route path="/signup"    element={<Signup />} />

          <Route path="/add-child"      element={<AuthGuard><AddChild /></AuthGuard>} />
          <Route path="/child/:id"      element={<AuthGuard><ChildProfile /></AuthGuard>} />
          <Route path="/child/:id/edit" element={<AuthGuard><EditChild /></AuthGuard>} />
          <Route path="/home"           element={<AuthGuard><Home /></AuthGuard>} />
          <Route path="/insights"       element={<AuthGuard><Insights /></AuthGuard>} />
          <Route path="/settings"       element={<AuthGuard><Settings /></AuthGuard>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

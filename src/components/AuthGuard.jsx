import { Navigate } from 'react-router-dom'
import { useAuth } from '../store/authStore'
import Spinner from './Spinner'

export default function AuthGuard({ children }) {
  const { user } = useAuth()

  // Still loading session
  if (user === undefined) {
    return (
      <div className="w-full max-w-sm bg-cream-100 min-h-svh flex items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (!user) return <Navigate to="/" replace />
  return children
}

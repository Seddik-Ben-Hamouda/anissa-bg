import { Navigate } from 'react-router-dom'
import { useAdmin } from '../../context/AdminContext'

export default function PrivateRoute({ children }) {
  const { session } = useAdmin()
  if (!session) return <Navigate to="/admin/login" replace />
  return children
}

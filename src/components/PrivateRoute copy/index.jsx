import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

// Protege rotas autenticadas. Com requireAdmin, exige role === 'admin'.
export default function PrivateRoute({ children, requireAdmin = false }) {
  const { isAuthenticated, role } = useAuth()

  // Não autenticado → login.
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Autenticado mas sem ser admin tentando acessar /admin → perfil.
  if (requireAdmin && role !== 'admin') {
    return <Navigate to="/perfil" replace />
  }

  return children
}

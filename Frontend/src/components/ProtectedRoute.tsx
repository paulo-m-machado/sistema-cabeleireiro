import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface Props {
  children: ReactNode;
  requireGerente?: boolean;
}

export function ProtectedRoute({ children, requireGerente = false }: Props) {
  const { isAuthenticated, isGerente } = useAuth();
  if (!isAuthenticated)              return <Navigate to="/login"  replace />;
  if (requireGerente && !isGerente)  return <Navigate to="/"      replace />;
  return <>{children}</>;
}

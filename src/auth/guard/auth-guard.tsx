import { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

import { useAuth } from '../hooks';

type Props = {
  children: React.ReactNode;
};

export function AuthGuard({ children }: Props) {
  const { isAuthenticated, loading } = useAuth();
  const { pathname } = useLocation();
  const [requestedLocation, setRequestedLocation] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      if (pathname !== '/sign-in') {
        setRequestedLocation(pathname);
      }
    }
  }, [isAuthenticated, pathname]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flex: '1 1 auto',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <LinearProgress sx={{ width: 1, maxWidth: 320 }} />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace />;
  }

  if (requestedLocation && pathname !== requestedLocation) {
    setRequestedLocation(null);
    return <Navigate to={requestedLocation} replace />;
  }

  return <>{children}</>;
}

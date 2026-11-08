import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import useScrollTrigger from '@mui/material/useScrollTrigger';

import { useAuth } from 'src/auth';

import { Logo } from 'src/components/logo';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

interface Props {
  onScrollToQuizzes?: () => void;
  onScrollToFeatures?: () => void;
  onScrollToHowItWorks?: () => void;
}

export function LandingHeader({
  onScrollToQuizzes,
  onScrollToFeatures,
  onScrollToHowItWorks,
}: Props) {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const isTriggered = useScrollTrigger({ disableHysteresis: true, threshold: 20 });

  const [siteName, setSiteName] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('siteName');
      return stored && stored !== 'G Labs' && stored !== 'QuizMaster' ? stored : 'mcqpro';
    }
    return 'mcqpro';
  });

  useEffect(() => {
    const handleUpdate = () => {
      const stored = localStorage.getItem('siteName');
      if (stored) setSiteName(stored);
    };
    window.addEventListener('settings-updated', handleUpdate);
    return () => window.removeEventListener('settings-updated', handleUpdate);
  }, []);

  const roles = (user as any)?.role || [];
  const isStudent = Array.isArray(roles) && roles.includes('Student');
  const dashboardPath = isStudent ? '/student/quizzes' : '/dashboard';

  return (
    <Box
      component="header"
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1100,
        transition: 'all 0.3s ease',
        bgcolor: isTriggered ? 'rgba(255, 255, 255, 0.85)' : 'transparent',
        backdropFilter: isTriggered ? 'blur(16px)' : 'none',
        borderBottom: isTriggered ? '1px solid' : 'none',
        borderColor: 'divider',
        boxShadow: isTriggered ? '0 4px 20px rgba(0, 0, 0, 0.06)' : 'none',
        py: { xs: 1.5, md: 2 },
      }}
    >
      <Container maxWidth="lg">
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          {/* Logo & Brand Name */}
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.25}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            sx={{ cursor: 'pointer', userSelect: 'none' }}
          >
            <Logo sx={{ width: 40, height: 40 }} />
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                color: 'text.primary',
                letterSpacing: 0.5,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Box component="span" sx={{ color: 'primary.main', fontWeight: 900 }}>
                {siteName.toLowerCase() === 'mcqpro' ? 'mcq' : siteName.charAt(0)}
              </Box>
              {siteName.toLowerCase() === 'mcqpro' ? 'pro' : siteName.slice(1)}
            </Typography>
          </Stack>

          {/* Navigation Links */}
          <Stack
            direction="row"
            spacing={{ xs: 1, sm: 3 }}
            sx={{ display: { xs: 'none', md: 'flex' } }}
          >
            <Button
              color="inherit"
              onClick={onScrollToQuizzes}
              sx={{ fontWeight: 600, color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
            >
              Quizzes
            </Button>
            <Button
              color="inherit"
              onClick={onScrollToFeatures}
              sx={{ fontWeight: 600, color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
            >
              Why mcqpro?
            </Button>
            <Button
              color="inherit"
              onClick={onScrollToHowItWorks}
              sx={{ fontWeight: 600, color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
            >
              How It Works
            </Button>
          </Stack>

          {/* Action Buttons */}
          <Stack direction="row" spacing={1.5} alignItems="center">
            {isAuthenticated ? (
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate(dashboardPath)}
                endIcon={<Iconify icon="solar:arrow-right-bold" />}
                sx={{
                  fontWeight: 700,
                  borderRadius: 1.25,
                  px: 2.5,
                  py: 1,
                  boxShadow: (theme) => `0 6px 16px -2px ${theme.vars.palette.primary.main}40`,
                }}
              >
                {isStudent ? 'My Quizzes' : 'Go to Dashboard'}
              </Button>
            ) : (
              <>
                <Button
                  variant="text"
                  color="inherit"
                  onClick={() => navigate('/sign-in')}
                  sx={{ fontWeight: 600, px: 2 }}
                >
                  Sign in
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate('/sign-up')}
                  endIcon={<Iconify icon="solar:user-plus-bold" />}
                  sx={{
                    fontWeight: 700,
                    borderRadius: 1.25,
                    px: 2.5,
                    py: 1,
                    boxShadow: (theme) => `0 6px 16px -2px ${theme.vars.palette.primary.main}40`,
                  }}
                >
                  Join Free
                </Button>
              </>
            )}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}

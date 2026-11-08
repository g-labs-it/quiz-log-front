import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import useScrollTrigger from '@mui/material/useScrollTrigger';

import { useAuth } from 'src/auth';

import { Logo } from 'src/components/logo';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

interface Props {
  onScrollToQuizzes?: () => void;
  onScrollToChampions?: () => void;
  onScrollToHowItWorks?: () => void;
  onScrollToFeatures?: () => void;
}

export function LandingHeader({
  onScrollToQuizzes,
  onScrollToChampions,
  onScrollToHowItWorks,
  onScrollToFeatures,
}: Props) {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const isTriggered = useScrollTrigger({ disableHysteresis: true, threshold: 20 });
  const [mobileOpen, setMobileOpen] = useState(false);

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

  const navItems = [
    { label: 'Quizzes', action: onScrollToQuizzes },
    { label: 'Champions', action: onScrollToChampions },
    { label: 'How It Works', action: onScrollToHowItWorks },
    { label: 'About Us', action: onScrollToFeatures },
  ];

  return (
    <>
      <Box
        component="header"
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1200,
          bgcolor: isTriggered ? 'rgba(245, 244, 235, 0.92)' : 'transparent',
          backdropFilter: isTriggered ? 'blur(14px)' : 'none',
          borderBottom: isTriggered ? '1px solid rgba(20, 20, 43, 0.08)' : '1px solid transparent',
          py: { xs: 2, md: isTriggered ? 2 : 3.25 },
          transition: 'all 0.25s ease',
        }}
      >
        <Container maxWidth="lg">
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            {/* Left Group: Brand Logo + Navigation Links (Matching Reference 100%) */}
            <Stack direction="row" alignItems="center" spacing={{ md: 6, lg: 8 }}>
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                sx={{ cursor: 'pointer', userSelect: 'none' }}
              >
                <Logo sx={{ width: 30, height: 30 }} />
                <Typography
                  sx={{
                    fontFamily: '"Plus Jakarta Sans", "DM Sans Variable", sans-serif',
                    fontWeight: 800,
                    fontSize: '1.25rem',
                    color: '#0C0C0C',
                    letterSpacing: '-0.03em',
                  }}
                >
                  {siteName}
                </Typography>
              </Stack>

              {/* Navigation Links */}
              <Stack
                direction="row"
                spacing={{ md: 3.5, lg: 4.5 }}
                sx={{ display: { xs: 'none', md: 'flex' } }}
              >
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    component="button"
                    onClick={item.action}
                    underline="none"
                    sx={{
                      fontFamily: '"Plus Jakarta Sans", "DM Sans Variable", sans-serif',
                      fontWeight: 500,
                      fontSize: '15px',
                      color: '#14142B',
                      cursor: 'pointer',
                      transition: 'opacity 0.2s ease',
                      '&:hover': {
                        opacity: 0.65,
                      },
                    }}
                  >
                    {item.label}
                  </Link>
                ))}
              </Stack>
            </Stack>

            {/* Right Group: Log in & Outlined Pill Sign up Button */}
            <Stack direction="row" spacing={2} alignItems="center">
              {isAuthenticated ? (
                <Button
                  variant="outlined"
                  onClick={() => navigate(dashboardPath)}
                  sx={{
                    border: '1px solid #14142B',
                    borderRadius: '999px',
                    fontWeight: 600,
                    fontSize: '14.5px',
                    color: '#14142B',
                    bgcolor: 'transparent',
                    px: 3.5,
                    py: 0.9,
                    textTransform: 'none',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: '#0C0C0C',
                      color: '#FFFFFF',
                      borderColor: '#0C0C0C',
                    },
                  }}
                >
                  {isStudent ? 'My Quizzes' : 'Dashboard'}
                </Button>
              ) : (
                <>
                  <Button
                    variant="text"
                    onClick={() => navigate('/sign-in')}
                    sx={{
                      display: { xs: 'none', sm: 'inline-flex' },
                      fontFamily: '"Plus Jakarta Sans", "DM Sans Variable", sans-serif',
                      fontWeight: 500,
                      fontSize: '15px',
                      color: '#14142B',
                      px: 1.5,
                      textTransform: 'none',
                      '&:hover': { bgcolor: 'transparent', opacity: 0.65 },
                    }}
                  >
                    Log in
                  </Button>

                  <Button
                    variant="outlined"
                    onClick={() => navigate('/sign-up')}
                    sx={{
                      fontFamily: '"Plus Jakarta Sans", "DM Sans Variable", sans-serif',
                      border: '1px solid #14142B',
                      borderRadius: '999px',
                      fontWeight: 500,
                      fontSize: '15px',
                      color: '#14142B',
                      bgcolor: 'transparent',
                      px: { xs: 2.5, sm: 3.75 },
                      py: 0.85,
                      textTransform: 'none',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: '#0C0C0C',
                        color: '#FFFFFF',
                        borderColor: '#0C0C0C',
                      },
                    }}
                  >
                    Sign up
                  </Button>
                </>
              )}

              {/* Mobile Hamburger Button */}
              <IconButton
                onClick={() => setMobileOpen(true)}
                sx={{
                  display: { xs: 'inline-flex', md: 'none' },
                  color: '#0C0C0C',
                  p: 0.75,
                }}
                aria-label="Open Menu"
              >
                <Iconify icon="solar:hamburger-menu-linear" width={24} />
              </IconButton>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            bgcolor: '#F5F4EB',
            p: 3,
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 4 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Logo sx={{ width: 28, height: 28 }} />
            <Typography sx={{ fontWeight: 800, fontSize: '1.2rem', color: '#0C0C0C' }}>
              {siteName}
            </Typography>
          </Stack>
          <IconButton onClick={() => setMobileOpen(false)} sx={{ color: '#0C0C0C' }}>
            <Iconify icon="solar:close-circle-bold" width={24} />
          </IconButton>
        </Stack>

        <Stack spacing={1.5} sx={{ flexGrow: 1 }}>
          {navItems.map((item) => (
            <Button
              key={item.label}
              fullWidth
              onClick={() => {
                setMobileOpen(false);
                item.action?.();
              }}
              sx={{
                justifyContent: 'flex-start',
                fontWeight: 600,
                fontSize: 16,
                color: '#14142B',
                py: 1,
                textTransform: 'none',
              }}
            >
              {item.label}
            </Button>
          ))}
        </Stack>

        <Stack spacing={1.5} sx={{ pt: 2 }}>
          {isAuthenticated ? (
            <Button
              fullWidth
              variant="contained"
              onClick={() => {
                setMobileOpen(false);
                navigate(dashboardPath);
              }}
              sx={{
                bgcolor: '#0C0C0C',
                color: '#FFFFFF',
                borderRadius: '999px',
                py: 1.2,
                fontWeight: 600,
                textTransform: 'none',
              }}
            >
              {isStudent ? 'My Quizzes' : 'Dashboard'}
            </Button>
          ) : (
            <>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => {
                  setMobileOpen(false);
                  navigate('/sign-in');
                }}
                sx={{
                  borderColor: '#14142B',
                  color: '#14142B',
                  borderRadius: '999px',
                  py: 1.1,
                  fontWeight: 600,
                  textTransform: 'none',
                }}
              >
                Log in
              </Button>
              <Button
                fullWidth
                variant="contained"
                onClick={() => {
                  setMobileOpen(false);
                  navigate('/sign-up');
                }}
                sx={{
                  bgcolor: '#0C0C0C',
                  color: '#FFFFFF',
                  borderRadius: '999px',
                  py: 1.1,
                  fontWeight: 600,
                  textTransform: 'none',
                }}
              >
                Sign up
              </Button>
            </>
          )}
        </Stack>
      </Drawer>
    </>
  );
}

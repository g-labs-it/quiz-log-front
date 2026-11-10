import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { Logo } from 'src/components/logo';

// ----------------------------------------------------------------------

interface Props {
  onScrollToQuizzes?: () => void;
  onScrollToFeatures?: () => void;
}

export function LandingFooter({ onScrollToQuizzes, onScrollToFeatures }: Props) {
  const navigate = useNavigate();

  return (
    <Box component="footer" sx={{ bgcolor: '#011738', color: '#FFFFFF', pt: 9, pb: 6 }}>
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', md: 'center' }}
          spacing={4}
          sx={{ mb: 6 }}
        >
          {/* Brand Info */}
          <Box sx={{ maxWidth: 380 }}>
            <Stack direction="row" alignItems="center" spacing={1.25} sx={{ mb: 1.5 }}>
              <Logo sx={{ width: 34, height: 34 }} />
              <Typography
                sx={{
                  fontFamily: '"Plus Jakarta Sans", "DM Sans Variable", sans-serif',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  fontSize: '1.4rem',
                  letterSpacing: '-0.02em',
                }}
              >
                <Box component="span" sx={{ color: '#FDC745', fontWeight: 900 }}>
                  mcq
                </Box>
                pro
              </Typography>
            </Stack>
            <Typography
              sx={{
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14.5px',
                lineHeight: 1.6,
              }}
            >
              The modern online examination and MCQ testing platform built for ambitious students and
              passionate educators.
            </Typography>
          </Box>

          {/* Footer Quick Links */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 2, sm: 4 }}>
            <Link
              component="button"
              onClick={() => {
                if (onScrollToQuizzes) {
                  onScrollToQuizzes();
                } else {
                  navigate('/all-quizzes');
                }
              }}
              sx={{
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                color: 'rgba(255, 255, 255, 0.8)',
                fontWeight: 600,
                fontSize: '14.5px',
                textDecoration: 'none',
                transition: 'color 0.2s',
                '&:hover': { color: '#FDC745' },
              }}
            >
              Public Quizzes
            </Link>
            <Link
              component="button"
              onClick={onScrollToFeatures}
              sx={{
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                color: 'rgba(255, 255, 255, 0.8)',
                fontWeight: 600,
                fontSize: '14.5px',
                textDecoration: 'none',
                transition: 'color 0.2s',
                '&:hover': { color: '#FDC745' },
              }}
            >
              Why mcqpro?
            </Link>
            <Link
              component="button"
              onClick={() => navigate('/sign-in')}
              sx={{
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                color: 'rgba(255, 255, 255, 0.8)',
                fontWeight: 600,
                fontSize: '14.5px',
                textDecoration: 'none',
                transition: 'color 0.2s',
                '&:hover': { color: '#FDC745' },
              }}
            >
              Sign In
            </Link>
            <Link
              component="button"
              onClick={() => navigate('/sign-up')}
              sx={{
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                color: '#FDC745',
                fontWeight: 700,
                fontSize: '14.5px',
                textDecoration: 'none',
                transition: 'color 0.2s',
                '&:hover': { color: '#FFFFFF' },
              }}
            >
              Create Account
            </Link>
          </Stack>
        </Stack>

        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', mb: 4 }} />

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Typography
            sx={{
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: '13px',
            }}
          >
            &copy; {new Date().getFullYear()} mcqpro. All rights reserved.
          </Typography>
          <Typography
            sx={{
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: '13px',
            }}
          >
            Empowering students with smart, simulated MCQ exams.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}

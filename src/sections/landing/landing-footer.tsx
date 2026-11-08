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
    <Box component="footer" sx={{ bgcolor: '#0B1319', color: 'common.white', pt: 8, pb: 6 }}>
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', md: 'center' }}
          spacing={4}
          sx={{ mb: 6 }}
        >
          {/* Brand Info */}
          <Box sx={{ maxWidth: 360 }}>
            <Stack direction="row" alignItems="center" spacing={1.25} sx={{ mb: 1.5 }}>
              <Logo sx={{ width: 36, height: 36 }} />
              <Typography variant="h5" sx={{ fontWeight: 800, color: 'common.white', letterSpacing: 0.5 }}>
                <Box component="span" sx={{ color: 'primary.main', fontWeight: 900 }}>
                  mcq
                </Box>
                pro
              </Typography>
            </Stack>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.65)', lineHeight: 1.6 }}>
              The modern online examination and MCQ testing platform built for ambitious students and
              passionate educators.
            </Typography>
          </Box>

          {/* Footer Quick Links */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 2, sm: 4 }}>
            <Link
              component="button"
              onClick={onScrollToQuizzes}
              sx={{ color: 'rgba(255, 255, 255, 0.75)', fontWeight: 600, textDecoration: 'none', '&:hover': { color: 'primary.light' } }}
            >
              Public Quizzes
            </Link>
            <Link
              component="button"
              onClick={onScrollToFeatures}
              sx={{ color: 'rgba(255, 255, 255, 0.75)', fontWeight: 600, textDecoration: 'none', '&:hover': { color: 'primary.light' } }}
            >
              Why mcqpro?
            </Link>
            <Link
              component="button"
              onClick={() => navigate('/sign-in')}
              sx={{ color: 'rgba(255, 255, 255, 0.75)', fontWeight: 600, textDecoration: 'none', '&:hover': { color: 'primary.light' } }}
            >
              Sign In
            </Link>
            <Link
              component="button"
              onClick={() => navigate('/sign-up')}
              sx={{ color: 'primary.light', fontWeight: 700, textDecoration: 'none', '&:hover': { color: 'common.white' } }}
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
          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
            &copy; {new Date().getFullYear()} mcqpro. All rights reserved.
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
            Empowering students with smart, simulated MCQ exams.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}


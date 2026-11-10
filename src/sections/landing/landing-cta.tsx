import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { useAuth } from 'src/auth';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

interface Props {
  onScrollToQuizzes?: () => void;
}

export function LandingCta({ onScrollToQuizzes }: Props) {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const roles = (user as any)?.role || [];
  const isStudent = Array.isArray(roles) && roles.includes('Student');

  return (
    <Box sx={{ py: { xs: 9, md: 14 }, bgcolor: '#F5F4EB' }}>
      <Container maxWidth="lg">
        <Card
          sx={{
            p: { xs: 4, sm: 6, md: 8 },
            borderRadius: '32px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            bgcolor: '#011738',
            color: '#FFFFFF',
            boxShadow: '0 24px 64px rgba(1, 23, 56, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          {/* Subtle Background Bauhaus Circles */}
          <Box
            sx={{
              position: 'absolute',
              top: -90,
              right: -90,
              width: 320,
              height: 320,
              borderRadius: '50%',
              bgcolor: 'rgba(253, 199, 69, 0.08)',
              pointerEvents: 'none',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: -80,
              left: -80,
              width: 280,
              height: 280,
              borderRadius: '50%',
              bgcolor: 'rgba(67, 97, 242, 0.15)',
              pointerEvents: 'none',
            }}
          />

          <Stack spacing={3} alignItems="center" sx={{ position: 'relative', zIndex: 1, maxWidth: 660, mx: 'auto' }}>
            <Box
              sx={{
                width: 58,
                height: 58,
                borderRadius: '18px',
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(255, 255, 255, 0.15)',
              }}
            >
              <Iconify icon="solar:star-fall-bold" width={32} color="#FDC745" />
            </Box>

            <Typography
              sx={{
                fontFamily: '"Plus Jakarta Sans", "DM Sans Variable", sans-serif',
                fontWeight: 800,
                fontSize: { xs: '2.1rem', sm: '2.7rem', md: '3.2rem' },
                lineHeight: 1.15,
                letterSpacing: '-0.035em',
                color: '#FFFFFF',
              }}
            >
              Ready to Ace Your Next Exam?
            </Typography>

            <Typography
              sx={{
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                color: 'rgba(255, 255, 255, 0.85)',
                fontSize: { xs: '15px', md: '17px' },
                lineHeight: 1.65,
                maxWidth: 580,
              }}
            >
              Join mcqpro today to access thousands of verified multiple-choice questions, track your
              rank over time, and master your exam timing.
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ pt: 2, width: { xs: 1, sm: 'auto' } }}>
              {isAuthenticated ? (
                <Button
                  size="large"
                  onClick={() => navigate(isStudent ? '/student/quizzes' : '/dashboard')}
                  startIcon={<Iconify icon="solar:widget-add-bold-duotone" />}
                  sx={{
                    bgcolor: '#36B37E',
                    color: '#FFFFFF',
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    fontWeight: 700,
                    fontSize: '15.5px',
                    borderRadius: '999px',
                    px: 4.5,
                    py: 1.6,
                    height: 54,
                    textTransform: 'none',
                    boxShadow: '0 8px 24px rgba(54, 179, 126, 0.35)',
                    transition: 'all 0.25s ease',
                    '&:hover': {
                      bgcolor: '#1B806A',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 14px 32px rgba(54, 179, 126, 0.45)',
                    },
                  }}
                >
                  Go to Dashboard
                </Button>
              ) : (
                <Button
                  size="large"
                  onClick={() => navigate('/sign-up')}
                  endIcon={<Iconify icon="solar:arrow-right-linear" width={20} />}
                  sx={{
                    bgcolor: '#36B37E',
                    color: '#FFFFFF',
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    fontWeight: 700,
                    fontSize: '15.5px',
                    borderRadius: '999px',
                    px: 4.5,
                    py: 1.6,
                    height: 54,
                    textTransform: 'none',
                    boxShadow: '0 8px 24px rgba(54, 179, 126, 0.35)',
                    transition: 'all 0.25s ease',
                    '&:hover': {
                      bgcolor: '#1B806A',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 14px 32px rgba(54, 179, 126, 0.45)',
                    },
                  }}
                >
                  Create Free Student Account
                </Button>
              )}

              <Button
                size="large"
                variant="outlined"
                onClick={onScrollToQuizzes}
                sx={{
                  color: '#FFFFFF',
                  borderColor: 'rgba(255, 255, 255, 0.35)',
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  fontWeight: 600,
                  fontSize: '15px',
                  borderRadius: '999px',
                  px: 4,
                  py: 1.6,
                  height: 54,
                  textTransform: 'none',
                  transition: 'all 0.25s ease',
                  '&:hover': {
                    borderColor: '#FFFFFF',
                    bgcolor: 'rgba(255, 255, 255, 0.08)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                Browse Public Quizzes
              </Button>
            </Stack>

            {/* Trust bullet badges */}
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={{ xs: 1.5, sm: 3 }}
              sx={{ pt: 2, color: 'rgba(255, 255, 255, 0.7)', fontSize: 13 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Iconify icon="solar:check-circle-bold" width={18} color="#FDC745" />
                <span>No credit card required</span>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Iconify icon="solar:check-circle-bold" width={18} color="#FDC745" />
                <span>Instant score breakdown</span>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Iconify icon="solar:check-circle-bold" width={18} color="#FDC745" />
                <span>Mobile & desktop ready</span>
              </Box>
            </Stack>
          </Stack>
        </Card>
      </Container>
    </Box>
  );
}

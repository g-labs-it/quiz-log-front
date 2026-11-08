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
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Card
          sx={{
            p: { xs: 4, sm: 6, md: 8 },
            borderRadius: 3,
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #004B3E 0%, #007867 50%, #00A76F 100%)',
            color: 'common.white',
            boxShadow: '0 24px 56px rgba(0, 167, 111, 0.35)',
          }}
        >
          {/* Subtle Background Glow Circles */}
          <Box
            sx={{
              position: 'absolute',
              top: -80,
              right: -80,
              width: 260,
              height: 260,
              borderRadius: '50%',
              bgcolor: 'rgba(255, 255, 255, 0.08)',
              pointerEvents: 'none',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: -60,
              left: -60,
              width: 220,
              height: 220,
              borderRadius: '50%',
              bgcolor: 'rgba(255, 255, 255, 0.06)',
              pointerEvents: 'none',
            }}
          />

          <Stack spacing={3} alignItems="center" sx={{ position: 'relative', zIndex: 1, maxWidth: 640, mx: 'auto' }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: 2,
                bgcolor: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Iconify icon="solar:star-fall-bold" width={32} color="#FFFFFF" />
            </Box>

            <Typography
              variant="h2"
              sx={{
                fontWeight: 900,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                lineHeight: 1.2,
                letterSpacing: -0.5,
              }}
            >
              Ready to Ace Your Next Exam?
            </Typography>

            <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.88)', fontSize: 18, lineHeight: 1.6 }}>
              Join mcqpro today to access our library of verified multiple-choice questions, track your
              progress over time, and master your exam timing.
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ pt: 2, width: { xs: 1, sm: 'auto' } }}>
              {isAuthenticated ? (
                <Button
                  size="large"
                  variant="contained"
                  onClick={() => navigate(isStudent ? '/student/quizzes' : '/dashboard')}
                  startIcon={<Iconify icon="solar:widget-add-bold-duotone" />}
                  sx={{
                    bgcolor: '#FEE140',
                    backgroundImage: 'linear-gradient(135deg, #FFE066 0%, #FEE140 100%)',
                    color: '#07271E',
                    fontWeight: 900,
                    fontSize: 16,
                    borderRadius: '999px',
                    px: 4.5,
                    py: 1.6,
                    boxShadow: '0 8px 24px rgba(254, 225, 64, 0.45)',
                    '&:hover': { bgcolor: '#FFF', transform: 'translateY(-2px)' },
                  }}
                >
                  Go to My Dashboard
                </Button>
              ) : (
                <Button
                  size="large"
                  variant="contained"
                  onClick={() => navigate('/sign-up')}
                  startIcon={<Iconify icon="solar:user-plus-bold" />}
                  sx={{
                    bgcolor: '#FEE140',
                    backgroundImage: 'linear-gradient(135deg, #FFE066 0%, #FEE140 100%)',
                    color: '#07271E',
                    fontWeight: 900,
                    fontSize: 16,
                    borderRadius: '999px',
                    px: 4.5,
                    py: 1.6,
                    boxShadow: '0 8px 24px rgba(254, 225, 64, 0.45)',
                    '&:hover': { bgcolor: '#FFF', transform: 'translateY(-2px)' },
                  }}
                >
                  Create Free Account
                </Button>
              )}

              <Button
                size="large"
                variant="outlined"
                onClick={onScrollToQuizzes}
                sx={{
                  color: 'common.white',
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  fontWeight: 700,
                  fontSize: 16,
                  borderRadius: '999px',
                  px: 4,
                  py: 1.6,
                  '&:hover': {
                    borderColor: 'common.white',
                    bgcolor: 'rgba(255, 255, 255, 0.12)',
                  },
                }}
              >
                Browse Public Quizzes
              </Button>
            </Stack>
          </Stack>
        </Card>
      </Container>
    </Box>
  );
}


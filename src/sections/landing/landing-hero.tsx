import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import { useAuth } from 'src/auth';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

interface Props {
  onScrollToQuizzes?: () => void;
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
}

export function LandingHero({ onScrollToQuizzes, searchQuery = '', onSearchChange }: Props) {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const roles = (user as any)?.role || [];
  const isStudent = Array.isArray(roles) && roles.includes('Student');

  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        pt: { xs: 15, md: 18 },
        pb: { xs: 8, md: 12 },
        background: (theme) =>
          `radial-gradient(ellipse at 80% 20%, ${theme.vars.palette.primary.lighter} 0%, rgba(255,255,255,0) 65%),
           radial-gradient(ellipse at 20% 60%, rgba(0, 167, 111, 0.08) 0%, rgba(255,255,255,0) 50%)`,
      }}
    >
      {/* Decorative Floating Ambient Orbs */}
      <Box
        sx={{
          position: 'absolute',
          top: -120,
          right: -100,
          width: 480,
          height: 480,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(0, 167, 111, 0.18), rgba(91, 228, 155, 0.12))',
          filter: 'blur(90px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -80,
          left: -120,
          width: 420,
          height: 420,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(0, 167, 111, 0.12), rgba(0, 120, 103, 0.08))',
          filter: 'blur(80px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={{ xs: 6, md: 4 }} alignItems="center">
          {/* Left Column: Headline & CTA */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Stack spacing={3} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              {/* Badge Pill */}
              <Box sx={{ display: 'inline-flex', justifyContent: { xs: 'center', md: 'flex-start' } }}>
                <Chip
                  icon={<Iconify icon="solar:stars-bold" width={18} color="primary.main" />}
                  label="The Smart Exam & MCQ Practice Platform"
                  size="medium"
                  sx={{
                    px: 1,
                    py: 0.5,
                    fontWeight: 700,
                    borderRadius: 1,
                    bgcolor: 'primary.lighter',
                    color: 'primary.darker',
                    fontSize: 13,
                    border: '1px solid',
                    borderColor: 'primary.light',
                  }}
                />
              </Box>

              {/* Headline */}
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 900,
                  fontSize: { xs: '2.5rem', sm: '3.25rem', md: '3.75rem' },
                  lineHeight: 1.15,
                  letterSpacing: -1,
                  color: 'text.primary',
                }}
              >
                Ace Your Exams with{' '}
                <Box
                  component="span"
                  sx={{
                    background: (theme) =>
                      `linear-gradient(135deg, ${theme.vars.palette.primary.main} 0%, #007867 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  mcqpro
                </Box>
              </Typography>

              {/* Sub-headline */}
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: 16, md: 19 },
                  color: 'text.secondary',
                  lineHeight: 1.6,
                  maxWidth: 580,
                  mx: { xs: 'auto', md: 0 },
                }}
              >
                Practice thousands of verified multiple-choice questions with real-time countdown
                timers, simulated exam conditions, and instant step-by-step explanations.
              </Typography>

              {/* Search Bar or Quick CTA */}
              <Box sx={{ maxWidth: 520, mx: { xs: 'auto', md: 0 }, width: 1 }}>
                <TextField
                  fullWidth
                  placeholder="Search quizzes by topic (e.g. Science, Biology, ICT)..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') onScrollToQuizzes?.();
                  }}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Iconify icon="solar:magnifer-linear" width={22} sx={{ color: 'primary.main' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={onScrollToQuizzes}
                            sx={{ borderRadius: 1, px: 2, fontWeight: 700 }}
                          >
                            Explore
                          </Button>
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{
                    bgcolor: 'background.paper',
                    borderRadius: 1.5,
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5,
                      pr: 1,
                    },
                  }}
                />
              </Box>

              {/* Buttons */}
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                sx={{ justifyContent: { xs: 'center', md: 'flex-start' } }}
              >
                <Button
                  size="large"
                  variant="contained"
                  color="primary"
                  onClick={onScrollToQuizzes}
                  startIcon={<Iconify icon="solar:play-circle-bold" width={24} />}
                  sx={{
                    py: 1.5,
                    px: 3.5,
                    fontSize: 16,
                    fontWeight: 700,
                    borderRadius: 1.25,
                    boxShadow: (theme) => `0 8px 20px -4px ${theme.vars.palette.primary.main}50`,
                  }}
                >
                  Explore Public Quizzes
                </Button>

                {isAuthenticated ? (
                  <Button
                    size="large"
                    variant="outlined"
                    color="inherit"
                    onClick={() => navigate(isStudent ? '/student/quizzes' : '/dashboard')}
                    startIcon={<Iconify icon="solar:widget-add-bold-duotone" width={20} />}
                    sx={{ py: 1.5, px: 3, fontWeight: 600, borderRadius: 1.25 }}
                  >
                    My Dashboard
                  </Button>
                ) : (
                  <Button
                    size="large"
                    variant="outlined"
                    color="inherit"
                    onClick={() => navigate('/sign-up')}
                    startIcon={<Iconify icon="solar:user-bold-duotone" width={20} />}
                    sx={{ py: 1.5, px: 3, fontWeight: 600, borderRadius: 1.25 }}
                  >
                    Create Free Account
                  </Button>
                )}
              </Stack>

              {/* Key Trust Highlights */}
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={{ xs: 2, sm: 4 }}
                sx={{
                  pt: 2,
                  justifyContent: { xs: 'center', md: 'flex-start' },
                  alignItems: 'center',
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <Iconify icon="solar:check-circle-bold" width={20} color="success.main" />
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                    100% Free Public Quizzes
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Iconify icon="solar:stopwatch-bold" width={20} color="primary.main" />
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                    Real-time Timed Tests
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Iconify icon="solar:lightbulb-bold" width={20} color="warning.main" />
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                    Instant Explanations
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Grid>

          {/* Right Column: Interactive Quiz Mockup Card */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Box sx={{ position: 'relative', mx: 'auto', maxWidth: 440 }}>
              {/* Floating Passed Badge */}
              <Card
                sx={{
                  position: 'absolute',
                  top: -20,
                  right: -12,
                  zIndex: 2,
                  p: 1.5,
                  borderRadius: 1.5,
                  boxShadow: '0 12px 28px rgba(0, 167, 111, 0.25)',
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'success.light',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.25,
                }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: 1,
                    bgcolor: 'success.lighter',
                    color: 'success.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Iconify icon="solar:cup-star-bold" width={22} />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    Latest Result
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'success.darker' }}>
                    100% Passed • Grade A
                  </Typography>
                </Box>
              </Card>

              {/* Main Quiz Mockup Card */}
              <Card
                sx={{
                  p: 3,
                  borderRadius: 2,
                  boxShadow: '0 20px 48px rgba(0, 0, 0, 0.12)',
                  border: '1px solid',
                  borderColor: 'divider',
                  bgcolor: 'background.paper',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                {/* Mockup Header */}
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip
                      label="Question 1 of 5"
                      size="small"
                      sx={{
                        borderRadius: 1,
                        bgcolor: 'primary.lighter',
                        color: 'primary.darker',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                      }}
                    />
                    <Chip
                      label="2.0 Marks"
                      size="small"
                      variant="outlined"
                      sx={{ borderRadius: 1, fontSize: '0.75rem' }}
                    />
                  </Stack>
                  <Chip
                    icon={<Iconify icon="solar:clock-circle-bold" width={16} />}
                    label="28:45"
                    size="small"
                    sx={{
                      borderRadius: 1,
                      fontWeight: 700,
                      bgcolor: 'warning.lighter',
                      color: 'warning.darker',
                      border: '1px solid',
                      borderColor: 'warning.light',
                    }}
                  />
                </Stack>

                {/* Mockup Question */}
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2.5, lineHeight: 1.4 }}>
                  Which cellular organelle is responsible for generating the majority of chemical energy
                  (ATP) in human cells?
                </Typography>

                {/* Mockup Options */}
                <Stack spacing={1.5} sx={{ mb: 3 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 1.25,
                      border: '1.5px solid',
                      borderColor: 'divider',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      bgcolor: 'background.neutral',
                    }}
                  >
                    <Box
                      sx={{
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        border: '2px solid',
                        borderColor: 'text.disabled',
                      }}
                    />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Ribosome
                    </Typography>
                  </Box>

                  {/* Correct Option Highlight */}
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 1.25,
                      border: '1.5px solid',
                      borderColor: 'success.main',
                      bgcolor: 'success.lighter',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Box
                        sx={{
                          width: 22,
                          height: 22,
                          borderRadius: '50%',
                          bgcolor: 'success.main',
                          color: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Iconify icon="solar:check-read-bold" width={14} />
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: 'success.darker' }}>
                        Mitochondria (Correct)
                      </Typography>
                    </Stack>
                    <Iconify icon="solar:check-circle-bold" width={20} color="success.main" />
                  </Box>

                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 1.25,
                      border: '1.5px solid',
                      borderColor: 'divider',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      bgcolor: 'background.neutral',
                    }}
                  >
                    <Box
                      sx={{
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        border: '2px solid',
                        borderColor: 'text.disabled',
                      }}
                    />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Golgi apparatus
                    </Typography>
                  </Box>
                </Stack>

                {/* Explanation Snippet */}
                <Box
                  sx={{
                    p: 1.75,
                    borderRadius: 1,
                    bgcolor: 'background.neutral',
                    borderLeft: '4px solid',
                    borderColor: 'primary.main',
                  }}
                >
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                    <Iconify icon="solar:info-circle-bold" width={16} color="primary.main" />
                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'primary.dark' }}>
                      Teacher Explanation:
                    </Typography>
                  </Stack>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', lineHeight: 1.4 }}>
                    Mitochondria produce ATP through cellular respiration and oxidative phosphorylation,
                    known as the powerhouse of the cell.
                  </Typography>
                </Box>
              </Card>

              {/* Floating Timer Badge */}
              <Card
                sx={{
                  position: 'absolute',
                  bottom: -16,
                  left: -12,
                  zIndex: 2,
                  p: 1.25,
                  borderRadius: 1.5,
                  boxShadow: '0 10px 24px rgba(0, 0, 0, 0.1)',
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Iconify icon="solar:shield-check-bold" width={22} color="primary.main" />
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  Auto-Graded & Instant Keys
                </Typography>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

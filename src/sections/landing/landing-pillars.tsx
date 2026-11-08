import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

interface Props {
  onScrollToQuizzes?: () => void;
}

export function LandingPillars({ onScrollToQuizzes }: Props) {
  const pillars = [
    {
      title: 'Test your IQ & Skills!',
      subtitle: 'Diagnostic drills to identify knowledge gaps',
      image: '/assets/images/cover/cover-1.webp',
      badge: 'Quick Diagnostic',
      color: '#5BE49B',
    },
    {
      title: 'Learn & Master Concepts',
      subtitle: 'Detailed teacher explanations for each answer',
      image: '/assets/images/cover/cover-2.webp',
      badge: 'Teacher Guided',
      color: '#FEE140',
    },
    {
      title: 'Test Before You Sit Exam',
      subtitle: 'Simulate official exam hall countdown timers',
      image: '/assets/images/cover/cover-4.webp',
      badge: 'Exam Simulation',
      color: '#00B8D9',
    },
  ];

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        {/* Header (Matching Design 1) */}
        <Stack spacing={1.5} sx={{ textAlign: 'center', mb: { xs: 5, md: 7 } }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              fontSize: { xs: '2rem', md: '2.75rem' },
              color: 'text.primary',
              letterSpacing: -0.5,
            }}
          >
            Play, Learn and Master
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: 16 }}>
            Check yourself, how far can you reach?
          </Typography>
        </Stack>

        {/* 3 Tall Vertical Cards (Exact match to Design 1 cards) */}
        <Grid container spacing={3.5}>
          {pillars.map((item, idx) => (
            <Grid key={idx} size={{ xs: 12, md: 4 }}>
              <Card
                onClick={onScrollToQuizzes}
                sx={{
                  borderRadius: 3.5,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  position: 'relative',
                  height: { xs: 380, md: 450 },
                  boxShadow: '0 16px 36px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 24px 56px rgba(0, 167, 111, 0.28)',
                    '& .pillar-bg-img': {
                      transform: 'scale(1.08)',
                    },
                    '& .arrow-icon': {
                      transform: 'translateX(4px)',
                    },
                  },
                }}
              >
                {/* Background Photo */}
                <Box
                  component="img"
                  className="pillar-bg-img"
                  src={item.image}
                  alt={item.title}
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease',
                  }}
                />

                {/* Dark Gradient Overlay with Contrast */}
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(to bottom, rgba(5, 34, 25, 0.82) 0%, rgba(5, 34, 25, 0.3) 45%, rgba(5, 34, 25, 0.95) 100%)',
                  }}
                />

                {/* Content Overlay */}
                <Box
                  sx={{
                    position: 'relative',
                    zIndex: 2,
                    p: 3.5,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  {/* Top info */}
                  <Box>
                    <Box
                      sx={{
                        display: 'inline-block',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: '999px',
                        bgcolor: 'rgba(255, 255, 255, 0.18)',
                        backdropFilter: 'blur(8px)',
                        color: item.color,
                        fontWeight: 800,
                        fontSize: 12,
                        mb: 2,
                        border: '1px solid rgba(255, 255, 255, 0.25)',
                      }}
                    >
                      {item.badge}
                    </Box>
                    <Typography
                      variant="h4"
                      sx={{
                        color: 'common.white',
                        fontWeight: 900,
                        lineHeight: 1.25,
                        letterSpacing: -0.5,
                      }}
                    >
                      {item.title}
                    </Typography>
                  </Box>

                  {/* Bottom link */}
                  <Box>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.85)', mb: 2, lineHeight: 1.5 }}>
                      {item.subtitle}
                    </Typography>

                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: item.color,
                          fontWeight: 800,
                          fontSize: 14,
                        }}
                      >
                        Start now
                      </Typography>
                      <Iconify
                        className="arrow-icon"
                        icon="solar:arrow-right-bold"
                        width={18}
                        color={item.color}
                        sx={{ transition: 'transform 0.2s ease' }}
                      />
                    </Stack>
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}


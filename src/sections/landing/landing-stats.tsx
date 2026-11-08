import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const METRICS = [
  {
    icon: 'solar:document-text-bold-duotone',
    color: '#00A76F',
    bgColor: 'rgba(0, 167, 111, 0.12)',
    value: '100+',
    label: 'Curated Quizzes',
  },
  {
    icon: 'solar:users-group-two-rounded-bold-duotone',
    color: '#FFAB00',
    bgColor: 'rgba(255, 171, 0, 0.12)',
    value: '25,000+',
    label: 'Active Students',
  },
  {
    icon: 'solar:graph-up-bold-duotone',
    color: '#00B8D9',
    bgColor: 'rgba(0, 184, 217, 0.12)',
    value: '98%',
    label: 'Pass Rate Satisfaction',
  },
  {
    icon: 'solar:cup-star-bold-duotone',
    color: '#8E33FF',
    bgColor: 'rgba(142, 51, 255, 0.12)',
    value: '50,000+',
    label: 'Challenge Questions Solved',
  },
];

export function LandingStats() {
  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 6, md: 8 }} alignItems="center">
          {/* Left Column: Descriptive Editorial (Design 1 vibe) */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={2.5}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 900,
                  fontSize: { xs: '2rem', md: '2.75rem' },
                  color: 'text.primary',
                  letterSpacing: -0.5,
                  lineHeight: 1.2,
                }}
              >
                Progress and Success
              </Typography>

              <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: 16, lineHeight: 1.8 }}>
                Consistent timed practice is the single most effective way to eliminate exam stress and
                internalize critical concepts. mcqpro helps students turn revision from boring cramming into
                an engaging, measurable journey with instant auto-grading, rich rationales, and continuous
                rank tracking.
              </Typography>

              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: 15, lineHeight: 1.7 }}>
                Whether you are aiming for top island ranks or want to master fundamental concepts, our
                rigorous question pool prepares you for any exam scenario.
              </Typography>
            </Stack>
          </Grid>

          {/* Right Column: Clean Vertical Metric Stack (Design 1 vibe) */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={2}>
              {METRICS.map((metric, idx) => (
                <Box
                  key={idx}
                  sx={{
                    p: 2.5,
                    px: 3,
                    borderRadius: 2.5,
                    bgcolor: 'background.neutral',
                    border: '1px solid',
                    borderColor: 'divider',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.25s ease',
                    '&:hover': {
                      transform: 'translateX(6px)',
                      borderColor: 'primary.light',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)',
                    },
                  }}
                >
                  <Stack direction="row" spacing={2.5} alignItems="center">
                    <Box
                      sx={{
                        width: 50,
                        height: 50,
                        borderRadius: 2,
                        bgcolor: metric.bgColor,
                        color: metric.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Iconify icon={metric.icon} width={28} />
                    </Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'text.primary' }}>
                      {metric.label}
                    </Typography>
                  </Stack>

                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 900,
                      color: 'primary.main',
                      letterSpacing: -0.5,
                    }}
                  >
                    {metric.value}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}


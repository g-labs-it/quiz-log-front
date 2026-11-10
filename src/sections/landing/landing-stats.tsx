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
    color: '#36B37E',
    bgColor: 'rgba(54, 179, 126, 0.12)',
    value: '100+',
    label: 'Curated Exam Quizzes',
  },
  {
    icon: 'solar:users-group-two-rounded-bold-duotone',
    color: '#FDC745',
    bgColor: 'rgba(253, 199, 69, 0.2)',
    value: '25,000+',
    label: 'Registered Students',
  },
  {
    icon: 'solar:graph-up-bold-duotone',
    color: '#011738',
    bgColor: 'rgba(1, 23, 56, 0.1)',
    value: '98%',
    label: 'Pass Rate Satisfaction',
  },
  {
    icon: 'solar:cup-star-bold-duotone',
    color: '#9C5AFF',
    bgColor: 'rgba(156, 90, 255, 0.14)',
    value: '50,000+',
    label: 'Challenge Questions Solved',
  },
];

export function LandingStats() {
  return (
    <Box sx={{ py: { xs: 9, md: 14 }, bgcolor: '#F5F4EB', borderTop: '1px solid rgba(10, 10, 10, 0.06)' }}>
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 6, md: 8 }} alignItems="center">
          {/* Left Column: Descriptive Editorial */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={2.5}>
              <Box sx={{ display: 'inline-flex' }}>
                <Box
                  sx={{
                    px: 2,
                    py: 0.5,
                    borderRadius: '999px',
                    bgcolor: '#FFFFFF',
                    border: '1px solid rgba(10, 10, 10, 0.08)',
                    color: '#0A0A0A',
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    fontWeight: 700,
                    fontSize: '12px',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                  }}
                >
                  Measurable Impact
                </Box>
              </Box>
              <Typography
                sx={{
                  fontFamily: '"Plus Jakarta Sans", "DM Sans Variable", sans-serif',
                  fontWeight: 800,
                  fontSize: { xs: '2.2rem', md: '2.9rem' },
                  color: '#0A0A0A',
                  letterSpacing: '-0.035em',
                  lineHeight: 1.15,
                }}
              >
                Progress and Success
              </Typography>

              <Typography
                sx={{
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  color: '#637381',
                  fontSize: '16px',
                  lineHeight: 1.8,
                }}
              >
                Consistent timed practice is the single most effective way to eliminate exam stress and
                internalize critical concepts. mcqpro helps students turn revision from boring cramming into
                an engaging, measurable journey with instant auto-grading, rich rationales, and continuous
                rank tracking.
              </Typography>

              <Typography
                sx={{
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  color: '#637381',
                  fontSize: '15px',
                  lineHeight: 1.7,
                }}
              >
                Whether you are aiming for top national ranks or mastering foundational concepts, our
                rigorous question pool prepares you for any exam scenario.
              </Typography>
            </Stack>
          </Grid>

          {/* Right Column: Bauhaus Metric Stack */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={2.25}>
              {METRICS.map((metric, idx) => (
                <Box
                  key={idx}
                  sx={{
                    p: 2.75,
                    px: 3.25,
                    borderRadius: '22px',
                    bgcolor: '#FFFFFF',
                    border: '1px solid rgba(10, 10, 10, 0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    '&:hover': {
                      transform: 'translateX(6px)',
                      boxShadow: '0 12px 28px rgba(1, 23, 56, 0.08)',
                      borderColor: 'rgba(1, 23, 56, 0.15)',
                    },
                  }}
                >
                  <Stack direction="row" spacing={2.5} alignItems="center">
                    <Box
                      sx={{
                        width: 52,
                        height: 52,
                        borderRadius: '16px',
                        bgcolor: metric.bgColor,
                        color: metric.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Iconify icon={metric.icon} width={28} />
                    </Box>
                    <Typography
                      sx={{
                        fontFamily: '"Plus Jakarta Sans", sans-serif',
                        fontWeight: 700,
                        fontSize: '15.5px',
                        color: '#0A0A0A',
                      }}
                    >
                      {metric.label}
                    </Typography>
                  </Stack>

                  <Typography
                    sx={{
                      fontFamily: '"Plus Jakarta Sans", "DM Sans Variable", sans-serif',
                      fontWeight: 800,
                      fontSize: '1.75rem',
                      color: metric.color === '#FDC745' ? '#D97706' : metric.color,
                      letterSpacing: '-0.02em',
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

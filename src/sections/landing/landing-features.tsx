import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const FEATURES = [
  {
    icon: 'solar:clock-circle-bold-duotone',
    color: '#00A76F',
    bgColor: 'rgba(0, 167, 111, 0.12)',
    title: 'Simulated Timed Exams',
    description:
      'Experience real exam pressure with dynamic countdown timers, question jumping, and auto-submit protection that keeps your answers safe.',
  },
  {
    icon: 'solar:lightbulb-bolt-bold-duotone',
    color: '#FFAB00',
    bgColor: 'rgba(255, 171, 0, 0.12)',
    title: 'Instant Explanations',
    description:
      'Never wonder why an answer was wrong. Every question provides teacher-authored step-by-step explanations right upon completion.',
  },
  {
    icon: 'solar:flag-bold-duotone',
    color: '#00B8D9',
    bgColor: 'rgba(0, 184, 217, 0.12)',
    title: 'Flag & Review Workflow',
    description:
      'Flag uncertain questions during tests and review them before submitting using the interactive question status indicator grid.',
  },
  {
    icon: 'solar:chart-2-bold-duotone',
    color: '#8E33FF',
    bgColor: 'rgba(142, 51, 255, 0.12)',
    title: 'Detailed Performance Analytics',
    description:
      'Track your marks, passing rates, time taken per quiz, and improvement history across multiple practice attempts.',
  },
];

export function LandingFeatures() {
  return (
    <Box id="features" sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Stack spacing={2} sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
          <Box sx={{ display: 'inline-flex', justifyContent: 'center' }}>
            <Chip
              label="Engineered for Students"
              size="small"
              sx={{
                px: 1,
                py: 0.5,
                fontWeight: 700,
                borderRadius: 1,
                bgcolor: 'primary.lighter',
                color: 'primary.darker',
                fontSize: 12,
              }}
            />
          </Box>
          <Typography variant="h2" sx={{ fontWeight: 800, fontSize: { xs: '2rem', md: '2.75rem' } }}>
            Why Students Succeed with mcqpro
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 600, mx: 'auto', fontSize: 16 }}>
            Designed from the ground up to eliminate exam anxiety and build genuine confidence through
            guided, interactive testing.
          </Typography>
        </Stack>

        {/* Feature Cards Grid */}
        <Grid container spacing={3.5}>
          {FEATURES.map((feature, idx) => (
            <Grid key={idx} size={{ xs: 12, sm: 6, md: 3 }}>
              <Card
                sx={{
                  p: 3.5,
                  height: '100%',
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  bgcolor: 'background.paper',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: '0 16px 32px rgba(0, 0, 0, 0.08)',
                    borderColor: 'primary.light',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 1.5,
                    bgcolor: feature.bgColor,
                    color: feature.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2.5,
                  }}
                >
                  <Iconify icon={feature.icon} width={32} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.25, fontSize: '1.1rem' }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                  {feature.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}


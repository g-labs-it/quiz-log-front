import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const STEPS = [
  {
    step: '01',
    title: 'Choose a Practice Quiz',
    desc: 'Browse our catalog of public quizzes or access assigned exams from your school, institute, or teacher.',
    icon: 'solar:folder-with-files-bold-duotone',
  },
  {
    step: '02',
    title: 'Answer Under Timed Conditions',
    desc: 'Navigate questions smoothly, flag tricky ones for later, and practice staying calm with our live countdown timer.',
    icon: 'solar:pen-new-square-bold-duotone',
  },
  {
    step: '03',
    title: 'Get Instant Score & Keys',
    desc: 'Receive immediate automatic grading, view pass/fail statistics, and read teacher explanations for every question.',
    icon: 'solar:diploma-verified-bold-duotone',
  },
];

export function LandingHowItWorks() {
  return (
    <Box id="how-it-works" sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.neutral' }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Stack spacing={2} sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
          <Box sx={{ display: 'inline-flex', justifyContent: 'center' }}>
            <Chip
              label="Simple 3-Step Process"
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
            How mcqpro Works
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 580, mx: 'auto', fontSize: 16 }}>
            Getting exam-ready is effortless. Just three simple steps stand between you and your top grades.
          </Typography>
        </Stack>

        {/* Steps Grid */}
        <Grid container spacing={4}>
          {STEPS.map((stepItem, idx) => (
            <Grid key={idx} size={{ xs: 12, md: 4 }}>
              <Card
                sx={{
                  p: 4,
                  height: '100%',
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  position: 'relative',
                  overflow: 'visible',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: '0 16px 32px rgba(0, 0, 0, 0.08)',
                  },
                }}
              >
                {/* Step Number Badge */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: -16,
                    left: 28,
                    bgcolor: 'primary.main',
                    color: 'common.white',
                    fontWeight: 900,
                    fontSize: 14,
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 1,
                    boxShadow: '0 4px 12px rgba(0, 167, 111, 0.35)',
                  }}
                >
                  Step {stepItem.step}
                </Box>

                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: 1.5,
                    bgcolor: 'primary.lighter',
                    color: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2.5,
                    mt: 1,
                  }}
                >
                  <Iconify icon={stepItem.icon} width={28} />
                </Box>

                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.25 }}>
                  {stepItem.title}
                </Typography>

                <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                  {stepItem.desc}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

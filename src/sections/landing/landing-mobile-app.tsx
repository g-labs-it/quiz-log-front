import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

interface Props {
  onScrollToQuizzes?: () => void;
}

export function LandingMobileApp({ onScrollToQuizzes }: Props) {
  return (
    <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Card
          sx={{
            borderRadius: 4,
            background: 'linear-gradient(135deg, #052219 0%, #004B3E 45%, #007867 100%)',
            color: 'common.white',
            p: { xs: 4, sm: 6, md: 7 },
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 24px 60px rgba(0, 75, 62, 0.3)',
            border: '2px solid rgba(255, 255, 255, 0.15)',
          }}
        >
          {/* Subtle Ambient Glow */}
          <Box
            sx={{
              position: 'absolute',
              top: -80,
              right: -80,
              width: 320,
              height: 320,
              borderRadius: '50%',
              bgcolor: 'rgba(91, 228, 155, 0.15)',
              filter: 'blur(60px)',
              pointerEvents: 'none',
            }}
          />

          <Grid container spacing={4} alignItems="center">
            {/* Left Column: Text & Features */}
            <Grid size={{ xs: 12, md: 7 }}>
              <Stack spacing={2.5}>
                <Box>
                  <Chip
                    icon={<Iconify icon="solar:devices-bold" width={16} color="#FEE140" />}
                    label="Multi-Device Experience"
                    size="small"
                    sx={{
                      borderRadius: '999px',
                      fontWeight: 800,
                      bgcolor: 'rgba(255, 255, 255, 0.12)',
                      color: '#FEE140',
                      border: '1px solid rgba(255, 255, 255, 0.25)',
                    }}
                  />
                </Box>

                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 900,
                    fontSize: { xs: '1.85rem', sm: '2.5rem', md: '2.75rem' },
                    lineHeight: 1.15,
                  }}
                >
                  Practice, Gain Skills Right Here — On Any Device.
                </Typography>

                <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: 16, lineHeight: 1.6, maxWidth: 520 }}>
                  mcqpro is built with zero app installation required. Open in any smartphone, tablet, or
                  computer browser, and experience smooth 60fps animations, instant answer saving, and
                  reliable countdown timers.
                </Typography>

                <Stack direction="row" spacing={2} sx={{ pt: 1 }}>
                  <Button
                    size="large"
                    variant="contained"
                    onClick={onScrollToQuizzes}
                    startIcon={<Iconify icon="solar:play-circle-bold" />}
                    sx={{
                      borderRadius: '999px',
                      fontWeight: 800,
                      px: 3.5,
                      py: 1.4,
                      bgcolor: '#FEE140',
                      color: '#07271E',
                      '&:hover': { bgcolor: '#FFE066' },
                    }}
                  >
                    Start Practicing Free
                  </Button>
                </Stack>
              </Stack>
            </Grid>

            {/* Right Column: Smartphone Mockup Frame (Design 1 vibe) */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Box
                sx={{
                  maxWidth: 280,
                  mx: 'auto',
                  borderRadius: 4,
                  bgcolor: '#0B1A14',
                  p: 1.5,
                  boxShadow: '0 20px 48px rgba(0, 0, 0, 0.4)',
                  border: '3px solid rgba(255, 255, 255, 0.3)',
                  position: 'relative',
                }}
              >
                {/* Phone Speaker Notch */}
                <Box
                  sx={{
                    width: 70,
                    height: 5,
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: 3,
                    mx: 'auto',
                    mb: 1.5,
                  }}
                />

                {/* Screen Content */}
                <Box
                  sx={{
                    borderRadius: 3,
                    bgcolor: '#041F16',
                    p: 2,
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#5BE49B' }}>
                      mcqpro Live
                    </Typography>
                    <Chip label="24:50" size="small" sx={{ height: 20, fontSize: 10, bgcolor: 'rgba(255,255,255,0.15)', color: '#FFF' }} />
                  </Stack>

                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#FFF', display: 'block', mb: 1.5, fontSize: 11, lineHeight: 1.3 }}>
                    Q3: What gas is released during photosynthesis?
                  </Typography>

                  <Stack spacing={0.75} sx={{ mb: 2 }}>
                    <Box sx={{ p: 0.8, px: 1.2, borderRadius: 1.5, bgcolor: 'rgba(255,255,255,0.08)', fontSize: 10 }}>
                      A. Carbon Dioxide
                    </Box>
                    <Box sx={{ p: 0.8, px: 1.2, borderRadius: 1.5, bgcolor: '#5BE49B', color: '#004B3E', fontWeight: 800, fontSize: 10, display: 'flex', justifyContent: 'space-between' }}>
                      <span>B. Oxygen (O2)</span>
                      <Iconify icon="solar:check-circle-bold" width={14} />
                    </Box>
                    <Box sx={{ p: 0.8, px: 1.2, borderRadius: 1.5, bgcolor: 'rgba(255,255,255,0.08)', fontSize: 10 }}>
                      C. Nitrogen
                    </Box>
                  </Stack>

                  <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: 'rgba(0, 167, 111, 0.2)', border: '1px solid rgba(91, 228, 155, 0.3)' }}>
                    <Typography variant="caption" sx={{ fontSize: 9.5, color: '#5BE49B', display: 'block', fontWeight: 700 }}>
                      ✓ Instant Rationale:
                    </Typography>
                    <Typography variant="caption" sx={{ fontSize: 9, color: 'rgba(255,255,255,0.8)', display: 'block', lineHeight: 1.2 }}>
                      Plants release oxygen during the light-dependent reactions of photosynthesis.
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Card>
      </Container>
    </Box>
  );
}


import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
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
    <Box sx={{ py: { xs: 9, md: 12 }, bgcolor: '#FFFFFF', borderTop: '1px solid rgba(10, 10, 10, 0.06)' }}>
      <Container maxWidth="lg">
        <Card
          sx={{
            borderRadius: '32px',
            bgcolor: '#011738',
            color: '#FFFFFF',
            p: { xs: 4, sm: 6, md: 7 },
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 24px 60px rgba(1, 23, 56, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          {/* Subtle Ambient Bauhaus Glow */}
          <Box
            sx={{
              position: 'absolute',
              top: -80,
              right: -80,
              width: 320,
              height: 320,
              borderRadius: '50%',
              bgcolor: 'rgba(67, 97, 242, 0.2)',
              filter: 'blur(70px)',
              pointerEvents: 'none',
            }}
          />

          <Grid container spacing={4} alignItems="center">
            {/* Left Column: Text & Features */}
            <Grid size={{ xs: 12, md: 7 }}>
              <Stack spacing={2.5}>
                <Box>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 0.85,
                      px: 2,
                      py: 0.6,
                      borderRadius: '999px',
                      bgcolor: 'rgba(253, 199, 69, 0.15)',
                      color: '#FDC745',
                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                      fontWeight: 700,
                      fontSize: '12px',
                      border: '1px solid rgba(253, 199, 69, 0.3)',
                    }}
                  >
                    <Iconify icon="solar:devices-bold" width={16} color="#FDC745" />
                    Multi-Device Experience
                  </Box>
                </Box>

                <Typography
                  sx={{
                    fontFamily: '"Plus Jakarta Sans", "DM Sans Variable", sans-serif',
                    fontWeight: 800,
                    fontSize: { xs: '1.9rem', sm: '2.5rem', md: '2.8rem' },
                    lineHeight: 1.15,
                    letterSpacing: '-0.035em',
                  }}
                >
                  Practice, Gain Skills Right Here — On Any Device.
                </Typography>

                <Typography
                  sx={{
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    color: 'rgba(255, 255, 255, 0.82)',
                    fontSize: { xs: '15px', md: '16.5px' },
                    lineHeight: 1.65,
                    maxWidth: 520,
                  }}
                >
                  mcqpro is built with zero app installation required. Open in any smartphone, tablet, or
                  computer browser, and experience silky 60fps responsiveness, instant answer saving, and
                  reliable countdown timers.
                </Typography>

                <Stack direction="row" spacing={2} sx={{ pt: 1 }}>
                  <Button
                    size="large"
                    onClick={onScrollToQuizzes}
                    startIcon={<Iconify icon="solar:play-circle-bold" />}
                    sx={{
                      borderRadius: '999px',
                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                      fontWeight: 700,
                      fontSize: '15px',
                      px: 4,
                      py: 1.5,
                      height: 52,
                      bgcolor: '#FDC745',
                      color: '#0A0A0A',
                      textTransform: 'none',
                      boxShadow: '0 8px 20px rgba(253, 199, 69, 0.3)',
                      transition: 'all 0.25s ease',
                      '&:hover': {
                        bgcolor: '#FFFFFF',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    Start Practicing Free
                  </Button>
                </Stack>
              </Stack>
            </Grid>

            {/* Right Column: Smartphone Mockup Frame */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Box
                sx={{
                  maxWidth: 290,
                  mx: 'auto',
                  borderRadius: '30px',
                  bgcolor: '#000D20',
                  p: 1.6,
                  boxShadow: '0 24px 56px rgba(0, 0, 0, 0.45)',
                  border: '3px solid rgba(255, 255, 255, 0.2)',
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
                    borderRadius: '20px',
                    bgcolor: '#011738',
                    p: 2,
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                    <Typography
                      sx={{
                        fontFamily: '"Plus Jakarta Sans", sans-serif',
                        fontWeight: 800,
                        color: '#FDC745',
                        fontSize: '12px',
                      }}
                    >
                      mcqpro Live
                    </Typography>
                    <Box
                      sx={{
                        px: 1,
                        py: 0.2,
                        borderRadius: '999px',
                        fontSize: 10,
                        bgcolor: 'rgba(255,255,255,0.15)',
                        color: '#FFF',
                        fontFamily: 'monospace',
                      }}
                    >
                      24:50
                    </Box>
                  </Stack>

                  <Typography
                    sx={{
                      fontWeight: 700,
                      color: '#FFF',
                      display: 'block',
                      mb: 1.5,
                      fontSize: 11.5,
                      lineHeight: 1.35,
                    }}
                  >
                    Q3: What gas is released during the light reactions of photosynthesis?
                  </Typography>

                  <Stack spacing={0.75} sx={{ mb: 2 }}>
                    <Box sx={{ p: 0.9, px: 1.2, borderRadius: 1.5, bgcolor: 'rgba(255,255,255,0.08)', fontSize: 10.5 }}>
                      A. Carbon Dioxide
                    </Box>
                    <Box
                      sx={{
                        p: 0.9,
                        px: 1.2,
                        borderRadius: 1.5,
                        bgcolor: '#4361F2',
                        color: '#FFFFFF',
                        fontWeight: 700,
                        fontSize: 10.5,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span>B. Oxygen (O2)</span>
                      <Iconify icon="solar:check-circle-bold" width={14} color="#FDC745" />
                    </Box>
                    <Box sx={{ p: 0.9, px: 1.2, borderRadius: 1.5, bgcolor: 'rgba(255,255,255,0.08)', fontSize: 10.5 }}>
                      C. Nitrogen
                    </Box>
                  </Stack>

                  <Box sx={{ p: 1.2, borderRadius: 1.5, bgcolor: 'rgba(67, 97, 242, 0.2)', border: '1px solid rgba(67, 97, 242, 0.35)' }}>
                    <Typography sx={{ fontSize: 10, color: '#FDC745', display: 'block', fontWeight: 800 }}>
                      ✓ Instant Rationale:
                    </Typography>
                    <Typography sx={{ fontSize: 9.5, color: 'rgba(255,255,255,0.85)', display: 'block', lineHeight: 1.3, mt: 0.25 }}>
                      Photolysis of water in Photosystem II splits H2O molecules and evolves O2 gas.
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

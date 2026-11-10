import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function LandingStudentMosaic() {
  return (
    <Box sx={{ py: { xs: 9, md: 14 }, bgcolor: '#F5F4EB', borderTop: '1px solid rgba(10, 10, 10, 0.06)' }}>
      <Container maxWidth="lg">
        {/* Header - 100% Centered */}
        <Stack
          spacing={1.75}
          alignItems="center"
          justifyContent="center"
          sx={{ textAlign: 'center', mb: { xs: 6, md: 8 }, width: '100%' }}
        >
          <Box sx={{ display: 'inline-flex', justifyContent: 'center' }}>
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
                display: 'flex',
                alignItems: 'center',
                gap: 0.85,
              }}
            >
              <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: '#36B37E' }} />
              Proven Results
            </Box>
          </Box>
          <Typography
            sx={{
              fontFamily: '"Plus Jakarta Sans", "DM Sans Variable", sans-serif',
              fontWeight: 800,
              fontSize: { xs: '2.2rem', md: '2.9rem' },
              color: '#0A0A0A',
              letterSpacing: '-0.035em',
              textAlign: 'center',
              width: '100%',
            }}
          >
            Be the Top on the List
          </Typography>
          <Typography
            sx={{
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              color: '#637381',
              maxWidth: 580,
              mx: 'auto',
              textAlign: 'center',
              width: '100%',
              fontSize: { xs: '15px', md: '16.5px' },
            }}
          >
            Top scores are earned through consistent daily drills. Join a community of thousands
            achieving their dream exam percentiles.
          </Typography>
        </Stack>

        {/* Asymmetrical Bauhaus Photo & Color Grid */}
        <Box sx={{ maxWidth: 920, mx: 'auto' }}>
          <Grid container spacing={2.5}>
            {/* Col 1 */}
            <Grid size={{ xs: 6, sm: 3 }}>
              <Stack spacing={2.5}>
                <Box
                  component="img"
                  src="/assets/images/cover/cover-5.webp"
                  alt="Student achiever"
                  sx={{
                    width: '100%',
                    height: 180,
                    objectFit: 'cover',
                    borderRadius: '22px',
                    boxShadow: '0 8px 24px rgba(1, 23, 56, 0.08)',
                    border: '1px solid rgba(1, 23, 56, 0.06)',
                  }}
                />
                <Box
                  sx={{
                    height: 140,
                    borderRadius: '22px',
                    bgcolor: '#011738',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    p: 2,
                    textAlign: 'center',
                    boxShadow: '0 12px 28px rgba(1, 23, 56, 0.15)',
                  }}
                >
                  <Iconify icon="solar:medal-ribbons-star-bold" width={32} color="#FDC745" />
                  <Typography
                    sx={{
                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                      fontWeight: 800,
                      fontSize: '15px',
                      mt: 1,
                      color: '#FFFFFF',
                    }}
                  >
                    Grade A Pass
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.75)',
                    }}
                  >
                    National Rank #12
                  </Typography>
                </Box>
              </Stack>
            </Grid>

            {/* Col 2 */}
            <Grid size={{ xs: 6, sm: 3 }}>
              <Stack spacing={2.5}>
                <Box
                  sx={{
                    height: 140,
                    borderRadius: '22px',
                    bgcolor: '#36B37E',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    p: 2,
                    textAlign: 'center',
                    boxShadow: '0 12px 28px rgba(54, 179, 126, 0.25)',
                  }}
                >
                  <Iconify icon="solar:stars-bold" width={32} color="#FDC745" />
                  <Typography
                    sx={{
                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                      fontWeight: 800,
                      fontSize: '15px',
                      mt: 1,
                      color: '#FFFFFF',
                    }}
                  >
                    100% Mastery
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.85)',
                    }}
                  >
                    STEM & Science Stream
                  </Typography>
                </Box>
                <Box
                  component="img"
                  src="/assets/images/cover/cover-6.webp"
                  alt="Student study session"
                  sx={{
                    width: '100%',
                    height: 180,
                    objectFit: 'cover',
                    borderRadius: '22px',
                    boxShadow: '0 8px 24px rgba(1, 23, 56, 0.08)',
                    border: '1px solid rgba(1, 23, 56, 0.06)',
                  }}
                />
              </Stack>
            </Grid>

            {/* Col 3 */}
            <Grid size={{ xs: 6, sm: 3 }}>
              <Stack spacing={2.5}>
                <Box
                  sx={{
                    height: 110,
                    borderRadius: '22px',
                    bgcolor: '#FDC745',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#0A0A0A',
                    p: 2,
                    boxShadow: '0 10px 24px rgba(253, 199, 69, 0.3)',
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                      fontWeight: 900,
                      fontSize: '1.75rem',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    ★ 5.0 Rating
                  </Typography>
                </Box>
                <Box
                  component="img"
                  src="/assets/images/cover/cover-7.webp"
                  alt="Exam top scorer"
                  sx={{
                    width: '100%',
                    height: 210,
                    objectFit: 'cover',
                    borderRadius: '22px',
                    boxShadow: '0 8px 24px rgba(1, 23, 56, 0.08)',
                    border: '1px solid rgba(1, 23, 56, 0.06)',
                  }}
                />
              </Stack>
            </Grid>

            {/* Col 4 */}
            <Grid size={{ xs: 6, sm: 3 }}>
              <Box
                component="img"
                src="/assets/images/cover/cover-8.webp"
                alt="Smiling triumphant student"
                sx={{
                  width: '100%',
                  height: 345,
                  objectFit: 'cover',
                  borderRadius: '22px',
                  boxShadow: '0 12px 32px rgba(1, 23, 56, 0.12)',
                  border: '1px solid rgba(1, 23, 56, 0.06)',
                }}
              />
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}

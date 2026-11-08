import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

const STEPS = [
  {
    step: 'Step 1',
    title: 'Enter the Quiz',
    desc: 'Select from thousands of public quizzes or tests assigned by your teacher.',
    image: '/assets/images/cover/cover-9.webp',
  },
  {
    step: 'Step 2',
    title: 'Play the Game & Solve',
    desc: 'Answer under countdown pressure, flag questions, and test your speed.',
    image: '/assets/images/cover/cover-10.webp',
  },
  {
    step: 'Step 3',
    title: 'Gain, Win & Excel',
    desc: 'Get instant auto-graded scores, detailed answer keys, and leaderboard ranks.',
    image: '/assets/images/cover/cover-11.webp',
  },
];

export function LandingHowItWorks() {
  return (
    <Box id="how-it-works" sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.neutral' }}>
      <Container maxWidth="lg">
        {/* Header (Matching Design 1) */}
        <Stack spacing={1.5} sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              fontSize: { xs: '2rem', md: '2.75rem' },
              color: 'text.primary',
              letterSpacing: -0.5,
            }}
          >
            Here&apos;s How It Works
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 620, mx: 'auto', fontSize: 16 }}>
            Getting exam-ready is effortless. Just three simple steps stand between you and your top grades.
          </Typography>
        </Stack>

        {/* 3 Process Cards with Photos & Yellow Base (Exact Design 1 look) */}
        <Grid container spacing={3.5}>
          {STEPS.map((item, idx) => (
            <Grid key={idx} size={{ xs: 12, md: 4 }}>
              <Card
                sx={{
                  borderRadius: 3.5,
                  overflow: 'hidden',
                  bgcolor: 'background.paper',
                  boxShadow: '0 12px 28px rgba(0, 0, 0, 0.08)',
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: '0 20px 48px rgba(0, 0, 0, 0.14)',
                  },
                }}
              >
                {/* Photo Header */}
                <Box
                  component="img"
                  src={item.image}
                  alt={item.title}
                  sx={{
                    width: '100%',
                    height: 200,
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />

                {/* Vibrant Yellow/Lime Bottom Highlight Box (Design 1 vibe) */}
                <Box
                  sx={{
                    bgcolor: '#FEE140',
                    backgroundImage: 'linear-gradient(135deg, #FFE066 0%, #FEE140 100%)',
                    p: 3,
                    color: '#07271E',
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 900,
                      textTransform: 'uppercase',
                      letterSpacing: 1,
                      display: 'block',
                      mb: 0.5,
                      color: '#4B3600',
                      fontSize: 11,
                    }}
                  >
                    {item.step}
                  </Typography>

                  <Typography variant="h6" sx={{ fontWeight: 900, mb: 1, color: '#07271E' }}>
                    {item.title}
                  </Typography>

                  <Typography variant="body2" sx={{ color: '#2B2300', lineHeight: 1.5, fontSize: 13.5 }}>
                    {item.desc}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

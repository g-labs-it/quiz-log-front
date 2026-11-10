import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

const STEPS = [
  {
    step: 'Step 01',
    title: 'Enter the Quiz',
    desc: 'Select from thousands of verified public quizzes or take targeted tests assigned by your teacher.',
    accentColor: '#36B37E',
    accentBg: 'rgba(54, 179, 126, 0.12)',
    boxBg: '#EAF8F1',
    renderIllustration: () => (
      <svg width="100%" height="100%" viewBox="0 0 320 180" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="160" cy="90" r="60" fill="rgba(54, 179, 126, 0.15)" />
        {/* Quiz Catalog Card */}
        <g filter="drop-shadow(0 6px 14px rgba(1, 23, 56, 0.08))">
          <rect x="100" y="42" width="120" height="96" rx="14" fill="#FFFFFF" stroke="rgba(54, 179, 126, 0.25)" strokeWidth="1.5" />
          <rect x="112" y="56" width="34" height="6" rx="3" fill="#36B37E" />
          <rect x="112" y="68" width="80" height="7" rx="3.5" fill="#011738" />
          <rect x="112" y="80" width="60" height="5" rx="2.5" fill="#94A3B8" />
          {/* Question Count Pill */}
          <rect x="112" y="96" width="46" height="18" rx="9" fill="#EAF8F1" />
          <text x="120" y="109" fill="#1B806A" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="800" fontSize="9">
            50 Qs
          </text>
          {/* Select button */}
          <rect x="166" y="96" width="42" height="18" rx="9" fill="#36B37E" />
          <text x="174" y="108" fill="#FFFFFF" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="700" fontSize="8.5">
            Start →
          </text>
        </g>
        {/* Floating Search Pill Left */}
        <g filter="drop-shadow(0 4px 10px rgba(1, 23, 56, 0.08))">
          <rect x="24" y="70" width="86" height="42" rx="12" fill="#FFFFFF" />
          <circle cx="44" cy="91" r="10" fill="#EAF8F1" />
          <circle cx="42" cy="89" r="4.5" stroke="#36B37E" strokeWidth="1.5" />
          <line x1="45" y1="92" x2="48" y2="95" stroke="#36B37E" strokeWidth="1.5" strokeLinecap="round" />
          <text x="60" y="88" fill="#0A0A0A" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="800" fontSize="11">
            Browse
          </text>
          <text x="60" y="100" fill="#637381" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="600" fontSize="8.5">
            100+ Topics
          </text>
        </g>
        {/* Floating Verified Badge Right */}
        <g filter="drop-shadow(0 4px 10px rgba(1, 23, 56, 0.08))">
          <rect x="210" y="68" width="86" height="42" rx="12" fill="#FFFFFF" />
          <path d="M224 91 L228 95 L235 87" stroke="#36B37E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <text x="242" y="87" fill="#0A0A0A" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="800" fontSize="10.5">
            Verified
          </text>
          <text x="242" y="99" fill="#36B37E" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="700" fontSize="8.5">
            Educators
          </text>
        </g>
      </svg>
    ),
  },
  {
    step: 'Step 02',
    title: 'Play & Solve Under Pressure',
    desc: 'Answer under real countdown timers, flag challenging questions, and test your exam pace.',
    accentColor: '#FDC745',
    accentBg: 'rgba(253, 199, 69, 0.2)',
    boxBg: '#FEF9E7',
    renderIllustration: () => (
      <svg width="100%" height="100%" viewBox="0 0 320 180" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="160" cy="90" r="60" fill="rgba(253, 199, 69, 0.2)" />
        {/* Interactive Question Card */}
        <g filter="drop-shadow(0 6px 14px rgba(1, 23, 56, 0.08))">
          <rect x="94" y="38" width="132" height="104" rx="14" fill="#FFFFFF" stroke="rgba(253, 199, 69, 0.4)" strokeWidth="1.5" />
          {/* Header */}
          <rect x="108" y="50" width="36" height="6" rx="3" fill="#B45309" />
          <rect x="108" y="62" width="104" height="8" rx="4" fill="#011738" />
          {/* Option A (Unselected) */}
          <rect x="108" y="78" width="104" height="16" rx="8" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
          <circle cx="118" cy="86" r="4" fill="#CBD5E1" />
          <line x1="128" y1="86" x2="190" y2="86" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
          {/* Option B (Selected with Green/Gold glow) */}
          <rect x="108" y="98" width="104" height="18" rx="9" fill="#36B37E" />
          <circle cx="118" cy="107" r="4" fill="#FFFFFF" />
          <line x1="128" y1="107" x2="196" y2="107" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          <path d="M198 107 L200 109 L204 105" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
        </g>
        {/* Floating Timer Badge Left */}
        <g filter="drop-shadow(0 4px 10px rgba(1, 23, 56, 0.08))">
          <rect x="20" y="68" width="86" height="44" rx="12" fill="#FFFFFF" />
          <circle cx="36" cy="90" r="8" fill="#FEF3C7" />
          <path d="M36 86 L36 90 L39 90" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" />
          <text x="49" y="87" fill="#0A0A0A" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="800" fontSize="11">
            24:50
          </text>
          <text x="49" y="99" fill="#D97706" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="700" fontSize="8.5">
            Live Timer
          </text>
        </g>
        {/* Floating Flag Badge Right */}
        <g filter="drop-shadow(0 4px 10px rgba(1, 23, 56, 0.08))">
          <rect x="214" y="68" width="86" height="44" rx="12" fill="#FFFFFF" />
          <circle cx="230" cy="90" r="8" fill="#FEE2E2" />
          <path d="M228 85 L234 88 L228 91 L228 95" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <text x="243" y="87" fill="#0A0A0A" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="800" fontSize="11">
            Flagged
          </text>
          <text x="243" y="99" fill="#EF4444" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="700" fontSize="8.5">
            Review Q4
          </text>
        </g>
      </svg>
    ),
  },
  {
    step: 'Step 03',
    title: 'Gain, Win & Excel',
    desc: 'Receive instant auto-graded scores, deep step-by-step answer keys, and leaderboard ranks.',
    accentColor: '#4361F2',
    accentBg: 'rgba(67, 97, 242, 0.12)',
    boxBg: '#EEF2FF',
    renderIllustration: () => (
      <svg width="100%" height="100%" viewBox="0 0 320 180" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="160" cy="90" r="60" fill="rgba(67, 97, 242, 0.12)" />
        {/* Results Victory Podium & Trophy */}
        <g filter="drop-shadow(0 6px 16px rgba(1, 23, 56, 0.1))">
          {/* Gold Trophy */}
          <path d="M148 50 L172 50 C172 64 164 70 160 70 C156 70 148 64 148 50 Z" fill="#FDC745" />
          <path d="M148 53 C142 53 140 60 148 62" stroke="#FDC745" strokeWidth="2" strokeLinecap="round" />
          <path d="M172 53 C178 53 180 60 172 62" stroke="#FDC745" strokeWidth="2" strokeLinecap="round" />
          <rect x="157" y="70" width="6" height="10" fill="#E5A817" />
          <rect x="150" y="80" width="20" height="5" rx="2" fill="#011738" />
          {/* Podium base */}
          <rect x="135" y="85" width="50" height="52" rx="8" fill="#36B37E" />
          <text x="154" y="118" fill="#FFFFFF" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="900" fontSize="24">
            1
          </text>
        </g>
        {/* Floating Score Badge Left */}
        <g filter="drop-shadow(0 4px 10px rgba(1, 23, 56, 0.08))">
          <rect x="20" y="68" width="90" height="46" rx="12" fill="#FFFFFF" />
          <circle cx="38" cy="91" r="9" fill="#EAF8F1" />
          <path d="M35 91 L37 93 L41 89" stroke="#36B37E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <text x="52" y="87" fill="#0A0A0A" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="800" fontSize="11">
            Score: 100%
          </text>
          <text x="52" y="99" fill="#36B37E" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="700" fontSize="8.5">
            50/50 Marks
          </text>
        </g>
        {/* Floating Rank Badge Right */}
        <g filter="drop-shadow(0 4px 10px rgba(1, 23, 56, 0.08))">
          <rect x="212" y="68" width="90" height="46" rx="12" fill="#FFFFFF" />
          <circle cx="230" cy="91" r="9" fill="#FEF3C7" />
          <text x="227" y="95" fill="#D97706" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="800" fontSize="11">
            🏆
          </text>
          <text x="244" y="87" fill="#0A0A0A" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="800" fontSize="11">
            Island Rank
          </text>
          <text x="244" y="99" fill="#4361F2" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="700" fontSize="8.5">
            Top #1 Scorer
          </text>
        </g>
      </svg>
    ),
  },
];

export function LandingHowItWorks() {
  return (
    <Box id="how-it-works" sx={{ py: { xs: 9, md: 14 }, bgcolor: '#FFFFFF', borderTop: '1px solid rgba(10, 10, 10, 0.06)' }}>
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
                bgcolor: '#F5F4EB',
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
              Simple 3-Step Process
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
            Here&apos;s How It Works
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
            Getting exam-ready is effortless. Just three simple steps stand between you and your top grades.
          </Typography>
        </Stack>

        {/* 3 Process Cards with Flat Vector Illustrations */}
        <Grid container spacing={3.5}>
          {STEPS.map((item, idx) => (
            <Grid key={idx} size={{ xs: 12, md: 4 }}>
              <Card
                sx={{
                  borderRadius: '28px',
                  overflow: 'hidden',
                  bgcolor: '#FFFFFF',
                  boxShadow: '0 10px 30px rgba(1, 23, 56, 0.05)',
                  border: '1.5px solid rgba(10, 10, 10, 0.08)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: '0 20px 44px rgba(1, 23, 56, 0.12)',
                    borderColor: 'rgba(10, 10, 10, 0.18)',
                    '& .step-illustration': {
                      transform: 'scale(1.03)',
                    },
                  },
                }}
              >
                {/* Flat Vector Illustration Header */}
                <Box
                  sx={{
                    height: 190,
                    bgcolor: item.boxBg,
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    borderBottom: '1px solid rgba(10, 10, 10, 0.06)',
                  }}
                >
                  <Box
                    className="step-illustration"
                    sx={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  >
                    {item.renderIllustration()}
                  </Box>
                </Box>

                {/* Content */}
                <Box sx={{ p: 3.5, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box
                    sx={{
                      display: 'inline-block',
                      alignSelf: 'flex-start',
                      px: 1.5,
                      py: 0.45,
                      borderRadius: '999px',
                      bgcolor: item.accentBg,
                      color: item.accentColor === '#FDC745' ? '#B45309' : item.accentColor,
                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                      fontWeight: 800,
                      fontSize: '11.5px',
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      mb: 1.5,
                    }}
                  >
                    {item.step}
                  </Box>

                  <Typography
                    sx={{
                      fontFamily: '"Plus Jakarta Sans", "DM Sans Variable", sans-serif',
                      fontWeight: 800,
                      fontSize: '1.25rem',
                      mb: 1.25,
                      color: '#0A0A0A',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {item.title}
                  </Typography>

                  <Typography
                    sx={{
                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                      color: '#637381',
                      lineHeight: 1.6,
                      fontSize: '14.5px',
                    }}
                  >
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

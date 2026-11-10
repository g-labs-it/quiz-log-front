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
  return (
    <Box sx={{ py: { xs: 9, md: 14 }, bgcolor: '#FFFFFF', borderTop: '1px solid rgba(10, 10, 10, 0.06)' }}>
      <Container maxWidth="lg">
        {/* Header - 100% Centered */}
        <Stack
          spacing={1.75}
          alignItems="center"
          justifyContent="center"
          sx={{ textAlign: 'center', mb: { xs: 6, md: 8 }, width: '100%' }}
        >
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.85,
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
            }}
          >
            <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: '#36B37E' }} />
            Core Learning Pillars
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
            Play, Learn and Master
          </Typography>

          <Typography
            sx={{
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              color: '#637381',
              fontSize: { xs: '15px', md: '16.5px' },
              maxWidth: 560,
              textAlign: 'center',
              width: '100%',
              mx: 'auto',
            }}
          >
            Check yourself — how far can your exam readiness reach?
          </Typography>
        </Stack>

        {/* 3 Modern Bauhaus Cards with Relevant Flat Illustrations */}
        <Grid container spacing={3.5}>
          {/* =========================================================
              CARD 1: Test your IQ & Skills! (Diagnostic & Brainpower)
             ========================================================= */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card
              onClick={onScrollToQuizzes}
              sx={{
                borderRadius: '28px',
                overflow: 'hidden',
                cursor: 'pointer',
                bgcolor: '#FFFFFF',
                border: '1.5px solid rgba(10, 10, 10, 0.08)',
                boxShadow: '0 10px 30px rgba(1, 23, 56, 0.05)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                '&:hover': {
                  transform: 'translateY(-6px)',
                  boxShadow: '0 20px 44px rgba(54, 179, 126, 0.16)',
                  borderColor: 'rgba(54, 179, 126, 0.35)',
                  '& .pillar-illustration': {
                    transform: 'scale(1.03)',
                  },
                  '& .explore-arrow': {
                    transform: 'translateX(4px)',
                  },
                },
              }}
            >
              {/* Flat Illustration 1: Diagnostic Radar & Skill Spark */}
              <Box
                sx={{
                  height: 220,
                  bgcolor: '#EAF8F1',
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  borderBottom: '1px solid rgba(54, 179, 126, 0.12)',
                }}
              >
                <Box
                  className="pillar-illustration"
                  sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  <svg width="100%" height="100%" viewBox="0 0 360 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Concentric radar backdrop */}
                    <circle cx="180" cy="105" r="76" stroke="#77E7B3" strokeWidth="1.5" strokeDasharray="4 6" opacity="0.6" />
                    <circle cx="180" cy="105" r="54" stroke="#36B37E" strokeWidth="1.2" opacity="0.4" />
                    <circle cx="180" cy="105" r="32" fill="rgba(54, 179, 126, 0.14)" />

                    {/* Radar Crosshairs */}
                    <line x1="180" y1="36" x2="180" y2="174" stroke="#77E7B3" strokeWidth="1" strokeDasharray="2 4" opacity="0.5" />
                    <line x1="110" y1="105" x2="250" y2="105" stroke="#77E7B3" strokeWidth="1" strokeDasharray="2 4" opacity="0.5" />

                    {/* Diagnostic Skill Radar Polygon */}
                    <polygon
                      points="180,58 224,88 206,142 154,142 136,88"
                      fill="rgba(54, 179, 126, 0.22)"
                      stroke="#36B37E"
                      strokeWidth="2.2"
                      strokeLinejoin="round"
                    />

                    {/* Radar Vertices */}
                    <circle cx="180" cy="58" r="3.5" fill="#36B37E" />
                    <circle cx="224" cy="88" r="3.5" fill="#FDC745" />
                    <circle cx="206" cy="142" r="3.5" fill="#36B37E" />
                    <circle cx="154" cy="142" r="3.5" fill="#4361F2" />
                    <circle cx="136" cy="88" r="3.5" fill="#36B37E" />

                    {/* Central Brain / Diagnostic Medallion */}
                    <circle cx="180" cy="105" r="24" fill="#36B37E" />
                    <path
                      d="M172 101 C172 96.8 175.4 93.5 179.6 93.5 C183.8 93.5 187.2 96.8 187.2 101 C187.2 103.8 185.3 105.7 183.4 107.5 L183.4 110.5 L175.8 110.5 L175.8 107.5 C173.9 105.7 172 103.8 172 101 Z M175.8 113.2 L183.4 113.2 L183.4 114.2 C183.4 115.2 182.6 116 181.6 116 L177.6 116 C176.6 116 175.8 115.2 175.8 114.2 Z"
                      fill="#FFFFFF"
                    />
                    <circle cx="179.6" cy="102" r="2" fill="#FDC745" />

                    {/* Energy Spark rays */}
                    <line x1="180" y1="76" x2="180" y2="70" stroke="#FDC745" strokeWidth="2.2" strokeLinecap="round" />
                    <line x1="194" y1="81" x2="199" y2="77" stroke="#FDC745" strokeWidth="2.2" strokeLinecap="round" />
                    <line x1="166" y1="81" x2="161" y2="77" stroke="#FDC745" strokeWidth="2.2" strokeLinecap="round" />

                    {/* Floating Accent 1: TOP-RIGHT (Generous clear air gap from center) */}
                    <g filter="drop-shadow(0 6px 14px rgba(1, 23, 56, 0.08))">
                      <rect x="230" y="22" width="108" height="42" rx="12" fill="#FFFFFF" stroke="rgba(10, 10, 10, 0.06)" strokeWidth="1" />
                      <circle cx="248" cy="43" r="10" fill="rgba(54, 179, 126, 0.15)" />
                      <path d="M244 43 L247 46 L252 40" stroke="#36B37E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <text x="264" y="38" fill="#0A0A0A" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="800" fontSize="12">
                        IQ 145+
                      </text>
                      <text x="264" y="51" fill="#637381" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="600" fontSize="9">
                        Top 1% Percentile
                      </text>
                    </g>

                    {/* Floating Accent 2: BOTTOM-LEFT (Generous clear air gap from center) */}
                    <g filter="drop-shadow(0 6px 14px rgba(1, 23, 56, 0.08))">
                      <rect x="22" y="136" width="112" height="42" rx="12" fill="#FFFFFF" stroke="rgba(10, 10, 10, 0.06)" strokeWidth="1" />
                      {/* Mini Bar Chart */}
                      <rect x="36" y="157" width="5" height="10" rx="2.5" fill="#36B37E" />
                      <rect x="44" y="150" width="5" height="17" rx="2.5" fill="#FDC745" />
                      <rect x="52" y="145" width="5" height="22" rx="2.5" fill="#4361F2" />
                      <rect x="60" y="140" width="5" height="27" rx="2.5" fill="#36B37E" />
                      <text x="73" y="152" fill="#0A0A0A" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="800" fontSize="11.5">
                        98% Score
                      </text>
                      <text x="73" y="164" fill="#36B37E" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="700" fontSize="9">
                        Concepts Mastered
                      </text>
                    </g>

                    {/* Bauhaus Decorative Accents */}
                    <circle cx="36" cy="36" r="4.5" fill="#36B37E" opacity="0.35" />
                    <circle cx="330" cy="150" r="3.5" fill="#FDC745" />
                    <circle cx="60" cy="90" r="2" fill="#4361F2" opacity="0.5" />
                  </svg>
                </Box>
              </Box>

              {/* Card Body */}
              <Box sx={{ p: 3.5, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Box
                  sx={{
                    display: 'inline-block',
                    alignSelf: 'flex-start',
                    px: 1.6,
                    py: 0.5,
                    borderRadius: '999px',
                    bgcolor: 'rgba(54, 179, 126, 0.12)',
                    color: '#1B806A',
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    fontWeight: 700,
                    fontSize: '11.5px',
                    letterSpacing: '0.03em',
                    textTransform: 'uppercase',
                    mb: 1.75,
                  }}
                >
                  Quick Diagnostic
                </Box>

                <Typography
                  sx={{
                    fontFamily: '"Plus Jakarta Sans", "DM Sans Variable", sans-serif',
                    fontWeight: 800,
                    fontSize: '1.45rem',
                    color: '#0A0A0A',
                    lineHeight: 1.25,
                    letterSpacing: '-0.025em',
                    mb: 1.25,
                  }}
                >
                  Test your IQ & Skills!
                </Typography>

                <Typography
                  sx={{
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    color: '#637381',
                    fontSize: '14.5px',
                    lineHeight: 1.6,
                    mb: 3,
                    flexGrow: 1,
                  }}
                >
                  Pinpoint your strengths and blind spots across question categories with targeted diagnostic drills.
                </Typography>

                <Stack direction="row" alignItems="center" spacing={1} sx={{ pt: 1, borderTop: '1px solid rgba(10, 10, 10, 0.06)' }}>
                  <Typography
                    sx={{
                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                      color: '#1B806A',
                      fontWeight: 700,
                      fontSize: '14.5px',
                    }}
                  >
                    Start Diagnostic Drill
                  </Typography>
                  <Iconify
                    className="explore-arrow"
                    icon="solar:arrow-right-linear"
                    width={18}
                    color="#1B806A"
                    sx={{ transition: 'transform 0.25s ease' }}
                  />
                </Stack>
              </Box>
            </Card>
          </Grid>

          {/* =========================================================
              CARD 2: Learn & Master Concepts (Teacher Guided Notebook)
             ========================================================= */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card
              onClick={onScrollToQuizzes}
              sx={{
                borderRadius: '28px',
                overflow: 'hidden',
                cursor: 'pointer',
                bgcolor: '#FFFFFF',
                border: '1.5px solid rgba(10, 10, 10, 0.08)',
                boxShadow: '0 10px 30px rgba(1, 23, 56, 0.05)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                '&:hover': {
                  transform: 'translateY(-6px)',
                  boxShadow: '0 20px 44px rgba(253, 199, 69, 0.2)',
                  borderColor: 'rgba(253, 199, 69, 0.45)',
                  '& .pillar-illustration': {
                    transform: 'scale(1.03)',
                  },
                  '& .explore-arrow': {
                    transform: 'translateX(4px)',
                  },
                },
              }}
            >
              {/* Flat Illustration 2: Teacher Guided Lesson Book & Graduation Cap */}
              <Box
                sx={{
                  height: 220,
                  bgcolor: '#FEF9E7',
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  borderBottom: '1px solid rgba(253, 199, 69, 0.2)',
                }}
              >
                <Box
                  className="pillar-illustration"
                  sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  <svg width="100%" height="100%" viewBox="0 0 360 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Decorative warm aura */}
                    <circle cx="180" cy="105" r="72" fill="rgba(253, 199, 69, 0.2)" />
                    <circle cx="180" cy="105" r="48" fill="rgba(253, 199, 69, 0.25)" />

                    {/* Central Open Study Book */}
                    <g filter="drop-shadow(0 8px 18px rgba(1, 23, 56, 0.1))">
                      {/* Book spine & cover */}
                      <path d="M136 130 C158 127 180 131 180 135 C180 131 202 127 224 130 L228 88 C206 85 180 88 180 92 C180 88 154 85 132 88 Z" fill="#011738" />
                      {/* Left Page */}
                      <path d="M138 128 C156 125 176 128 178 131 L178 90 C156 87 138 90 134 92 Z" fill="#FFFFFF" />
                      {/* Right Page */}
                      <path d="M182 131 C184 128 204 125 222 128 L226 92 C204 90 184 87 182 90 Z" fill="#FAF9F5" />
                      {/* Left Page Text Lines */}
                      <line x1="144" y1="99" x2="168" y2="99" stroke="#36B37E" strokeWidth="2.2" strokeLinecap="round" />
                      <line x1="144" y1="106" x2="170" y2="106" stroke="#CBD5E1" strokeWidth="1.8" strokeLinecap="round" />
                      <line x1="144" y1="113" x2="164" y2="113" stroke="#CBD5E1" strokeWidth="1.8" strokeLinecap="round" />
                      <line x1="144" y1="120" x2="168" y2="120" stroke="#CBD5E1" strokeWidth="1.8" strokeLinecap="round" />

                      {/* Right Page Text Lines */}
                      <line x1="192" y1="99" x2="216" y2="99" stroke="#FDC745" strokeWidth="2.2" strokeLinecap="round" />
                      <line x1="192" y1="106" x2="218" y2="106" stroke="#CBD5E1" strokeWidth="1.8" strokeLinecap="round" />
                      <line x1="192" y1="113" x2="212" y2="113" stroke="#CBD5E1" strokeWidth="1.8" strokeLinecap="round" />
                      <line x1="192" y1="120" x2="216" y2="120" stroke="#CBD5E1" strokeWidth="1.8" strokeLinecap="round" />

                      {/* Bookmark ribbon */}
                      <path d="M180 92 L180 142 L183 138 L186 142 L186 92 Z" fill="#EF4444" />
                    </g>

                    {/* Graduation Mortarboard hovering above book */}
                    <g filter="drop-shadow(0 6px 12px rgba(1, 23, 56, 0.16))">
                      <polygon points="180,50 210,62 180,74 150,62" fill="#011738" />
                      <path d="M159 66 L159 78 C159 85 201 85 201 78 L201 66" fill="#011738" opacity="0.95" />
                      <circle cx="180" cy="62" r="3" fill="#FDC745" />
                      {/* Gold Tassel */}
                      <path d="M180 62 L205 72 L205 84" stroke="#FDC745" strokeWidth="2" strokeLinecap="round" fill="none" />
                      <circle cx="205" cy="85" r="2.5" fill="#FDC745" />
                    </g>

                    {/* Floating Accent 1: TOP-LEFT (Clear diagonal placement) */}
                    <g filter="drop-shadow(0 6px 14px rgba(1, 23, 56, 0.08))">
                      <rect x="22" y="22" width="112" height="42" rx="12" fill="#FFFFFF" stroke="rgba(10, 10, 10, 0.06)" strokeWidth="1" />
                      <circle cx="40" cy="43" r="10" fill="#FEF3C7" />
                      <text x="36.5" y="47" fill="#D97706" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="900" fontSize="12">
                        ★
                      </text>
                      <text x="56" y="38" fill="#0A0A0A" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="800" fontSize="11.5">
                        Teacher Key
                      </text>
                      <text x="56" y="51" fill="#637381" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="600" fontSize="9">
                        Step-by-step logic
                      </text>
                    </g>

                    {/* Floating Accent 2: BOTTOM-RIGHT (Clear diagonal placement) */}
                    <g filter="drop-shadow(0 6px 14px rgba(1, 23, 56, 0.08))">
                      <rect x="224" y="136" width="114" height="42" rx="12" fill="#FFFFFF" stroke="rgba(10, 10, 10, 0.06)" strokeWidth="1" />
                      <circle cx="242" cy="157" r="10" fill="rgba(54, 179, 126, 0.15)" />
                      <path d="M238 157 L241 160 L246 154" stroke="#36B37E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <text x="258" y="152" fill="#0A0A0A" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="800" fontSize="11.5">
                        100% Rationale
                      </text>
                      <text x="258" y="164" fill="#36B37E" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="700" fontSize="9">
                        Every Question
                      </text>
                    </g>

                    {/* Bauhaus Accents */}
                    <circle cx="330" cy="38" r="4.5" fill="#FDC745" />
                    <circle cx="38" cy="150" r="3.5" fill="#36B37E" opacity="0.35" />
                    <circle cx="180" cy="30" r="2.5" fill="#FDC745" />
                  </svg>
                </Box>
              </Box>

              {/* Card Body */}
              <Box sx={{ p: 3.5, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Box
                  sx={{
                    display: 'inline-block',
                    alignSelf: 'flex-start',
                    px: 1.6,
                    py: 0.5,
                    borderRadius: '999px',
                    bgcolor: 'rgba(253, 199, 69, 0.2)',
                    color: '#B45309',
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    fontWeight: 700,
                    fontSize: '11.5px',
                    letterSpacing: '0.03em',
                    textTransform: 'uppercase',
                    mb: 1.75,
                  }}
                >
                  Teacher Guided
                </Box>

                <Typography
                  sx={{
                    fontFamily: '"Plus Jakarta Sans", "DM Sans Variable", sans-serif',
                    fontWeight: 800,
                    fontSize: '1.45rem',
                    color: '#0A0A0A',
                    lineHeight: 1.25,
                    letterSpacing: '-0.025em',
                    mb: 1.25,
                  }}
                >
                  Learn & Master Concepts
                </Typography>

                <Typography
                  sx={{
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    color: '#637381',
                    fontSize: '14.5px',
                    lineHeight: 1.6,
                    mb: 3,
                    flexGrow: 1,
                  }}
                >
                  Every practice question includes rich step-by-step teacher rationales so you truly master every principle.
                </Typography>

                <Stack direction="row" alignItems="center" spacing={1} sx={{ pt: 1, borderTop: '1px solid rgba(10, 10, 10, 0.06)' }}>
                  <Typography
                    sx={{
                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                      color: '#B45309',
                      fontWeight: 700,
                      fontSize: '14.5px',
                    }}
                  >
                    View Concept Explanations
                  </Typography>
                  <Iconify
                    className="explore-arrow"
                    icon="solar:arrow-right-linear"
                    width={18}
                    color="#B45309"
                    sx={{ transition: 'transform 0.25s ease' }}
                  />
                </Stack>
              </Box>
            </Card>
          </Grid>

          {/* =========================================================
              CARD 3: Test Before You Sit Exam (Countdown Simulator)
             ========================================================= */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card
              onClick={onScrollToQuizzes}
              sx={{
                borderRadius: '28px',
                overflow: 'hidden',
                cursor: 'pointer',
                bgcolor: '#FFFFFF',
                border: '1.5px solid rgba(10, 10, 10, 0.08)',
                boxShadow: '0 10px 30px rgba(1, 23, 56, 0.05)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                '&:hover': {
                  transform: 'translateY(-6px)',
                  boxShadow: '0 20px 44px rgba(67, 97, 242, 0.18)',
                  borderColor: 'rgba(67, 97, 242, 0.4)',
                  '& .pillar-illustration': {
                    transform: 'scale(1.03)',
                  },
                  '& .explore-arrow': {
                    transform: 'translateX(4px)',
                  },
                },
              }}
            >
              {/* Flat Illustration 3: Countdown Stopwatch & Exam Paper */}
              <Box
                sx={{
                  height: 220,
                  bgcolor: '#EEF2FF',
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  borderBottom: '1px solid rgba(67, 97, 242, 0.14)',
                }}
              >
                <Box
                  className="pillar-illustration"
                  sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  <svg width="100%" height="100%" viewBox="0 0 360 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Soft concentric time ripples */}
                    <circle cx="180" cy="106" r="76" stroke="#A5B4FC" strokeWidth="1.5" strokeDasharray="4 6" opacity="0.6" />
                    <circle cx="180" cy="106" r="54" fill="rgba(67, 97, 242, 0.08)" />

                    {/* Background Angled Exam Sheet */}
                    <g transform="rotate(-6 180 106)" filter="drop-shadow(0 4px 12px rgba(1, 23, 56, 0.08))">
                      <rect x="142" y="52" width="76" height="102" rx="8" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
                      <line x1="152" y1="68" x2="198" y2="68" stroke="#011738" strokeWidth="2.5" strokeLinecap="round" />
                      {/* MCQ Option bubbles */}
                      <circle cx="156" cy="84" r="3.5" fill="#36B37E" />
                      <line x1="165" y1="84" x2="204" y2="84" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
                      <circle cx="156" cy="98" r="3.5" fill="#E2E8F0" />
                      <line x1="165" y1="98" x2="198" y2="98" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
                      <circle cx="156" cy="112" r="3.5" fill="#36B37E" />
                      <line x1="165" y1="112" x2="206" y2="112" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
                      <circle cx="156" cy="126" r="3.5" fill="#E2E8F0" />
                      <line x1="165" y1="126" x2="192" y2="126" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
                      {/* Grade A+ Seal */}
                      <circle cx="200" cy="135" r="12" fill="#FEF2F2" stroke="#EF4444" strokeWidth="1.4" />
                      <text x="193" y="139" fill="#EF4444" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="900" fontSize="11">
                        A+
                      </text>
                    </g>

                    {/* Central Modern Chronometer Stopwatch */}
                    <g filter="drop-shadow(0 8px 18px rgba(67, 97, 242, 0.28))">
                      {/* Top crown */}
                      <rect x="176" y="66" width="8" height="6" rx="2" fill="#011738" />
                      <rect x="173" y="63" width="14" height="4" rx="2" fill="#4361F2" />
                      {/* Watch Body */}
                      <circle cx="180" cy="108" r="36" fill="#011738" />
                      <circle cx="180" cy="108" r="31" fill="#FFFFFF" />
                      {/* Dial markings */}
                      <line x1="180" y1="82" x2="180" y2="86" stroke="#011738" strokeWidth="2" strokeLinecap="round" />
                      <line x1="180" y1="134" x2="180" y2="130" stroke="#011738" strokeWidth="2" strokeLinecap="round" />
                      <line x1="154" y1="108" x2="158" y2="108" stroke="#011738" strokeWidth="2" strokeLinecap="round" />
                      <line x1="206" y1="108" x2="202" y2="108" stroke="#011738" strokeWidth="2" strokeLinecap="round" />
                      {/* Digital Time readout */}
                      <text x="163" y="104" fill="#4361F2" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="900" fontSize="11">
                        45:00
                      </text>
                      {/* Stopwatch Hand */}
                      <line x1="180" y1="108" x2="195" y2="96" stroke="#EF4444" strokeWidth="2.2" strokeLinecap="round" />
                      <circle cx="180" cy="108" r="3" fill="#EF4444" />
                    </g>

                    {/* Floating Accent 1: TOP-RIGHT (Clear diagonal placement) */}
                    <g filter="drop-shadow(0 6px 14px rgba(1, 23, 56, 0.08))">
                      <rect x="226" y="22" width="112" height="42" rx="12" fill="#FFFFFF" stroke="rgba(10, 10, 10, 0.06)" strokeWidth="1" />
                      <circle cx="244" cy="43" r="5" fill="#EF4444" />
                      <text x="256" y="38" fill="#0A0A0A" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="800" fontSize="11.5">
                        Exam Clock
                      </text>
                      <text x="256" y="51" fill="#4361F2" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="700" fontSize="9">
                        Live Hall Pacing
                      </text>
                    </g>

                    {/* Floating Accent 2: BOTTOM-LEFT (Clear diagonal placement) */}
                    <g filter="drop-shadow(0 6px 14px rgba(1, 23, 56, 0.08))">
                      <rect x="22" y="136" width="112" height="42" rx="12" fill="#FFFFFF" stroke="rgba(10, 10, 10, 0.06)" strokeWidth="1" />
                      <circle cx="40" cy="157" r="10" fill="rgba(54, 179, 126, 0.15)" />
                      <path d="M36 157 L39 160 L44 154" stroke="#36B37E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <text x="56" y="152" fill="#0A0A0A" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="800" fontSize="11.5">
                        Pass Target
                      </text>
                      <text x="56" y="164" fill="#36B37E" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="700" fontSize="9">
                        100% Guaranteed
                      </text>
                    </g>

                    {/* Bauhaus Accents */}
                    <circle cx="38" cy="40" r="4.5" fill="#4361F2" opacity="0.35" />
                    <circle cx="330" cy="148" r="4" fill="#36B37E" />
                    <circle cx="180" cy="24" r="2.5" fill="#FDC745" />
                  </svg>
                </Box>
              </Box>

              {/* Card Body */}
              <Box sx={{ p: 3.5, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Box
                  sx={{
                    display: 'inline-block',
                    alignSelf: 'flex-start',
                    px: 1.6,
                    py: 0.5,
                    borderRadius: '999px',
                    bgcolor: 'rgba(67, 97, 242, 0.1)',
                    color: '#4361F2',
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    fontWeight: 700,
                    fontSize: '11.5px',
                    letterSpacing: '0.03em',
                    textTransform: 'uppercase',
                    mb: 1.75,
                  }}
                >
                  Exam Simulation
                </Box>

                <Typography
                  sx={{
                    fontFamily: '"Plus Jakarta Sans", "DM Sans Variable", sans-serif',
                    fontWeight: 800,
                    fontSize: '1.45rem',
                    color: '#0A0A0A',
                    lineHeight: 1.25,
                    letterSpacing: '-0.025em',
                    mb: 1.25,
                  }}
                >
                  Test Before You Sit Exam
                </Typography>

                <Typography
                  sx={{
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    color: '#637381',
                    fontSize: '14.5px',
                    lineHeight: 1.6,
                    mb: 3,
                    flexGrow: 1,
                  }}
                >
                  Simulate official exam hall countdown timers, question flagging, and pacing pressure to eliminate test anxiety.
                </Typography>

                <Stack direction="row" alignItems="center" spacing={1} sx={{ pt: 1, borderTop: '1px solid rgba(10, 10, 10, 0.06)' }}>
                  <Typography
                    sx={{
                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                      color: '#4361F2',
                      fontWeight: 700,
                      fontSize: '14.5px',
                    }}
                  >
                    Experience Exam Simulation
                  </Typography>
                  <Iconify
                    className="explore-arrow"
                    icon="solar:arrow-right-linear"
                    width={18}
                    color="#4361F2"
                    sx={{ transition: 'transform 0.25s ease' }}
                  />
                </Stack>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

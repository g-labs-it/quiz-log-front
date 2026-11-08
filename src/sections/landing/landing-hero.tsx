import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

interface Props {
  onScrollToQuizzes?: () => void;
  onScrollToChampions?: () => void;
  onScrollToHowItWorks?: () => void;
}

/**
 * Generates an exact Bauhaus concentric quarter-circle diagonal metaball bridge
 * between two diagonally adjacent grid circles (x1, y1, r) and (x2, y2, r).
 * Because rf = s - r, the bridge is 100% G1-tangent to both endpoint circles
 * and 100% concentric with both neighboring off-diagonal circles.
 */
function createDiagonalBridge(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  r: number
): string {
  const s = Math.abs(x2 - x1);
  const rf = s - r;

  if (x2 > x1) {
    // Down-right diagonal: (x1, y1) -> (x2, y2)
    return [
      `M ${x1 + r} ${y1}`,
      `A ${rf} ${rf} 0 0 0 ${x2} ${y2 - r}`,
      `L ${x2 - r} ${y2}`,
      `A ${rf} ${rf} 0 0 0 ${x1} ${y1 + r}`,
      'Z',
    ].join(' ');
  }

  // Down-left diagonal: (x1, y1) -> (x2, y2)
  return [
    `M ${x1} ${y1 + r}`,
    `A ${rf} ${rf} 0 0 0 ${x2 + r} ${y2}`,
    `L ${x2} ${y2 - r}`,
    `A ${rf} ${rf} 0 0 0 ${x1 - r} ${y1}`,
    'Z',
  ].join(' ');
}

export function LandingHero({ onScrollToQuizzes, onScrollToHowItWorks }: Props) {
  // 4x4 Grid with constant step S = 90 and circle radius RAD = 43.4 (gap = 3.2px, rf = 46.6px)
  const S = 90;
  const H = S / 2; // 45px exact half-step for Column 4 tangent envelope
  const C = [52, 52 + S, 52 + S * 2, 52 + S * 3 + 1.6]; // [52, 142, 232, 323.6]
  const R = [52, 52 + S, 52 + S * 2, 52 + S * 3]; // [52, 142, 232, 322]
  const RAD = 43.4;
  const COL4_INNER_RAD = 42.0; // Leaves a 3.0px cream border inside the H=45 mask

  // The 4 exact diagonal metaball bridges from the reference artwork
  const yellowDiag = createDiagonalBridge(C[0], R[0], C[1], R[1], RAD);
  const bluePurpleDiag = createDiagonalBridge(C[2], R[1], C[1], R[2], RAD);
  const purpleLeftDiag = createDiagonalBridge(C[0], R[2], C[1], R[3], RAD);
  const purpleRightDiag = createDiagonalBridge(C[2], R[2], C[1], R[3], RAD);

  return (
    <Box
      sx={{
        position: 'relative',
        bgcolor: '#F5F4EB',
        pt: { xs: 13, sm: 15, md: 17 },
        pb: { xs: 8, md: 11 },
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 6, md: 4 }} alignItems="center">
          {/* LEFT COLUMN: Bold 4-Line Typography, Subtitle, Paper Plane & CTA Buttons */}
          <Grid size={{ xs: 12, md: 6.3 }}>
            <Box sx={{ position: 'relative' }}>
              <Typography
                component="h1"
                sx={{
                  fontFamily: '"Plus Jakarta Sans", "DM Sans Variable", sans-serif',
                  fontWeight: 800,
                  fontSize: { xs: '3rem', sm: '4.1rem', md: '4.75rem' },
                  lineHeight: 1.03,
                  letterSpacing: '-0.035em',
                  color: '#0A0A0A',
                  mb: { xs: 3, md: 4 },
                }}
              >
                Developing
                <br />
                Outstand-
                <br />
                Ing Exam
                <br />
                Mastery!
              </Typography>

              {/* Subtitle + Hand-drawn Paper Plane with Dashed Loop */}
              <Box
                sx={{
                  position: 'relative',
                  maxWidth: 430,
                  mb: { xs: 4.5, md: 6 },
                }}
              >
                <Typography
                  sx={{
                    fontFamily: '"Plus Jakarta Sans", "DM Sans Variable", sans-serif',
                    fontSize: { xs: '15px', sm: '16.5px' },
                    fontWeight: 500,
                    color: '#14142B',
                    lineHeight: 1.65,
                  }}
                >
                  Trusted by over 15,000 students and millions of learners
                  <br />
                  around the world
                </Typography>

                {/* Paper Plane + Dashed Loop */}
                <Box
                  sx={{
                    display: { xs: 'none', sm: 'block' },
                    position: 'absolute',
                    right: { sm: -115, md: -125 },
                    bottom: -22,
                    width: 115,
                    height: 56,
                    pointerEvents: 'none',
                  }}
                >
                  <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 120 60"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4 8 L38 15 L23 23 L19 37 L4 8 Z"
                      stroke="#14142B"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M4 8 L23 23"
                      stroke="#14142B"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                    />
                    <path
                      d="M19 37 L26 26"
                      stroke="#14142B"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                    />
                    <path
                      d="M34 27 C 52 44, 92 46, 94 28 C 95 16, 78 16, 80 28 C 82 40, 108 38, 114 14"
                      stroke="#14142B"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeDasharray="4 4.5"
                    />
                  </svg>
                </Box>
              </Box>

              {/* CTA Pill Buttons */}
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                flexWrap="wrap"
                sx={{ rowGap: 1.5 }}
              >
                {/* Primary Black Pill with White Circle Arrow */}
                <Button
                  onClick={onScrollToQuizzes}
                  sx={{
                    bgcolor: '#0A0A0A',
                    color: '#FFFFFF',
                    borderRadius: '999px',
                    pl: 3.5,
                    pr: 0.85,
                    py: 0.85,
                    height: 58,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 2.25,
                    textTransform: 'none',
                    fontFamily: '"Plus Jakarta Sans", "DM Sans Variable", sans-serif',
                    fontWeight: 600,
                    fontSize: '15px',
                    boxShadow: 'none',
                    transition: 'all 0.25s ease',
                    '&:hover': {
                      bgcolor: '#222222',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 10px 24px rgba(0, 0, 0, 0.14)',
                    },
                  }}
                >
                  <span>Start Free Trial</span>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      bgcolor: '#FFFFFF',
                      color: '#0A0A0A',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Iconify icon="solar:arrow-right-linear" width={20} />
                  </Box>
                </Button>

                {/* Secondary Outlined Pill Button */}
                <Button
                  variant="outlined"
                  onClick={onScrollToHowItWorks}
                  sx={{
                    border: '1px solid #9A9A92',
                    borderRadius: '999px',
                    px: 4.75,
                    height: 58,
                    color: '#0A0A0A',
                    bgcolor: 'transparent',
                    textTransform: 'none',
                    fontFamily: '"Plus Jakarta Sans", "DM Sans Variable", sans-serif',
                    fontWeight: 600,
                    fontSize: '15px',
                    transition: 'all 0.25s ease',
                    '&:hover': {
                      borderColor: '#0A0A0A',
                      bgcolor: 'rgba(10, 10, 10, 0.04)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  Learn More
                </Button>
              </Stack>
            </Box>
          </Grid>

          {/* RIGHT COLUMN: Precision 4x4 Bauhaus Metaball & Portrait Grid */}
          <Grid size={{ xs: 12, md: 5.7 }}>
            <Box
              sx={{
                width: '100%',
                maxWidth: { xs: 360, sm: 425, md: 455 },
                mx: 'auto',
                ml: { md: 'auto' },
                mr: { md: 0 },
              }}
            >
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 374 374"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ display: 'block', overflow: 'visible' }}
              >
                <defs>
                  {/* Blue-to-Purple Diagonal Gradient */}
                  <linearGradient
                    id="gradBluePurple"
                    x1={C[2]}
                    y1={R[1]}
                    x2={C[1]}
                    y2={R[2]}
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0%" stopColor="#4361F2" />
                    <stop offset="45%" stopColor="#6559F7" />
                    <stop offset="100%" stopColor="#8E54FF" />
                  </linearGradient>

                  {/* Soft 3D Radial Highlight for Center Purple Circle (C1, R2) */}
                  <radialGradient
                    id="gradCenterPurple"
                    cx={C[1]}
                    cy={R[2]}
                    r={RAD}
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0%" stopColor="#7546FF" />
                    <stop offset="65%" stopColor="#8F55FF" />
                    <stop offset="100%" stopColor="#9C5AFF" />
                  </radialGradient>

                  {/* Soft Shadow for Row 3 Col 4 White Circle */}
                  <filter id="whiteCircleShadow" x="-25%" y="-25%" width="160%" height="160%">
                    <feDropShadow
                      dx="3.5"
                      dy="2"
                      stdDeviation="3.5"
                      floodColor="#011738"
                      floodOpacity="0.22"
                    />
                  </filter>

                  {/* Exact Circular Clip Paths for the 4 Medallions */}
                  <clipPath id="clipTrophy">
                    <circle cx={C[2]} cy={R[0]} r={RAD} />
                  </clipPath>
                  <clipPath id="clipCoralStudent">
                    <circle cx={C[3]} cy={R[0]} r={COL4_INNER_RAD} />
                  </clipPath>
                  <clipPath id="clipPinkStudent">
                    <circle cx={C[0]} cy={R[1]} r={RAD} />
                  </clipPath>
                  <clipPath id="clipGreenStudent">
                    <circle cx={C[2]} cy={R[3]} r={RAD} />
                  </clipPath>
                </defs>

                {/* =========================================================
                    1. COLUMN 4 DARK NAVY S-STEP STRUCTURE (Exact H = S/2 = 45px Tangent Envelope)
                       - R0..R1: Full width [C3 - H, C3 + H]
                       - R1..R2: Right half [C3, C3 + H]
                       - R2..R3: Left half [C3 - H, C3] + Bottom Circle (C3, R3)
                   ========================================================= */}
                <g fill="#011738">
                  <rect x={C[3] - H} y={R[0]} width={H * 2} height={S} />
                  <rect x={C[3]} y={R[1]} width={H} height={S} />
                  <rect x={C[3] - H} y={R[2]} width={H} height={S} />
                  <circle cx={C[3]} cy={R[3]} r={H} />
                </g>

                {/* =========================================================
                    2. YELLOW CLUSTER: Diagonal Bridge (C0,R0)<->(C1,R1) + 3 Circles
                   ========================================================= */}
                <g fill="#FDC745">
                  <path d={yellowDiag} />
                  <circle cx={C[0]} cy={R[0]} r={RAD} />
                  <circle cx={C[1]} cy={R[0]} r={RAD} />
                  <circle cx={C[1]} cy={R[1]} r={RAD} />
                </g>

                {/* =========================================================
                    3. PURPLE & BLUE DIAGONAL BRIDGES + CIRCLES
                   ========================================================= */}
                <path d={bluePurpleDiag} fill="url(#gradBluePurple)" />

                <g fill="#9C5AFF">
                  <path d={purpleLeftDiag} />
                  <path d={purpleRightDiag} />
                  <circle cx={C[0]} cy={R[2]} r={RAD} />
                  <circle cx={C[2]} cy={R[2]} r={RAD} />
                  <circle cx={C[1]} cy={R[3]} r={RAD} />
                </g>

                {/* Center Purple Circle (C1, R2) with Soft 3D Radial Highlight */}
                <circle cx={C[1]} cy={R[2]} r={RAD} fill="url(#gradCenterPurple)" />

                {/* =========================================================
                    4. TARGET & RING CIRCLES
                   ========================================================= */}
                {/* (C2, R1) Royal Blue Target Ring */}
                <g>
                  <circle cx={C[2]} cy={R[1]} r={RAD} fill="#4361F2" />
                  <circle cx={C[2]} cy={R[1]} r={30} fill="#FFFFFF" />
                  <circle cx={C[2]} cy={R[1]} r={14.5} fill="#3955E6" />
                </g>

                {/* (C0, R3) Bottom-Left Royal Blue Bullseye */}
                <g>
                  <circle cx={C[0]} cy={R[3]} r={RAD} fill="#4361F2" />
                  <circle cx={C[0]} cy={R[3]} r={35.5} fill="#FFFFFF" />
                  <circle cx={C[0]} cy={R[3]} r={16.5} fill="#2A45D4" />
                </g>

                {/* (C3, R1) Sky Blue Circle with Thin White Inner Ring */}
                <g>
                  <circle cx={C[3]} cy={R[1]} r={H} fill="#F5F4EB" />
                  <circle cx={C[3]} cy={R[1]} r={COL4_INNER_RAD} fill="#3BB8EC" />
                  <circle
                    cx={C[3]}
                    cy={R[1]}
                    r={28}
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                  />
                </g>

                {/* (C3, R2) White Circle with Soft Drop Shadow (Exact H = 45px Tangent Fit) */}
                <circle
                  cx={C[3]}
                  cy={R[2]}
                  r={H}
                  fill="#FFFFFF"
                  filter="url(#whiteCircleShadow)"
                />

                {/* =========================================================
                    5. FOUR PORTRAIT & TROPHY MEDALLIONS (Halo-Free Over-Bleed)
                   ========================================================= */}
                {/* (C2, R0) Golden Trophy */}
                <g>
                  <circle cx={C[2]} cy={R[0]} r={RAD} fill="#011738" />
                  <image
                    href="/assets/images/hero/trophy.png"
                    x={C[2] - RAD - 3.5}
                    y={R[0] - RAD - 3.5}
                    width={(RAD + 3.5) * 2}
                    height={(RAD + 3.5) * 2}
                    preserveAspectRatio="xMidYMid slice"
                    clipPath="url(#clipTrophy)"
                  />
                </g>

                {/* (C3, R0) Coral Student */}
                <g>
                  <circle cx={C[3]} cy={R[0]} r={H} fill="#F5F4EB" />
                  <circle cx={C[3]} cy={R[0]} r={COL4_INNER_RAD} fill="#F4956A" />
                  <image
                    href="/assets/images/hero/student-coral.png"
                    x={C[3] - RAD - 3.5}
                    y={R[0] - RAD - 3.5}
                    width={(RAD + 3.5) * 2}
                    height={(RAD + 3.5) * 2}
                    preserveAspectRatio="xMidYMid slice"
                    clipPath="url(#clipCoralStudent)"
                  />
                </g>

                {/* (C0, R1) Pink Student */}
                <g>
                  <circle cx={C[0]} cy={R[1]} r={RAD} fill="#F7ACCC" />
                  <image
                    href="/assets/images/hero/student-pink.png"
                    x={C[0] - RAD - 3.5}
                    y={R[1] - RAD - 3.5}
                    width={(RAD + 3.5) * 2}
                    height={(RAD + 3.5) * 2}
                    preserveAspectRatio="xMidYMid slice"
                    clipPath="url(#clipPinkStudent)"
                  />
                </g>

                {/* (C2, R3) Green Student */}
                <g>
                  <circle cx={C[2]} cy={R[3]} r={RAD} fill="#88E485" />
                  <image
                    href="/assets/images/hero/student-green.png"
                    x={C[2] - RAD - 3.5}
                    y={R[3] - RAD - 3.5}
                    width={(RAD + 3.5) * 2}
                    height={(RAD + 3.5) * 2}
                    preserveAspectRatio="xMidYMid slice"
                    clipPath="url(#clipGreenStudent)"
                  />
                </g>
              </svg>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

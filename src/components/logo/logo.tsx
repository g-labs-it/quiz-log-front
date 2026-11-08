import type { LinkProps } from '@mui/material/Link';

import { useId } from 'react';
import { mergeClasses } from 'minimal-shared/utils';

import Link from '@mui/material/Link';
import { styled, useTheme } from '@mui/material/styles';

import { RouterLink } from 'src/routes/components';

import { logoClasses } from './classes';

// ----------------------------------------------------------------------

export type LogoProps = LinkProps & {
  isSingle?: boolean;
  disabled?: boolean;
};

export function Logo({
  sx,
  disabled,
  className,
  href = '/',
  isSingle = true,
  ...other
}: LogoProps) {
  const theme = useTheme();

  const gradientId = useId();

  const TEXT_PRIMARY = theme.vars.palette.text.primary;
  const PRIMARY_LIGHT = theme.vars.palette.primary.light;
  const PRIMARY_MAIN = theme.vars.palette.primary.main;
  const PRIMARY_DARKER = theme.vars.palette.primary.dark;

  const singleLogo = (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id={`${gradientId}-bg`}
          x1="0"
          y1="0"
          x2="512"
          y2="512"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={PRIMARY_LIGHT} />
          <stop offset="0.5" stopColor={PRIMARY_MAIN} />
          <stop offset="1" stopColor={PRIMARY_DARKER} />
        </linearGradient>
        <linearGradient
          id={`${gradientId}-check`}
          x1="240"
          y1="180"
          x2="440"
          y2="360"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#5BE49B" />
          <stop offset="1" stopColor="#00A76F" />
        </linearGradient>
        <filter id={`${gradientId}-shadow`} x="0" y="0" width="512" height="512" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="8" stdDeviation="16" floodColor={PRIMARY_DARKER} floodOpacity="0.35" />
        </filter>
      </defs>

      {/* Background Rounded Squircle */}
      <rect
        x="16"
        y="16"
        width="480"
        height="480"
        rx="124"
        fill={`url(#${gradientId}-bg)`}
        filter={`url(#${gradientId}-shadow)`}
      />
      <rect
        x="20"
        y="20"
        width="472"
        height="472"
        rx="120"
        fill="none"
        stroke="rgba(255, 255, 255, 0.2)"
        strokeWidth="6"
      />

      {/* Stylized M for MCQ */}
      <path
        d="M128 356 V188 C128 166 146 148 168 148 C180 148 192 154 200 166 L256 248 L312 166 C320 154 332 148 344 148 C366 148 384 166 384 188 V270"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="42"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Success / Pro Checkmark */}
      <path
        d="M246 288 L320 358 L428 200"
        fill="none"
        stroke={`url(#${gradientId}-check)`}
        strokeWidth="46"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M246 288 L320 358 L428 200"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="32"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const fullLogo = (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 380 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id={`${gradientId}-bg-full`}
          x1="0"
          y1="0"
          x2="90"
          y2="90"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={PRIMARY_LIGHT} />
          <stop offset="0.5" stopColor={PRIMARY_MAIN} />
          <stop offset="1" stopColor={PRIMARY_DARKER} />
        </linearGradient>
      </defs>

      {/* Icon Badge */}
      <g transform="translate(10, 10)">
        <rect width="90" height="90" rx="24" fill={`url(#${gradientId}-bg-full)`} />
        <rect width="90" height="90" rx="24" fill="none" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="2" />
        <path
          d="M26 66 V35 C26 31 29 28 33 28 C35 28 37 29 39 31 L45 42 L51 31 C53 29 55 28 57 28 C61 28 64 31 64 35 V48"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M44 48 L56 61 L74 34"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      {/* Typography: mcqpro */}
      <text
        x="116"
        y="70"
        fontFamily="Barlow, sans-serif, system-ui"
        fontSize="54"
        fontWeight="900"
        fill={TEXT_PRIMARY}
        letterSpacing="-1"
      >
        mcq
      </text>
      <text
        x="218"
        y="70"
        fontFamily="Barlow, sans-serif, system-ui"
        fontSize="54"
        fontWeight="800"
        fill={PRIMARY_MAIN}
        letterSpacing="-0.5"
      >
        pro
      </text>

      {/* Accent dot */}
      <circle cx="304" cy="64" r="5" fill={PRIMARY_LIGHT} />
    </svg>
  );

  return (
    <LogoRoot
      component={RouterLink}
      href={href}
      aria-label="Logo"
      underline="none"
      className={mergeClasses([logoClasses.root, className])}
      sx={[
        {
          width: 40,
          height: 40,
          ...(!isSingle && { width: 125, height: 36 }),
          ...(disabled && { pointerEvents: 'none' }),
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {isSingle ? singleLogo : fullLogo}
    </LogoRoot>
  );
}

// ----------------------------------------------------------------------

const LogoRoot = styled(Link)(() => ({
  flexShrink: 0,
  color: 'transparent',
  display: 'inline-flex',
  verticalAlign: 'middle',
}));

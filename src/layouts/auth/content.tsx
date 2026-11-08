import type { BoxProps } from '@mui/material/Box';

import { mergeClasses } from 'minimal-shared/utils';

import Box from '@mui/material/Box';

import { layoutClasses } from '../core/classes';

// ----------------------------------------------------------------------

export type AuthContentProps = BoxProps;

export function AuthContent({ sx, children, className, ...other }: AuthContentProps) {
  return (
    <Box
      className={mergeClasses([layoutClasses.content, className])}
      sx={[
        (theme) => ({
          py: { xs: 4, sm: 5 },
          px: { xs: 3, sm: 4 },
          width: 1,
          zIndex: 2,
          borderRadius: 2.5,
          border: '1px solid',
          borderColor: theme.vars.palette.divider,
          boxShadow: '0 16px 36px -4px rgba(16, 24, 40, 0.08), 0 4px 12px -2px rgba(16, 24, 40, 0.04)',
          display: 'flex',
          flexDirection: 'column',
          maxWidth: 'var(--layout-auth-content-width)',
          bgcolor: theme.vars.palette.background.paper,
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {children}
    </Box>
  );
}

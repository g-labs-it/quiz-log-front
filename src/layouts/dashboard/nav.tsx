import type { Theme, SxProps, Breakpoint } from '@mui/material/styles';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Collapse from '@mui/material/Collapse';
import ListItem from '@mui/material/ListItem';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import ListItemButton from '@mui/material/ListItemButton';
import Drawer, { drawerClasses } from '@mui/material/Drawer';

import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { Logo } from 'src/components/logo';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import type { NavItem } from '../nav-config-dashboard';

// ----------------------------------------------------------------------

export type NavContentProps = {
  data: NavItem[];
  slots?: {
    topArea?: React.ReactNode;
    bottomArea?: React.ReactNode;
  };
  workspaces?: any[];
  sx?: SxProps<Theme>;
  siteName?: string;
};

export function NavDesktop({
  sx,
  data,
  slots,
  workspaces,
  layoutQuery,
  siteName,
}: NavContentProps & { layoutQuery: Breakpoint }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        pt: 2.5,
        px: 2.5,
        top: 0,
        left: 0,
        height: 1,
        display: 'none',
        position: 'fixed',
        flexDirection: 'column',
        zIndex: 'var(--layout-nav-zIndex)',
        width: 'var(--layout-nav-vertical-width)',
        bgcolor: '#000000',
        borderRight: 'none',
        [theme.breakpoints.up(layoutQuery)]: {
          display: 'flex',
        },
        ...sx,
      }}
    >
      <NavContent data={data} slots={slots} workspaces={workspaces} siteName={siteName} />
    </Box>
  );
}

// ----------------------------------------------------------------------

export function NavMobile({
  sx,
  data,
  open,
  slots,
  onClose,
  workspaces,
  siteName,
}: NavContentProps & { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

  useEffect(() => {
    if (open) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      sx={{
        [`& .${drawerClasses.paper}`]: {
          pt: 2.5,
          px: 2.5,
          overflow: 'unset',
          width: 'var(--layout-nav-mobile-width)',
          bgcolor: '#000000',
          color: 'common.white',
          ...sx,
        },
      }}
    >
      <NavContent data={data} slots={slots} workspaces={workspaces} siteName={siteName} />
    </Drawer>
  );
}

// ----------------------------------------------------------------------

export function NavContent({ data, slots, workspaces, sx, siteName = 'G Labs' }: NavContentProps) {
  const pathname = usePathname();
  const [openCollapse, setOpenCollapse] = useState<Record<string, boolean>>({});

  const handleToggleCollapse = (title: string) => {
    setOpenCollapse((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <Logo sx={{ width: 40, height: 40 }} />
        <Typography
          variant="h5"
          sx={{ fontWeight: 800, color: 'common.white', letterSpacing: 0.5 }}
        >
          <Box component="span" sx={{ color: 'primary.main' }}>
            {siteName.charAt(0)}
          </Box>
          {siteName.slice(1)}
        </Typography>
      </Box>

      {slots?.topArea}

      <Scrollbar fillContent>
        <Box
          component="nav"
          sx={[
            {
              display: 'flex',
              flex: '1 1 auto',
              flexDirection: 'column',
            },
            ...(Array.isArray(sx) ? sx : [sx]),
          ]}
        >
          <Box
            component="ul"
            sx={{
              gap: 0.5,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {data.map((item) => {
              if (item.children && item.children.length > 0) {
                const isChildActived = item.children.some((child) => pathname.startsWith(child.path));
                const isOpen = !!openCollapse[item.title] || isChildActived;

                return (
                  <ListItem disableGutters disablePadding key={item.title} sx={{ display: 'block' }}>
                    <ListItemButton
                      disableGutters
                      onClick={() => handleToggleCollapse(item.title)}
                      sx={[
                        (theme) => ({
                          pl: 2,
                          py: 1.5,
                          gap: 2,
                          pr: 1.5,
                          borderRadius: 0.75,
                          typography: 'body2',
                          fontWeight: 'fontWeightMedium',
                          color: '#919EAB',
                          minHeight: 44,
                          '&:hover': {
                            color: 'common.white',
                            bgcolor: 'rgba(255, 255, 255, 0.08)',
                          },
                          ...(isChildActived && {
                            fontWeight: 'fontWeightSemiBold',
                            color: 'common.white',
                            bgcolor: 'rgba(255, 255, 255, 0.05)',
                          }),
                        }),
                      ]}
                    >
                      <Box component="span" sx={{ width: 24, height: 24 }}>
                        {item.icon}
                      </Box>

                      <Box component="span" sx={{ flexGrow: 1 }}>
                        {item.title}
                      </Box>

                      <Iconify
                        icon={isOpen ? 'eva:arrow-ios-downward-fill' : 'eva:arrow-ios-forward-fill'}
                        width={16}
                        sx={{ color: '#919EAB', mr: 1 }}
                      />
                    </ListItemButton>

                    <Collapse in={isOpen} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding sx={{ pl: 4, mt: 0.5 }}>
                        {item.children.map((child) => {
                          const isSubActived = pathname.startsWith(child.path);

                          return (
                            <ListItem disableGutters disablePadding key={child.title}>
                              <ListItemButton
                                disableGutters
                                component={RouterLink}
                                href={child.path}
                                sx={[
                                  (theme) => ({
                                    pl: 2,
                                    py: 1,
                                    borderRadius: 0.75,
                                    typography: 'body2',
                                    fontWeight: isSubActived ? 'fontWeightSemiBold' : 'fontWeightMedium',
                                    color: isSubActived ? 'common.white' : '#919EAB',
                                    minHeight: 36,
                                    '&:hover': {
                                      color: 'common.white',
                                      bgcolor: 'rgba(255, 255, 255, 0.08)',
                                    },
                                    ...(isSubActived && {
                                      bgcolor: theme.vars.palette.primary.main,
                                      '&:hover': {
                                        bgcolor: theme.vars.palette.primary.dark,
                                      },
                                    }),
                                  }),
                                ]}
                              >
                                <Box component="span" sx={{ flexGrow: 1 }}>
                                  {child.title}
                                </Box>
                              </ListItemButton>
                            </ListItem>
                          );
                        })}
                      </List>
                    </Collapse>
                  </ListItem>
                );
              }

              const isActived = item.path === '/' ? pathname === '/' : pathname.startsWith(item.path);

              return (
                <ListItem disableGutters disablePadding key={item.title}>
                  <ListItemButton
                    disableGutters
                    component={RouterLink}
                    href={item.path}
                    sx={[
                      (theme) => ({
                        pl: 2,
                        py: 1.5,
                        gap: 2,
                        pr: 1.5,
                        borderRadius: 0.75,
                        typography: 'body2',
                        fontWeight: 'fontWeightMedium',
                        color: '#919EAB',
                        minHeight: 44,
                        '&:hover': {
                          color: 'common.white',
                          bgcolor: 'rgba(255, 255, 255, 0.08)',
                        },
                        ...(isActived && {
                          fontWeight: 'fontWeightSemiBold',
                          color: 'common.white',
                          bgcolor: theme.vars.palette.primary.main,
                          '&:hover': {
                            bgcolor: theme.vars.palette.primary.dark,
                          },
                        }),
                      }),
                    ]}
                  >
                    <Box component="span" sx={{ width: 24, height: 24 }}>
                      {item.icon}
                    </Box>

                    <Box component="span" sx={{ flexGrow: 1 }}>
                      {item.title}
                    </Box>

                    {item.info && item.info}
                  </ListItemButton>
                </ListItem>
              );
            })}
          </Box>
        </Box>
      </Scrollbar>

      {slots?.bottomArea}
    </>
  );
}

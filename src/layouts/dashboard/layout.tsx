import type { Breakpoint } from '@mui/material/styles';

import { merge } from 'es-toolkit';
import { useBoolean } from 'minimal-shared/hooks';
import { useMemo, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { useTheme } from '@mui/material/styles';

import axiosInstance from 'src/utils/axios';

import { useAuth } from 'src/auth';
import { _notifications } from 'src/_mock';

import { NavMobile, NavDesktop } from './nav';
import { _account } from '../nav-config-account';
import { dashboardLayoutVars } from './css-vars';
import { navData } from '../nav-config-dashboard';
import { MainSection } from '../core/main-section';
import { Searchbar } from '../components/searchbar';
import { _workspaces } from '../nav-config-workspace';
import { MenuButton } from '../components/menu-button';
import { HeaderSection } from '../core/header-section';
import { LayoutSection } from '../core/layout-section';
import { AccountPopover } from '../components/account-popover';
import { NotificationsPopover } from '../components/notifications-popover';
import { ForceChangePasswordDialog } from './force-change-password-dialog';

import type { MainSectionProps } from '../core/main-section';
import type { HeaderSectionProps } from '../core/header-section';
import type { LayoutSectionProps } from '../core/layout-section';

// ----------------------------------------------------------------------

type LayoutBaseProps = Pick<LayoutSectionProps, 'sx' | 'children' | 'cssVars'>;

export type DashboardLayoutProps = LayoutBaseProps & {
  layoutQuery?: Breakpoint;
  slotProps?: {
    header?: HeaderSectionProps;
    main?: MainSectionProps;
  };
};

export function DashboardLayout({
  sx,
  cssVars,
  children,
  slotProps,
  layoutQuery = 'lg',
}: DashboardLayoutProps) {
  const theme = useTheme();
  const { user } = useAuth();

  const { value: open, onFalse: onClose, onTrue: onOpen } = useBoolean();

  const filteredNavData = useMemo(() => {
    if (!user) return [];
    return navData
      .map((item) => {
        if ('children' in item && Array.isArray(item.children)) {
          return {
            ...item,
            children: item.children.filter((child) => {
              if (child.permission) {
                return user.all_permissions?.includes(child.permission);
              }
              return true;
            }),
          };
        }
        return item;
      })
      .filter((item) => {
        if ('children' in item && Array.isArray(item.children) && item.children.length === 0) {
          return false;
        }
        if (item.permission) {
          return user.all_permissions?.includes(item.permission);
        }
        return true;
      });
  }, [user]);

  const [navColor, setNavColor] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('navColor') || '#000000';
    }
    return '#000000';
  });
  const [siteName, setSiteName] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('siteName') || 'G Labs';
    }
    return 'G Labs';
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
          const response = await axiosInstance.get('/settings');
          if (response.data?.data?.nav_color) {
            const fetchedColor = response.data.data.nav_color;
            setNavColor(fetchedColor);
            localStorage.setItem('navColor', fetchedColor);
          }
          if (response.data?.data?.site_name) {
            const fetchedName = response.data.data.site_name;
            setSiteName(fetchedName);
            localStorage.setItem('siteName', fetchedName);
          }
        }
      } catch {
        // Silence loading errors, fallback to dark color
      }
    };

    fetchSettings();

    window.addEventListener('settings-updated', fetchSettings);
    return () => {
      window.removeEventListener('settings-updated', fetchSettings);
    };
  }, []);

  const renderHeader = () => {
    const headerSlotProps: HeaderSectionProps['slotProps'] = {
      container: {
        maxWidth: false,
      },
    };

    const headerSlots: HeaderSectionProps['slots'] = {
      topArea: (
        <Alert severity="info" sx={{ display: 'none', borderRadius: 0 }}>
          This is an info Alert.
        </Alert>
      ),
      leftArea: (
        <>
          {/** @slot Nav mobile */}
          <MenuButton
            onClick={onOpen}
            sx={{ mr: 1, ml: -1, [theme.breakpoints.up(layoutQuery)]: { display: 'none' } }}
          />
          <NavMobile
            data={filteredNavData}
            open={open}
            onClose={onClose}
            workspaces={_workspaces}
            sx={{ bgcolor: navColor }}
            siteName={siteName}
          />
        </>
      ),
      rightArea: (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0, sm: 0.75 } }}>
          {/** @slot Searchbar */}
          <Searchbar />

          {/** @slot Notifications popover */}
          <NotificationsPopover data={_notifications} />

          {/** @slot Account drawer */}
          <AccountPopover data={_account} />
        </Box>
      ),
    };

    return (
      <HeaderSection
        disableElevation
        layoutQuery={layoutQuery}
        {...slotProps?.header}
        slots={{ ...headerSlots, ...slotProps?.header?.slots }}
        slotProps={merge(headerSlotProps, slotProps?.header?.slotProps ?? {})}
        sx={slotProps?.header?.sx}
      />
    );
  };

  const renderFooter = () => null;

  const renderMain = () => <MainSection {...slotProps?.main}>{children}</MainSection>;

  return (
    <LayoutSection
      /** **************************************
       * @Header
       *************************************** */
      headerSection={renderHeader()}
      /** **************************************
       * @Sidebar
       *************************************** */
      sidebarSection={
        <NavDesktop
          data={filteredNavData}
          layoutQuery={layoutQuery}
          workspaces={_workspaces}
          sx={{ bgcolor: navColor }}
          siteName={siteName}
        />
      }
      /** **************************************
       * @Footer
       *************************************** */
      footerSection={renderFooter()}
      /** **************************************
       * @Styles
       *************************************** */
      cssVars={{ ...dashboardLayoutVars(theme), ...cssVars }}
      sx={[...(Array.isArray(sx) ? sx : [sx])]}
    >
      {renderMain()}
      {user?.needs_password_change && <ForceChangePasswordDialog />}
    </LayoutSection>
  );
}

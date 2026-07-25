import type { RouteObject } from 'react-router';

import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';
import { AuthGuard, GuestGuard, RoleBasedGuard } from 'src/auth';

// ----------------------------------------------------------------------

export const DashboardPage = lazy(() => import('src/pages/dashboard'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const SignInPage = lazy(() => import('src/pages/sign-in'));
export const SignUpPage = lazy(() => import('src/pages/sign-up'));
export const ForgotPasswordPage = lazy(() => import('src/pages/forgot-password'));
export const ResetPasswordPage = lazy(() => import('src/pages/reset-password'));
export const ProfilePage = lazy(() => import('src/pages/profile'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const SettingsPage = lazy(() => import('src/pages/settings'));
export const RolesPage = lazy(() => import('src/pages/roles'));
// Lazy loaded InstitutesPage
export const InstitutesPage = lazy(() => import('src/pages/institutes'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

const renderFallback = () => (
  <Box
    sx={{
      display: 'flex',
      flex: '1 1 auto',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);

export const routesSection: RouteObject[] = [
  {
    element: (
      <AuthGuard>
        <DashboardLayout>
          <Suspense fallback={renderFallback()}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        element: (
          <RoleBasedGuard permissions={['view_dashboard']}>
            <DashboardPage />
          </RoleBasedGuard>
        ),
      },
      {
        path: 'user',
        element: (
          <RoleBasedGuard permissions={['view_user_management']}>
            <UserPage />
          </RoleBasedGuard>
        ),
      },
      { path: 'products', element: <ProductsPage /> },
      { path: 'blog', element: <BlogPage /> },
      { path: 'profile', element: <ProfilePage /> },
      {
        path: 'settings',
        element: (
          <RoleBasedGuard permissions={['setting_management']}>
            <SettingsPage />
          </RoleBasedGuard>
        ),
      },
      {
        path: 'roles',
        element: (
          <RoleBasedGuard permissions={['view_role_management']}>
            <RolesPage />
          </RoleBasedGuard>
        ),
      },
      {
        path: 'institutes',
        element: (
          <RoleBasedGuard permissions={['view_institue_management']}>
            <InstitutesPage />
          </RoleBasedGuard>
        ),
      },
    ],
  },
  {
    path: 'sign-in',
    element: (
      <GuestGuard>
        <AuthLayout>
          <SignInPage />
        </AuthLayout>
      </GuestGuard>
    ),
  },
  {
    path: 'sign-up',
    element: (
      <GuestGuard>
        <AuthLayout>
          <SignUpPage />
        </AuthLayout>
      </GuestGuard>
    ),
  },
  {
    path: 'forgot-password',
    element: (
      <GuestGuard>
        <AuthLayout>
          <ForgotPasswordPage />
        </AuthLayout>
      </GuestGuard>
    ),
  },
  {
    path: 'reset-password',
    element: (
      <GuestGuard>
        <AuthLayout>
          <ResetPasswordPage />
        </AuthLayout>
      </GuestGuard>
    ),
  },
  {
    path: '404',
    element: <Page404 />,
  },
  { path: '*', element: <Page404 /> },
];

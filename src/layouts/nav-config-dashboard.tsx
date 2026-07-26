import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} />;

export type NavItem = {
  title: string;
  path: string;
  icon: React.ReactNode;
  info?: React.ReactNode;
  permission?: string;
  children?: {
    title: string;
    path: string;
    permission?: string;
  }[];
};

export const navData = [
  {
    title: 'Dashboard',
    path: '/',
    icon: icon('ic-analytics'),
    permission: 'view_dashboard',
  },
  {
    title: 'Master Data',
    path: '/master-data',
    icon: icon('ic-db'),
    permission: 'masterdata_management',
    children: [
      {
        title: 'Subjects',
        path: '/subjects',
        permission: 'view_masterdata_management',
      },
    ],
  },
  {
    title: 'Classes',
    path: '/classes',
    icon: icon('ic-course'),
    permission: 'class_management',
  },
  {
    title: 'Institutes',
    path: '/institutes',
    icon: icon('ic-business'),
    permission: 'institue_management',
  },
  {
    title: 'Access Control',
    path: '/access-control',
    icon: icon('ic-lock'),
    children: [
      {
        title: 'Users',
        path: '/user',
        permission: 'view_user_management',
      },
      {
        title: 'Roles & RBAC',
        path: '/roles',
        permission: 'view_role_management',
      },
    ],
  },
  {
    title: 'Settings',
    path: '/settings',
    icon: icon('ic-setting'),
    permission: 'setting_management',
  },
];

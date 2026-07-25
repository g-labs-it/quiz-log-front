import { ForbiddenView } from 'src/sections/error';

import { useAuth } from '../hooks';

// ----------------------------------------------------------------------

type RoleBasedGuardProps = {
  hasContent?: boolean;
  permissions?: string[];
  children: React.ReactNode;
};

export function RoleBasedGuard({ hasContent = true, permissions, children }: RoleBasedGuardProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!user) {
    return null;
  }

  // If permissions are specified, check if user has at least one of them
  if (permissions && permissions.length > 0) {
    const hasPermission = permissions.some((permission) =>
      user.all_permissions?.includes(permission)
    );

    if (!hasPermission) {
      if (hasContent) {
        return <ForbiddenView />;
      }
      return null;
    }
  }

  return <>{children}</>;
}

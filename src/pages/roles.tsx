import { CONFIG } from 'src/config-global';

import { RolesView } from 'src/sections/roles';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Roles & RBAC - ${CONFIG.appName}`}</title>

      <RolesView />
    </>
  );
}

import { CONFIG } from 'src/config-global';

import { InstituteCreateEditView } from 'src/sections/institutes/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Create Institute - ${CONFIG.appName}`}</title>

      <InstituteCreateEditView />
    </>
  );
}

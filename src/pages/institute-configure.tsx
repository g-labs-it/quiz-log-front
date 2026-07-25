import { CONFIG } from 'src/config-global';

import { InstituteConfigureView } from 'src/sections/institutes/view/institute-configure-view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Configure Institute - ${CONFIG.appName}`}</title>

      <InstituteConfigureView />
    </>
  );
}

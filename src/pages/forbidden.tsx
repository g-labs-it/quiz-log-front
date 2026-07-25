import { CONFIG } from 'src/config-global';

import { ForbiddenView } from 'src/sections/error';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`403 Forbidden | Error - ${CONFIG.appName}`}</title>

      <ForbiddenView />
    </>
  );
}

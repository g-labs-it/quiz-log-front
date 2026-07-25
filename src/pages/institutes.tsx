import { CONFIG } from 'src/config-global';

import { InstitutesView } from 'src/sections/institutes/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Institutes - ${CONFIG.appName}`}</title>

      <InstitutesView />
    </>
  );
}

import { CONFIG } from 'src/config-global';

import { InstituteOverviewView } from 'src/sections/institutes/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Institute Overview - ${CONFIG.appName}`}</title>

      <InstituteOverviewView />
    </>
  );
}

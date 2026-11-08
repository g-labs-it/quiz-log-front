import { CONFIG } from 'src/config-global';

import { TeachersView } from 'src/sections/teachers/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Teachers - ${CONFIG.appName}`}</title>

      <TeachersView />
    </>
  );
}


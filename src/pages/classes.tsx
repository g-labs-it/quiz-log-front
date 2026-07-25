import { CONFIG } from 'src/config-global';

import { ClassesView } from 'src/sections/classes/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Classes - ${CONFIG.appName}`}</title>

      <ClassesView />
    </>
  );
}

import { CONFIG } from 'src/config-global';

import { TeacherOverviewView } from 'src/sections/institutes/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Teacher Overview - ${CONFIG.appName}`}</title>

      <TeacherOverviewView />
    </>
  );
}

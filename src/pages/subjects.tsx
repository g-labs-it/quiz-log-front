import { CONFIG } from 'src/config-global';

import { SubjectsView } from 'src/sections/subjects/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Subjects - ${CONFIG.appName}`}</title>

      <SubjectsView />
    </>
  );
}

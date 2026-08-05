import { CONFIG } from 'src/config-global';

import { QuizzesView } from 'src/sections/quizzes/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Quizzes - ${CONFIG.appName}`}</title>

      <QuizzesView />
    </>
  );
}

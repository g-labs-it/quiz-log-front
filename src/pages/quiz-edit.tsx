import { CONFIG } from 'src/config-global';

import { QuizCreateEditView } from 'src/sections/quizzes/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Edit Quiz - ${CONFIG.appName}`}</title>

      <QuizCreateEditView />
    </>
  );
}

import { CONFIG } from 'src/config-global';

import { QuizOverviewView } from 'src/sections/quizzes/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Quiz Details - ${CONFIG.appName}`}</title>

      <QuizOverviewView />
    </>
  );
}

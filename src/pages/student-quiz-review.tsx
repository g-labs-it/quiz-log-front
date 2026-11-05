import { CONFIG } from 'src/config-global';

import { StudentQuizReviewView } from 'src/sections/student-quiz/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Quiz Results - ${CONFIG.appName}`}</title>
      <StudentQuizReviewView />
    </>
  );
}


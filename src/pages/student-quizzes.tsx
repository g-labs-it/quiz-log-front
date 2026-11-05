import { CONFIG } from 'src/config-global';

import { StudentQuizzesView } from 'src/sections/student-quiz/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`My Quizzes - ${CONFIG.appName}`}</title>
      <StudentQuizzesView />
    </>
  );
}


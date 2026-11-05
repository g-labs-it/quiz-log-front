import { CONFIG } from 'src/config-global';

import { StudentQuizTakeView } from 'src/sections/student-quiz/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Take Quiz - ${CONFIG.appName}`}</title>
      <StudentQuizTakeView />
    </>
  );
}


import { CONFIG } from 'src/config-global';

import { AllQuizzesView } from 'src/sections/landing/all-quizzes-view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`All Quizzes | ${CONFIG.appName}`}</title>
      <meta
        name="description"
        content="Browse and take verified practice exams across sciences, mathematics, humanities, and general aptitude on mcqpro."
      />

      <AllQuizzesView />
    </>
  );
}


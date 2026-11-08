import { CONFIG } from 'src/config-global';

import { LandingView } from 'src/sections/landing/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`${CONFIG.appName} | Online Exam Center & MCQ Practice`}</title>
      <meta
        name="description"
        content="mcqpro - Practice thousands of verified multiple-choice questions with timed simulation, instant scoring, and comprehensive explanations."
      />

      <LandingView />
    </>
  );
}


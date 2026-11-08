import { CONFIG } from 'src/config-global';

import { OverviewAnalyticsView as DashboardView } from 'src/sections/overview/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Dashboard - ${CONFIG.appName}`}</title>
      <meta
        name="description"
        content="mcqpro - Modern Online Exam Center and Learning Management System dashboard"
      />
      <meta name="keywords" content="mcqpro,exam,quiz,online test,learning management system,lms,education" />

      <DashboardView />
    </>
  );
}

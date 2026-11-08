import { CONFIG } from 'src/config-global';

import { VerifyEmailView } from 'src/sections/auth/verify-email-view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Verify Email - ${CONFIG.appName}`}</title>

      <VerifyEmailView />
    </>
  );
}


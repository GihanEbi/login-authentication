// app/verify-2fa/page.tsx or wherever your route is
import { Suspense } from "react";
import Setup2FAClient from "@/components/Setup2FAClient";
const Verify2FAWrapper = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Setup2FAClient />
    </Suspense>
  );
};

export default Verify2FAWrapper;

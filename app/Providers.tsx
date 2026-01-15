"use client";

import { RecoilRoot } from "recoil";
import { Analytics } from "@vercel/analytics/react";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <RecoilRoot>
      {children}
      <Analytics />
    </RecoilRoot>
  );
}

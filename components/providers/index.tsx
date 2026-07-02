"use client";

import * as React from "react";
import { ThemeProvider } from "./theme-provider";
import { SmoothScroll } from "./smooth-scroll";
import { PageTransition } from "./page-transition";

type ProvidersProps = {
  children: React.ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <SmoothScroll>
        <PageTransition>
          {children}
        </PageTransition>
      </SmoothScroll>
    </ThemeProvider>
  );
}
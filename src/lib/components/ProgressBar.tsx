'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { useEffect } from 'react';

// Configure NProgress
NProgress.configure({
  showSpinner: false,
  speed: 500,
  minimum: 0.1,
  trickleSpeed: 200,
});

export default function ProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Start progress when route starts changing
    const handleStart = () => {
      NProgress.start();
    };

    // Complete progress when route change is done
    const handleComplete = () => {
      NProgress.done();
    };

    // Route change started
    handleStart();

    // Route change completed
    const timer = setTimeout(() => {
      handleComplete();
    }, 100);

    return () => {
      clearTimeout(timer);
      NProgress.done();
    };
  }, [pathname, searchParams]);

  return null;
}
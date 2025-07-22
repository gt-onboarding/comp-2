'use client';

import { useEffect } from 'react';
import { T } from 'gt-next';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('app/(app)/setup/error.tsx', error);
  }, [error]);

  return (
    <div>
      <h2><T>Something went wrong!</T></h2>
      <button onClick={reset} type="button">
        <T>Try again</T>
      </button>
    </div>
  );
}

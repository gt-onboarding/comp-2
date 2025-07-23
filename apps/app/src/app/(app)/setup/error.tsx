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
    <T>
      <div>
        <h2>Something went wrong!</h2>
        <button onClick={reset} type="button">
          Try again
        </button>
      </div>
    </T>
  );
}

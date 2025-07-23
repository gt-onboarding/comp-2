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
      <T><h2>Something went wrong!</h2></T>
      <T><button onClick={reset} type="button">
        Try again
      </button></T>
    </div>
  );
}

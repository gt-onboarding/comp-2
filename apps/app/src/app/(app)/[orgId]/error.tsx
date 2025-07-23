'use client';

import { Button } from '@comp/ui/button';
import { T } from 'gt-next';
import Link from 'next/link';
import { useEffect } from 'react';

export default function ErrorPage({
  reset,
  error,
}: {
  reset: () => void;
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    console.error('app/(app)/(dashboard)/[orgId]/error.tsx', error);
  }, [error]);

  return (
    <div className="h-[calc(100vh-200px)] w-full">
      <div className="mt-8 flex h-full flex-col items-center justify-center">
        <div className="mt-8 mb-8 flex flex-col items-center justify-between text-center">
          <T>
            <h2 className="mb-4 font-medium">Something went wrong</h2>
          </T>
          <T>
            <p className="text-sm text-[#878787]">
              An unexpected error has occurred. Please try again
              <br /> or contact support if the issue persists.
            </p>
          </T>
        </div>

        <div className="flex space-x-4">
          <Button onClick={() => reset()} variant="outline">
            <T>Try again</T>
          </Button>

          <Link href="/account/support">
            <Button>
              <T>Contact us</T>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

'use client';

import { Button } from '@comp/ui/button';
import { useRouter } from 'next/navigation';
import { T } from 'gt-next';

export function ErrorFallback() {
  const router = useRouter();

  return (
    <div className="flex h-full flex-col items-center justify-center space-y-4">
      <T>
        <div>
          <h2 className="text-md">Something went wrong</h2>
        </div>
      </T>
      <T>
        <Button onClick={() => router.refresh()} variant="outline">
          Try again
        </Button>
      </T>
    </div>
  );
}

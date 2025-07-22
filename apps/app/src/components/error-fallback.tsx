'use client';

import { Button } from '@comp/ui/button';
import { useRouter } from 'next/navigation';
import { T, useGT } from 'gt-next';

export function ErrorFallback() {
  const router = useRouter();
  const t = useGT();

  return (
    <div className="flex h-full flex-col items-center justify-center space-y-4">
      <div>
        <T>
          <h2 className="text-md">Something went wrong</h2>
        </T>
      </div>
      <Button onClick={() => router.refresh()} variant="outline">
        {t('Try again')}
      </Button>
    </div>
  );
}

'use client';

import { authClient } from '@/utils/auth-client';
import { Button } from '@comp/ui/button';
import { DropdownMenuItem } from '@comp/ui/dropdown-menu';
import { T, Branch, useGT } from 'gt-next';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function SignOut({ asButton = false }: { asButton?: boolean }) {
  const router = useRouter();
  const [isLoading, setLoading] = useState(false);
  const t = useGT();

  const handleSignOut = async () => {
    setLoading(true);
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/auth');
        },
      },
    });
  };

  if (asButton) {
    return (
      <Button onClick={handleSignOut}>
        <T>
          <Branch
            branch={isLoading.toString()}
            true={t('Loading...')}
            false={t('Sign out')}
          />
        </T>
      </Button>
    );
  }

  return (
    <DropdownMenuItem onClick={handleSignOut}>
      <T>
        <Branch
          branch={isLoading.toString()}
          true={t('Loading...')}
          false={t('Sign out')}
        />
      </T>
    </DropdownMenuItem>
  );
}

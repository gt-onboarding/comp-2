'use client';

import { archivePolicyAction } from '@/actions/policies/archive-policy';
import { Policy } from '@comp/db/types';
import { Button } from '@comp/ui/button';
import { Drawer, DrawerContent, DrawerTitle } from '@comp/ui/drawer';
import { useMediaQuery } from '@comp/ui/hooks';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@comp/ui/sheet';
import { ArchiveIcon, ArchiveRestoreIcon, X } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { useRouter } from 'next/navigation';
import { useQueryState } from 'nuqs';
import { toast } from 'sonner';
import { T, useGT, Branch } from 'gt-next';

export function PolicyArchiveSheet({ policy }: { policy: Policy }) {
  const t = useGT();
  const router = useRouter();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [open, setOpen] = useQueryState('archive-policy-sheet');
  const isOpen = Boolean(open);
  const isArchived = policy.isArchived;

  const archivePolicy = useAction(archivePolicyAction, {
    onSuccess: (result) => {
      if (result) {
        toast.success(t('Policy archived successfully'));
        // Redirect to policies list after successful archive
        router.push(`/${policy.organizationId}/policies/all`);
      } else {
        toast.success(t('Policy restored successfully'));
        // Stay on the policy page after restore
        router.refresh();
      }
      handleOpenChange(false);
    },
    onError: () => {
      toast.error(t('Failed to update policy archive status'));
    },
  });

  const handleOpenChange = (open: boolean) => {
    setOpen(open ? 'true' : null);
  };

  const handleAction = () => {
    archivePolicy.execute({
      id: policy.id,
      action: isArchived ? 'restore' : 'archive',
      entityId: policy.id,
    });
  };

  const content = (
    <div className="space-y-6">
      <T>
        <p className="text-muted-foreground text-sm">
          <Branch
            branch={isArchived}
            true="Are you sure you want to restore this policy?"
            false="Are you sure you want to archive this policy?"
          />
        </p>
      </T>
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={() => handleOpenChange(false)}
          disabled={archivePolicy.status === 'executing'}
        >
          <T>Cancel</T>
        </Button>
        <Button
          variant={isArchived ? 'default' : 'destructive'}
          onClick={handleAction}
          disabled={archivePolicy.status === 'executing'}
        >
          {archivePolicy.status === 'executing' ? (
            <T>
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                <Branch
                  branch={isArchived}
                  true="Restore"
                  false="Archive"
                />
              </span>
            </T>
          ) : (
            <T>
              <span className="flex items-center gap-2">
                <Branch
                  branch={isArchived}
                  true={
                    <>
                      <ArchiveRestoreIcon className="h-3 w-3" />
                      Restore
                    </>
                  }
                  false={
                    <>
                      <ArchiveIcon className="h-3 w-3" />
                      Archive
                    </>
                  }
                />
              </span>
            </T>
          )}
        </Button>
      </div>
    </div>
  );

  if (isDesktop) {
    return (
      <Sheet open={isOpen} onOpenChange={handleOpenChange}>
        <SheetContent>
          <SheetHeader className="mb-6">
            <div className="flex flex-row items-center justify-between">
              <T>
                <SheetTitle>
                  <Branch
                    branch={isArchived}
                    true="Restore Policy"
                    false="Archive Policy"
                  />
                </SheetTitle>
              </T>
              <Button
                size="icon"
                variant="ghost"
                className="m-0 size-auto p-0 hover:bg-transparent"
                onClick={() => setOpen(null)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <SheetDescription>{policy.name}</SheetDescription>
          </SheetHeader>
          {content}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={handleOpenChange}>
      <T>
        <DrawerTitle hidden>
          <Branch
            branch={isArchived}
            true="Restore Policy"
            false="Archive Policy"
          />
        </DrawerTitle>
      </T>
      <DrawerContent className="p-6">
        <div className="mb-4">
          <T>
            <h3 className="text-lg font-medium">
              <Branch
                branch={isArchived}
                true="Restore Policy"
                false="Archive Policy"
              />
            </h3>
          </T>
          <p className="text-muted-foreground mt-1 text-sm">{policy.name}</p>
        </div>
        {content}
      </DrawerContent>
    </Drawer>
  );
}

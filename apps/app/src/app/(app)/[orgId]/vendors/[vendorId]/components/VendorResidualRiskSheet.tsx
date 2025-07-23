'use client';

import { ResidualRiskForm } from '@/app/(app)/[orgId]/vendors/[vendorId]/forms/risks/ResidualRiskForm';
import type { Vendor } from '@comp/db/types';
import { Button } from '@comp/ui/button';
import { Drawer, DrawerContent, DrawerTitle } from '@comp/ui/drawer';
import { useMediaQuery } from '@comp/ui/hooks';
import { ScrollArea } from '@comp/ui/scroll-area';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@comp/ui/sheet';
import { X } from 'lucide-react';
import { useQueryState } from 'nuqs';
import { T } from 'gt-next';

export function VendorResidualRiskSheet({
  vendorId,
  initialRisk,
}: {
  vendorId: string;
  initialRisk?: Vendor;
}) {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [isOpen, setOpen] = useQueryState('residual-risk-sheet');
  const open = isOpen === 'true';

  if (isDesktop) {
    return (
      <Sheet open={open} onOpenChange={(value) => setOpen(value ? 'true' : 'false')}>
        <SheetContent stack>
          <SheetHeader className="mb-8">
            <div className="flex flex-row items-center justify-between">
              <SheetTitle><T>Update Residual Risk</T></SheetTitle>
              <Button
                size="icon"
                variant="ghost"
                className="m-0 size-auto p-0 hover:bg-transparent"
                onClick={() => setOpen('false')}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <SheetDescription><T>Select the residual risk level for this vendor</T></SheetDescription>
          </SheetHeader>

          <ScrollArea className="h-full p-0 pb-[100px]" hideScrollbar>
            <ResidualRiskForm
              vendorId={vendorId}
              initialProbability={initialRisk?.residualProbability}
              initialImpact={initialRisk?.residualImpact}
            />
          </ScrollArea>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Drawer open={open}>
      <DrawerTitle hidden><T>Update Residual Risk</T></DrawerTitle>
      <DrawerContent className="p-6">
        <ResidualRiskForm
          vendorId={vendorId}
          initialProbability={initialRisk?.residualProbability}
          initialImpact={initialRisk?.residualImpact}
        />
      </DrawerContent>
    </Drawer>
  );
}

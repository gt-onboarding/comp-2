'use client';

import { cn } from '@comp/ui/cn';
import { useGT } from 'gt-next';

export const VENDOR_STATUS_TYPES = ['not_assessed', 'in_progress', 'assessed'] as const;

export type VendorStatusType = Exclude<(typeof VENDOR_STATUS_TYPES)[number], 'draft' | 'published'>;

const VENDOR_STATUS_COLORS: Record<VendorStatusType, string> = {
  not_assessed: '#ffc107',
  in_progress: '#0ea5e9',
  assessed: '#22c55e',
} as const;

export function VendorStatus({ status }: { status: VendorStatusType }) {
  const t = useGT();
  
  const getStatusLabel = (status: VendorStatusType) => {
    switch (status) {
      case 'not_assessed':
        return t('Not Assessed');
      case 'in_progress':
        return t('In Progress');
      case 'assessed':
        return t('Assessed');
      default:
        return status.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase());
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div
        className={cn('size-2.5 rounded-full')}
        style={{
          backgroundColor: VENDOR_STATUS_COLORS[status] ?? '  ',
        }}
      />
      {getStatusLabel(status)}
    </div>
  );
}

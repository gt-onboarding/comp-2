'use client';

import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { StatusIndicator } from '@/components/status-indicator';
import { T, useGT } from 'gt-next';
import { ColumnDef } from '@tanstack/react-table';
import { ControlWithRelations } from '../data/queries';
import { getControlStatus } from '../lib/utils';

export function getControlColumns(): ColumnDef<ControlWithRelations>[] {
  const t = useGT();
  
  return [
    {
      id: 'name',
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('Control Name')} />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <span className="max-w-[31.25rem] truncate font-medium">{row.getValue('name')}</span>
          </div>
        );
      },
      meta: {
        label: t('Control Name'),
        placeholder: t('Search for a control...'),
        variant: 'text',
      },
      enableColumnFilter: true,
      filterFn: (row, id, value) => {
        return value.length === 0
          ? true
          : String(row.getValue(id)).toLowerCase().includes(String(value).toLowerCase());
      },
    },
    {
      id: 'status',
      accessorKey: '',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('Status')} />
      ),
      cell: ({ row }) => {
        const control = row.original;
        const status = getControlStatus(control);

        return <StatusIndicator status={status} />;
      },
      meta: {
        label: t('Status'),
        placeholder: t('Search status...'),
        variant: 'text',
      },
      enableSorting: false,
    },
  ];
}

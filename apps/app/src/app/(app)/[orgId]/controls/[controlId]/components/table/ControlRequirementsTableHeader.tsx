'use client';

import { TableHead, TableHeader, TableRow } from '@comp/ui/table';
import type { Table } from '@tanstack/react-table';
import { T } from 'gt-next';
import type { RequirementTableData } from './ControlRequirementsTable';

type Props = {
  table: Table<RequirementTableData>;
  loading?: boolean;
};

export function ControlRequirementsTableHeader({ table, loading }: Props) {
  const isVisible = (id: string) =>
    loading ||
    table
      .getAllLeafColumns()
      .find((col) => col.id === id)
      ?.getIsVisible();

  return (
    <TableHeader>
      <TableRow className="hover:bg-transparent">
        {isVisible('type') && (
          <TableHead className="h-11 px-4 text-left align-middle font-medium">
            <T>Type</T>
          </TableHead>
        )}
        {isVisible('description') && (
          <TableHead className="h-11 px-4 text-left align-middle font-medium">
            <T>Description</T>
          </TableHead>
        )}
        {isVisible('status') && (
          <TableHead className="h-11 px-4 text-left align-middle font-medium">
            <T>Status</T>
          </TableHead>
        )}
      </TableRow>
    </TableHeader>
  );
}

import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { VendorStatus } from '@/components/vendor-status';
import { Avatar, AvatarFallback, AvatarImage } from '@comp/ui/avatar';
import { Badge } from '@comp/ui/badge';
import type { ColumnDef } from '@tanstack/react-table';
import { UserIcon } from 'lucide-react';
import Link from 'next/link';
import { T, Var } from 'gt-next';
import type { GetVendorsResult } from '../data/queries';

type VendorRow = GetVendorsResult['data'][number];

export const columns: ColumnDef<VendorRow>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title={<T>Vendor Name</T>} />;
    },
    cell: ({ row }) => {
      return (
        <Link href={`/${row.original.organizationId}/vendors/${row.original.id}`}>
          {row.original.name}
        </Link>
      );
    },
    meta: {
      label: <T>Vendor Name</T>,
      placeholder: <T>Search for vendor name...</T>,
      variant: 'text',
    },
    size: 250,
    minSize: 200,
    maxSize: 300,
    enableColumnFilter: true,
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title={<T>Status</T>} />;
    },
    cell: ({ row }) => {
      return <VendorStatus status={row.original.status} />;
    },
    meta: {
      label: <T>Status</T>,
      placeholder: <T>Search by status...</T>,
      variant: 'select',
    },
  },
  {
    id: 'category',
    accessorKey: 'category',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title={<T>Category</T>} />;
    },
    cell: ({ row }) => {
      const categoryMap: Record<string, JSX.Element> = {
        cloud: <T>Cloud</T>,
        infrastructure: <T>Infrastructure</T>,
        software_as_a_service: <T>SaaS</T>,
        finance: <T>Finance</T>,
        marketing: <T>Marketing</T>,
        sales: <T>Sales</T>,
        hr: <T>HR</T>,
        other: <T>Other</T>,
      };

      return (
        <Badge variant="marketing" className="w-fit">
          {categoryMap[row.original.category] || <T><Var>{row.original.category}</Var></T>}
        </Badge>
      );
    },
    meta: {
      label: <T>Category</T>,
      placeholder: <T>Search by category...</T>,
      variant: 'select',
    },
  },
  {
    id: 'assignee',
    accessorKey: 'assignee',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title={<T>Assignee</T>} />;
    },
    enableSorting: false,
    cell: ({ row }) => {
      // Handle null assignee
      if (!row.original.assignee) {
        return (
          <div className="flex items-center gap-2">
            <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-full">
              <UserIcon className="text-muted-foreground h-4 w-4" />
            </div>
            <p className="text-muted-foreground text-sm font-medium"><T>None</T></p>
          </div>
        );
      }

      return (
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={row.original.assignee.user?.image || undefined}
              alt={row.original.assignee.user?.name || row.original.assignee.user?.email || ''}
            />
            <AvatarFallback>
              {row.original.assignee.user?.name?.charAt(0) ||
                row.original.assignee.user?.email?.charAt(0).toUpperCase() ||
                '?'}
            </AvatarFallback>
          </Avatar>
          <p className="text-sm font-medium">
            {row.original.assignee.user?.name ||
              row.original.assignee.user?.email ||
              <T>Unknown User</T>}
          </p>
        </div>
      );
    },
    meta: {
      label: <T>Assignee</T>,
      placeholder: <T>Search by assignee...</T>,
      variant: 'select',
    },
  },
];

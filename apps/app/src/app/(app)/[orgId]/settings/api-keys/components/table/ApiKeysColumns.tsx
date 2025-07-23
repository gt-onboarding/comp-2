import { revokeApiKeyAction } from '@/actions/organization/revoke-api-key-action';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import type { ApiKey } from '@/hooks/use-api-keys';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@comp/ui/alert-dialog';
import { Button } from '@comp/ui/button';
import { T, useGT, Branch } from 'gt-next';
import type { ColumnDef } from '@tanstack/react-table';
import { Trash2 } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { useState } from 'react';

// Extract the cell content into a separate component
function ApiKeyActionsCell({ apiKey }: { apiKey: ApiKey }) {
  const t = useGT();
  const [open, setOpen] = useState(false);
  const { execute, status } = useAction(revokeApiKeyAction, {
    onSuccess: () => {
      setOpen(false);
    },
  });

  return (
    <AlertDialog open={open ?? false} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive hover:bg-destructive/10"
          onClick={() => setOpen(true)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle><T>Revoke API Key</T></AlertDialogTitle>
          <AlertDialogDescription>
            <T>Are you sure you want to revoke this API key? This action cannot be undone.</T>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel><T>Cancel</T></AlertDialogCancel>
          <AlertDialogAction
            onClick={() => execute({ id: apiKey.id })}
            disabled={status === 'executing'}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            <T>
              <Branch
                branch={status}
                executing="Revoking..."
              >
                Revoke
              </Branch>
            </T>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export const columns = (): ColumnDef<ApiKey>[] => [
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title={<T>Name</T>} />,
    cell: ({ row }) => <span>{row.original.name}</span>,
    meta: { label: <T>Name</T>, variant: 'text' },
    enableColumnFilter: true,
    enableSorting: true,
    size: 200,
    minSize: 200,
    maxSize: 200,
  },
  {
    id: 'createdAt',
    accessorKey: 'createdAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title={<T>Created</T>} />,
    cell: ({ row }) => <span>{new Date(row.original.createdAt).toISOString().slice(0, 10)}</span>,
    meta: { label: <T>Created</T> },
    enableColumnFilter: false,
    enableSorting: false,
    size: 120,
    minSize: 100,
    maxSize: 150,
  },
  {
    id: 'expiresAt',
    accessorKey: 'expiresAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title={<T>Expires</T>} />,
    cell: ({ row }) => (
      <span>
        {row.original.expiresAt
          ? new Date(row.original.expiresAt).toISOString().slice(0, 10)
          : <T>Never</T>}
      </span>
    ),
    meta: { label: <T>Expires</T> },
    enableColumnFilter: false,
    enableSorting: false,
    size: 120,
    minSize: 100,
    maxSize: 150,
  },
  {
    id: 'lastUsedAt',
    accessorKey: 'lastUsedAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title={<T>Last Used</T>} />,
    cell: ({ row }) => (
      <span>
        {row.original.lastUsedAt
          ? new Date(row.original.lastUsedAt).toISOString().slice(0, 10)
          : <T>Never</T>}
      </span>
    ),
    meta: { label: <T>Last Used</T> },
    enableColumnFilter: false,
    enableSorting: false,
    size: 120,
    minSize: 100,
    maxSize: 150,
  },
  {
    id: 'actions',
    header: () => <span><T>Actions</T></span>,
    cell: ({ row }) => <ApiKeyActionsCell apiKey={row.original} />,
    meta: { label: <T>Actions</T> },
    enableColumnFilter: false,
    enableSorting: false,
    size: 60,
    minSize: 60,
  },
];

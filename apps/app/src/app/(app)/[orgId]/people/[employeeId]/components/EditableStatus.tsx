'use client';

import type { EmployeeStatusType } from '@/components/tables/people/employee-status';
import { getEmployeeStatusFromBoolean } from '@/components/tables/people/employee-status';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@comp/ui/select';
import { useGT } from 'gt-next';
import { useAction } from 'next-safe-action/hooks';
import { useState } from 'react';
import { toast } from 'sonner';
import { updateEmployeeStatus } from '../actions/update-employee-status';

interface EditableStatusProps {
  employeeId: string;
  currentStatus: boolean;
  onSuccess?: () => void;
}

export function EditableStatus({ employeeId, currentStatus, onSuccess }: EditableStatusProps) {
  const initialStatus = getEmployeeStatusFromBoolean(currentStatus);
  const [status, setStatus] = useState<EmployeeStatusType>(initialStatus);
  const t = useGT();

  const getStatusOptions = () => [
    { value: 'active', label: t('Active') },
    { value: 'inactive', label: t('Inactive') },
  ];

  const { execute, status: actionStatus } = useAction(updateEmployeeStatus, {
    onSuccess: () => {
      toast.success(t('Employee status updated successfully'));
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error?.error?.serverError || t('Failed to update employee status'));
    },
  });

  const handleSave = () => {
    const isActive = status === 'active';
    execute({ employeeId, isActive });
  };

  return (
    <div>
      <Select value={status} onValueChange={(value) => setStatus(value as EmployeeStatusType)}>
        <SelectTrigger className="h-8 w-full">
          <SelectValue placeholder={t('Select status')} />
        </SelectTrigger>
        <SelectContent>
          {getStatusOptions().map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

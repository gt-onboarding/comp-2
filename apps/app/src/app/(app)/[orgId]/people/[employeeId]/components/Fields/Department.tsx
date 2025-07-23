import type { Departments } from '@comp/db/types';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@comp/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@comp/ui/select';
import type { Control } from 'react-hook-form';
import { useGT } from 'gt-next';
import type { EmployeeFormValues } from '../EmployeeDetails';

export const Department = ({ control }: { control: Control<EmployeeFormValues> }) => {
  const t = useGT();
  
  const departments = [
    { value: 'admin' as const, label: t('Admin') },
    { value: 'gov' as const, label: t('Governance') },
    { value: 'hr' as const, label: t('HR') },
    { value: 'it' as const, label: t('IT') },
    { value: 'itsm' as const, label: t('IT Service Management') },
    { value: 'qms' as const, label: t('Quality Management') },
    { value: 'none' as const, label: t('None') },
  ];

  return (
    <FormField
      control={control}
      name="department"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel className="text-muted-foreground text-xs font-medium uppercase">
            {t('Department')}
          </FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
            <FormControl>
              <SelectTrigger className="h-10">
                <SelectValue placeholder={t('Select department')} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept.value} value={dept.value}>
                  {dept.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

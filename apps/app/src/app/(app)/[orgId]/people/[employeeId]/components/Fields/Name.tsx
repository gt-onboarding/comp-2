import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@comp/ui/form';
import { Input } from '@comp/ui/input';
import type { Control } from 'react-hook-form';
import type { EmployeeFormValues } from '../EmployeeDetails';
import { useGT } from 'gt-next';

export const Name = ({ control }: { control: Control<EmployeeFormValues> }) => {
  const t = useGT();
  
  return (
    <FormField
      control={control}
      name="name"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel className="text-muted-foreground text-xs font-medium uppercase">
            {t('NAME')}
          </FormLabel>
          <FormControl>
            <Input {...field} placeholder={t('Employee name')} className="h-10" />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

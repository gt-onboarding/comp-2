import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@comp/ui/form';
import { Input } from '@comp/ui/input';
import type { Control } from 'react-hook-form';
import type { EmployeeFormValues } from '../EmployeeDetails';
import { useGT } from 'gt-next';

export const Email = ({ control }: { control: Control<EmployeeFormValues> }) => {
  const t = useGT();
  
  return (
    <FormField
      control={control}
      name="email"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel className="text-muted-foreground text-xs font-medium uppercase">
            {t('EMAIL')}
          </FormLabel>
          <FormControl>
            <Input {...field} type="email" placeholder={t('Employee email')} className="h-10" disabled />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

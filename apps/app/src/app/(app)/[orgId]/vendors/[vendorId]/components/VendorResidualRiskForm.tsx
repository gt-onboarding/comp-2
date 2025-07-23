'use client';

import { updateResidualRiskAction } from '@/actions/risk/update-residual-risk-action';
import { updateResidualRiskSchema } from '@/actions/schema';
import { Button } from '@comp/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@comp/ui/form';
import { Slider } from '@comp/ui/slider';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { useQueryState } from 'nuqs';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';
import { T, useGT } from 'gt-next';

interface ResidualRiskFormProps {
  riskId: string;
  initialProbability: number;
  initialImpact: number;
  onSuccess?: () => void;
}

interface FormData {
  probability: number;
  impact: number;
}

export function VendorResidualRiskForm({
  riskId,
  initialProbability,
  initialImpact,
}: ResidualRiskFormProps) {
  const [_, setOpen] = useQueryState('residual-risk-sheet');
  const t = useGT();

  const form = useForm<z.infer<typeof updateResidualRiskSchema>>({
    resolver: zodResolver(updateResidualRiskSchema),
    defaultValues: {
      id: riskId,
      probability: initialProbability ? initialProbability : 0,
      impact: initialImpact ? initialImpact : 0,
    },
  });

  const updateResidualRisk = useAction(updateResidualRiskAction, {
    onSuccess: () => {
      toast.success(t('Residual risk updated successfully'));
      setOpen(null);
    },
    onError: () => {
      toast.error(t('Failed to update residual risk'));
    },
  });

  const onSubmit = (data: z.infer<typeof updateResidualRiskSchema>) => {
    updateResidualRisk.execute(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="probability"
          render={({ field }) => (
            <FormItem>
              <FormLabel><T>Probability</T></FormLabel>
              <FormControl>
                <Slider
                  min={1}
                  max={10}
                  step={1}
                  value={[field.value]}
                  onValueChange={(value) => field.onChange(value[0])}
                  className="py-4"
                />
              </FormControl>
              <FormDescription className="text-right">{t('{value} / 10', { value: field.value })}</FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="impact"
          render={({ field }) => (
            <FormItem>
              <FormLabel><T>Impact</T></FormLabel>
              <FormControl>
                <Slider
                  min={1}
                  max={10}
                  step={1}
                  value={[field.value]}
                  onValueChange={(value) => field.onChange(value[0])}
                  className="py-4"
                />
              </FormControl>
              <FormDescription className="text-right">{t('{value} / 10', { value: field.value })}</FormDescription>
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            variant="default"
            disabled={updateResidualRisk.status === 'executing'}
          >
            {updateResidualRisk.status === 'executing' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <T>Save</T>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

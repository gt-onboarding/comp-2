'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { T, useGT, Var, Branch } from 'gt-next';
import { Loader2 } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

import { addFrameworksToOrganizationAction } from '@/actions/organization/add-frameworks-to-organization-action';
import { addFrameworksSchema } from '@/actions/schema';
import { FrameworkCard } from '@/components/framework-card';
import type { FrameworkEditorFramework } from '@comp/db/types';
import { Button } from '@comp/ui/button';
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@comp/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@comp/ui/form';

type Props = {
  onOpenChange: (isOpen: boolean) => void;
  availableFrameworks: Pick<
    FrameworkEditorFramework,
    'id' | 'name' | 'description' | 'version' | 'visible'
  >[];
  organizationId: string;
};

export function AddFrameworkModal({ onOpenChange, availableFrameworks, organizationId }: Props) {
  const router = useRouter();
  const t = useGT();

  const form = useForm<z.infer<typeof addFrameworksSchema>>({
    resolver: zodResolver(addFrameworksSchema),
    defaultValues: {
      frameworkIds: [],
      organizationId: organizationId,
    },
    mode: 'onChange',
  });

  const { execute, isExecuting } = useAction(addFrameworksToOrganizationAction, {
    onSuccess: (data) => {
      const frameworksAdded = data.data?.frameworksAdded ?? 0;
      toast.success(
        t('Successfully added {count} framework{plural}', {
          count: frameworksAdded,
          plural: frameworksAdded > 1 ? 's' : '',
        }),
      );
      onOpenChange(false);
      router.refresh();
    },
    onError: (error) => {
      if (error.error.serverError) {
        toast.error(error.error.serverError);
      } else if (error.error.validationErrors) {
        const errorMessages = Object.values(error.error.validationErrors).flat().join(', ');
        toast.error(errorMessages || t('Validation error occurred'));
      } else {
        toast.error(t('Failed to add frameworks'));
      }
    },
  });

  const onSubmit = async (data: z.infer<typeof addFrameworksSchema>) => {
    execute(data);
  };

  const handleOpenChange = (open: boolean) => {
    if (isExecuting && !open) return;
    onOpenChange(open);
  };

  return (
    <DialogContent className="max-w-md">
      <DialogHeader className="space-y-2">
        <T>
          <DialogTitle className="text-base font-medium">Add Frameworks</DialogTitle>
        </T>
        <T>
          <DialogDescription className="text-muted-foreground text-sm">
            <Branch
              branch={availableFrameworks.length > 0 ? 'available' : 'none'}
              available="Select the compliance frameworks to add to your organization."
              none="No new frameworks are available to add at this time."
            />
          </DialogDescription>
        </T>
      </DialogHeader>

      {!isExecuting && availableFrameworks.length > 0 && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="frameworkIds"
              render={({ field }) => (
                <FormItem>
                  <T>
                    <FormLabel className="text-sm font-normal">Available Frameworks</FormLabel>
                  </T>
                  <FormControl>
                    <div className="max-h-80 space-y-3 overflow-y-auto pr-1">
                      {availableFrameworks
                        .filter((framework) => framework.visible)
                        .map((framework) => (
                          <FrameworkCard
                            key={framework.id}
                            framework={framework}
                            isSelected={field.value.includes(framework.id)}
                            onSelectionChange={(checked) => {
                              const newValue = checked
                                ? [...field.value, framework.id]
                                : field.value.filter((id) => id !== framework.id);
                              field.onChange(newValue);
                            }}
                          />
                        ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 border-t pt-4">
              <T>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenChange(false)}
                  disabled={isExecuting}
                >
                  Cancel
                </Button>
              </T>
              <Button
                type="submit"
                size="sm"
                disabled={isExecuting || form.getValues('frameworkIds').length === 0}
              >
                {isExecuting && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                <T>Add Selected</T>
              </Button>
            </DialogFooter>
          </form>
        </Form>
      )}

      {!isExecuting && availableFrameworks.length === 0 && (
        <div className="py-6 text-center">
          <T>
            <div className="text-muted-foreground text-sm">
              All available frameworks are already enabled in your organization.
            </div>
          </T>
          <DialogFooter className="mt-6 border-t pt-4">
            <T>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleOpenChange(false)}
              >
                Close
              </Button>
            </T>
          </DialogFooter>
        </div>
      )}

      {isExecuting && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
          <T>
            <span className="text-muted-foreground ml-3 text-sm">Adding frameworks...</span>
          </T>
        </div>
      )}
    </DialogContent>
  );
}

'use server';

import { researchVendor } from '@/jobs/tasks/scrape/research';
import { tasks } from '@trigger.dev/sdk/v3';
import { z } from 'zod';
import { getGT } from 'gt-next/server';
import { authActionClient } from './safe-action';

export const researchVendorAction = authActionClient
  .inputSchema(async () => {
    const t = await getGT();
    return z.object({
      website: z.string().url({ message: t('Invalid URL format') }),
    });
  })
  .metadata({
    name: 'research-vendor',
  })
  .action(async ({ parsedInput: { website }, ctx: { session } }) => {
    const t = await getGT();
    try {
      const { activeOrganizationId } = session;

      if (!activeOrganizationId) {
        return {
          success: false,
          error: t('Not authorized'),
        };
      }

      const handle = await tasks.trigger<typeof researchVendor>('research-vendor', {
        website,
      });

      return {
        success: true,
        handle,
      };
    } catch (error) {
      console.error('Error in researchVendorAction:', error);

      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : t('An unexpected error occurred.'),
        },
      };
    }
  });

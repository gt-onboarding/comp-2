'use server';

import { authActionClient } from '@/actions/safe-action';
import { db } from '@comp/db';
import { getGT } from 'gt-next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { z } from 'zod';

const deleteControlSchema = z.object({
  id: z.string(),
  entityId: z.string(),
});

export const deleteControlAction = authActionClient
  .inputSchema(deleteControlSchema)
  .metadata({
    name: 'delete-control',
    track: {
      event: 'delete-control',
      description: 'Delete Control',
      channel: 'server',
    },
  })
  .action(async ({ parsedInput, ctx }) => {
    const { id } = parsedInput;
    const { activeOrganizationId } = ctx.session;

    if (!activeOrganizationId) {
      const t = await getGT();
      return {
        success: false,
        error: t('Not authorized'),
      };
    }

    try {
      const control = await db.control.findUnique({
        where: {
          id,
          organizationId: activeOrganizationId,
        },
      });

      if (!control) {
        const t = await getGT();
        return {
          success: false,
          error: t('Control not found'),
        };
      }

      // Delete the control
      await db.control.delete({
        where: { id },
      });

      // Revalidate paths to update UI
      revalidatePath(`/${activeOrganizationId}/controls/all`);
      revalidatePath(`/${activeOrganizationId}/controls`);
      revalidateTag('controls');

      return {
        success: true,
      };
    } catch (error) {
      console.error(error);
      const t = await getGT();
      return {
        success: false,
        error: t('Failed to delete control'),
      };
    }
  });

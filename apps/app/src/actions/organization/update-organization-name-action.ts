// update-organization-name-action.ts

'use server';

import { db } from '@comp/db';
import { revalidatePath, revalidateTag } from 'next/cache';
import { getGT } from 'gt-next/server';
import { authActionClient } from '../safe-action';
import { organizationNameSchema } from '../schema';

export const updateOrganizationNameAction = authActionClient
  .inputSchema(organizationNameSchema)
  .metadata({
    name: 'update-organization-name',
    track: {
      event: 'update-organization-name',
      channel: 'server',
    },
  })
  .action(async ({ parsedInput, ctx }) => {
    const { name } = parsedInput;
    const { activeOrganizationId } = ctx.session;
    const t = await getGT();

    if (!name) {
      throw new Error(t('Invalid user input'));
    }

    if (!activeOrganizationId) {
      throw new Error(t('No active organization'));
    }

    try {
      await db.$transaction(async () => {
        await db.organization.update({
          where: { id: activeOrganizationId ?? '' },
          data: { name },
        });
      });

      revalidatePath('/settings');
      revalidateTag(`organization_${activeOrganizationId}`);

      return {
        success: true,
      };
    } catch (error) {
      console.error(error);
      throw new Error(t('Failed to update organization name'));
    }
  });

// delete-organization-action.ts

'use server';

import { db } from '@comp/db';
import { getGT } from 'gt-next/server';
import { revalidatePath } from 'next/cache';
import { authActionClient } from '../safe-action';
import { deleteOrganizationSchema } from '../schema';

type DeleteOrganizationResult = {
  success: boolean;
  redirect?: string;
};

export const deleteOrganizationAction = authActionClient
  .inputSchema(deleteOrganizationSchema)
  .metadata({
    name: 'delete-organization',
    track: {
      event: 'delete-organization',
      channel: 'server',
    },
  })
  .action(async ({ parsedInput, ctx }): Promise<DeleteOrganizationResult> => {
    const { id } = parsedInput;
    const { session } = ctx;
    const t = await getGT();

    if (!id) {
      throw new Error(t('Invalid user input'));
    }

    if (!session.activeOrganizationId) {
      throw new Error(t('Invalid organization input'));
    }

    try {
      await db.$transaction(async () => {
        await db.organization.delete({
          where: { id: session.activeOrganizationId ?? '' },
        });
      });

      revalidatePath(`/${session.activeOrganizationId}`);

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
      };
    }
  });

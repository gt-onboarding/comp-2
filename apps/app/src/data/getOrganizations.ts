'use server';

import { auth } from '@/utils/auth';
import { db } from '@comp/db';
import { headers } from 'next/headers';
import { getGT } from 'gt-next/server';

export async function getOrganizations() {
  const t = await getGT();
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

  if (!user) {
    throw new Error(t('Not authenticated'));
  }

  const memberOrganizations = await db.member.findMany({
    where: {
      userId: user.id,
      OR: [
        {
          isActive: true,
        },
      ],
    },
    include: {
      organization: true,
    },
  });

  const organizations = memberOrganizations.map((member) => member.organization);

  return {
    organizations,
  };
}

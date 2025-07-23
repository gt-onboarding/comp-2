'use server';

import type { ActionResponse } from '@/actions/types';
import { auth } from '@/utils/auth';
import { db } from '@comp/db';
import { headers } from 'next/headers';
import { getGT } from 'gt-next/server';

export const getApiKeysAction = async (): Promise<
  ActionResponse<
    {
      id: string;
      name: string;
      createdAt: string;
      expiresAt: string | null;
      lastUsedAt: string | null;
      isActive: boolean;
    }[]
  >
> => {
  try {
    const t = await getGT();
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.session.activeOrganizationId) {
      return {
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: t('You must be logged in to perform this action'),
        },
      };
    }

    const apiKeys = await db.apiKey.findMany({
      where: {
        organizationId: session.session.activeOrganizationId,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        expiresAt: true,
        lastUsedAt: true,
        isActive: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      success: true,
      data: apiKeys.map((key) => ({
        ...key,
        createdAt: key.createdAt.toISOString(),
        expiresAt: key.expiresAt ? key.expiresAt.toISOString() : null,
        lastUsedAt: key.lastUsedAt ? key.lastUsedAt.toISOString() : null,
      })),
    };
  } catch (error) {
    console.error('Error fetching API keys:', error);
    const t = await getGT();
    return {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: t('An error occurred while fetching API keys'),
      },
    };
  }
};

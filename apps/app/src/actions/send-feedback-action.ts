'use server';

import { env } from '@/env.mjs';
import axios from 'axios';
import { getGT } from 'gt-next/server';
import { authActionClient } from './safe-action';
import { sendFeedbackSchema } from './schema';

export const sendFeebackAction = authActionClient
  .inputSchema(sendFeedbackSchema)
  .metadata({
    name: 'send-feedback',
  })
  .action(async ({ parsedInput: { feedback }, ctx: { user } }) => {
    const t = await getGT();
    if (env.DISCORD_WEBHOOK_URL) {
      await axios.post(process.env.DISCORD_WEBHOOK_URL as string, {
        content: t('New feedback from {email}: \n\n {feedback}', { email: user?.email, feedback }),
      });
    }

    return {
      success: true,
    };
  });

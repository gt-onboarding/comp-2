'use client';

import { LogoSpinner } from '@/components/logo-spinner';
import type { Onboarding } from '@comp/db/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@comp/ui/card';
import { useRealtimeRun } from '@trigger.dev/react-hooks';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, Rocket, ShieldAlert, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { T, useGT, Var } from 'gt-next';


const IN_PROGRESS_STATUSES = [
  'QUEUED',
  'EXECUTING',
  'WAITING_FOR_DEPLOY',
  'REATTEMPTING',
  'FROZEN',
  'DELAYED',
];

const getFriendlyStatusName = (status: string): string => {
  if (!status) return 'Unknown';
  return status
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export const OnboardingTracker = ({
  onboarding,
  publicAccessToken,
}: {
  onboarding: Onboarding;
  publicAccessToken: string;
}) => {
  const t = useGT();
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const triggerJobId = onboarding.triggerJobId;
  
  const PROGRESS_MESSAGES = [
    t('Learning about your company...'),
    t('Creating Risks...'),
    t('Creating Vendors...'),
    t('Tailoring Policies...'),
  ];

  if (!triggerJobId || !publicAccessToken) {
    return <T><div className="text-muted-foreground text-sm">Unable to load onboarding tracker.</div></T>;
  }

  const { run, error } = useRealtimeRun(triggerJobId, {
    accessToken: publicAccessToken,
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (run && IN_PROGRESS_STATUSES.includes(run.status)) {
      interval = setInterval(() => {
        setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % PROGRESS_MESSAGES.length);
      }, 4000);
    } else {
      setCurrentMessageIndex(0); // Reset when not in progress
    }
    return () => clearInterval(interval);
  }, [run?.status]);

  if (!triggerJobId) {
    return (
      <T>
        <Card className="bg-card text-card-foreground mx-auto my-2 w-full max-w-2xl shadow-xl">
          <CardHeader className="p-4 text-center">
            <CardTitle className="text-foreground text-xl font-semibold">Onboarding Status</CardTitle>
            <CardDescription className="text-muted-foreground mt-0.5 text-xs">
              Organization setup has not started yet.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex min-h-[80px] items-center justify-center p-4">
            <div className="flex flex-col items-center justify-center gap-2 text-center">
              <AlertTriangle className="text-warning h-6 w-6" /> {/* Use theme warning color */}
              <div>
                <p className="text-warning text-base font-medium">Awaiting Initiation</p>
                <p className="text-muted-foreground mt-0.5 text-xs">
                  No onboarding process has been started.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </T>
    );
  }

  const renderStatusContent = () => {
    if (!run && !error) {
      return (
        <T>
          <div className="flex flex-col items-center justify-center gap-2 text-center">
            <LogoSpinner />
            <div>
              <p className="text-primary text-base font-medium">Initializing Status</p>
              <p className="text-muted-foreground mt-1 text-xs">
                Checking the current onboarding status...
              </p>
            </div>
          </div>
        </T>
      );
    }
    if (!run) {
      return (
        <T>
          <div className="flex flex-col items-center justify-center gap-2 text-center">
            <AlertTriangle className="text-warning h-6 w-6" /> {/* Use theme warning color */}
            <div>
              <p className="text-warning text-base font-medium">Status Unavailable</p>{' '}
              {/* Use theme warning color */}
              <p className="text-muted-foreground mt-1 text-xs">
                Could not retrieve current onboarding status.
              </p>
            </div>
          </div>
        </T>
      );
    }

    const friendlyStatus = getFriendlyStatusName(run.status);

    switch (run.status) {
      case 'WAITING_FOR_DEPLOY':
      case 'QUEUED':
      case 'EXECUTING':
      case 'REATTEMPTING':
      case 'FROZEN':
      case 'DELAYED':
        return (
          <T>
            <div className="flex flex-col items-center justify-center gap-2 text-center">
              <LogoSpinner />
              <div>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={currentMessageIndex} // Important for AnimatePresence to detect changes
                    className="text-primary h-6 text-base font-medium" // Added h-6 for consistent height
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Var>{PROGRESS_MESSAGES[currentMessageIndex]}</Var>
                  </motion.p>
                </AnimatePresence>
                <p className="text-muted-foreground mt-1 text-xs">
                  We are setting up your organization. This may take a few moments.
                </p>
              </div>
            </div>
          </T>
        );
      case 'COMPLETED':
        return (
          <T>
            <div className="flex flex-col items-center justify-center gap-2 text-center">
              <Rocket className="text-chart-positive h-6 w-6" />
              <div>
                <p className="text-chart-positive text-base font-medium">Setup Complete</p>
                <p className="text-muted-foreground mt-1 text-xs">Your organization is ready.</p>
              </div>
            </div>
          </T>
        );
      case 'FAILED':
      case 'CANCELED':
      case 'CRASHED':
      case 'INTERRUPTED':
      case 'SYSTEM_FAILURE':
      case 'EXPIRED':
      case 'TIMED_OUT': {
        const errorMessage = run.error?.message || t('An unexpected issue occurred.');
        const truncatedMessage =
          errorMessage.length > 100 ? `${errorMessage.substring(0, 97)}...` : errorMessage;
        return (
          <T>
            <div className="flex flex-col items-center justify-center gap-2 text-center">
              <ShieldAlert className="text-destructive h-6 w-6" />{' '}
              <div>
                <p className="text-destructive text-base font-medium">
                  Setup <span className="capitalize"><Var>{friendlyStatus}</Var></span>
                </p>
                <p className="text-destructive/80 mt-1 text-xs"><Var>{truncatedMessage}</Var></p>
              </div>
            </div>
          </T>
        );
      }
      default: {
        const exhaustiveCheck: never = run.status as never;

        return (
          <T>
            <div className="flex flex-col items-center justify-center gap-2 text-center">
              <Zap className="text-warning h-6 w-6" />
              <div>
                <p className="text-warning text-base font-medium">Unknown Status</p>
                <p className="text-muted-foreground mt-1 text-xs">
                  Received an unhandled status: <Var>{exhaustiveCheck}</Var>
                </p>
              </div>
            </div>
          </T>
        );
      }
    }
  };

  if (run?.status === 'COMPLETED') {
    return null;
  }

  return (
    <Card className="w-full overflow-hidden rounded-none border-x-0 border-t-0">
      <CardContent className="bg-background flex flex-col items-center justify-center">
        <div className="w-full pt-4">{renderStatusContent()}</div>
      </CardContent>
    </Card>
  );
};

'use client';

import { trackEvent, trackOnboardingEvent } from '@/utils/tracking';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGT } from 'gt-next';
import { sendGTMEvent } from '@next/third-parties/google';
import { useAction } from 'next-safe-action/hooks';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { createOrganizationMinimal } from '../actions/create-organization-minimal';
import type { OnboardingFormFields } from '../components/OnboardingStepInput';
import { createCompanyDetailsSchema, createSteps } from '../lib/constants';
import { updateSetupSession } from '../lib/setup-session';
import type { CompanyDetails } from '../lib/types';

interface UseOnboardingFormProps {
  setupId?: string;
  initialData?: Record<string, any>;
  currentStep?: string;
}

// We'll get steps dynamically within the hook

export function useOnboardingForm({
  setupId,
  initialData,
  currentStep,
}: UseOnboardingFormProps = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useGT();
  const [steps, setSteps] = useState<any[]>([]);
  const [companyDetailsSchema, setCompanyDetailsSchema] = useState<any>(null);

  // Helper to build URL with search params
  const buildUrlWithParams = (path: string, params?: Record<string, string>) => {
    const urlParams = new URLSearchParams();

    // First add the params from the response if any
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        urlParams.append(key, value);
      });
    } else {
      // Otherwise use current search params
      searchParams.forEach((value, key) => {
        urlParams.append(key, value);
      });
    }

    const queryString = urlParams.toString();
    return queryString ? `${path}?${queryString}` : path;
  };

  // Use state instead of localStorage - initialized from KV data if setupId exists
  const [savedAnswers, setSavedAnswers] = useState<Partial<CompanyDetails>>(
    setupId && initialData ? initialData : {},
  );

  // Determine the initial step index based on currentStep (will be calculated after steps load)
  const [stepIndex, setStepIndex] = useState(0);
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Load steps and schema
  useEffect(() => {
    async function loadConstants() {
      try {
        const [stepsData, schemaData] = await Promise.all([
          createSteps(),
          createCompanyDetailsSchema(),
        ]);
        setSteps(stepsData.slice(0, 3)); // Only use the first 3 steps for the minimal flow
        setCompanyDetailsSchema(schemaData);
      } catch (error) {
        console.error('Failed to load constants:', error);
      }
    }
    loadConstants();
    setMounted(true);
  }, []);

  // Track when user starts onboarding
  useEffect(() => {
    if (mounted && stepIndex === 0 && !savedAnswers.frameworkIds) {
      trackEvent('onboarding_started', {
        event_category: 'onboarding',
        setup_id: setupId,
      });
    }
  }, [mounted, stepIndex, savedAnswers.frameworkIds, setupId]);

  // Update step index when steps load and currentStep is provided
  useEffect(() => {
    if (steps.length > 0 && currentStep) {
      const initialStepIndex = steps.findIndex((s) => s.key === currentStep);
      setStepIndex(Math.max(0, initialStepIndex));
    }
  }, [steps, currentStep]);

  // Save progress to KV if we have a setupId
  useEffect(() => {
    if (setupId && mounted && steps.length > 0) {
      const currentStepKey = steps[stepIndex]?.key;
      updateSetupSession(setupId, {
        currentStep: currentStepKey,
        formData: savedAnswers as Record<string, any>,
      });
    }
  }, [setupId, stepIndex, savedAnswers, mounted, steps]);

  const step = steps[stepIndex];
  const stepSchema = step && companyDetailsSchema ? z.object({
    [step.key]: companyDetailsSchema.shape[step.key],
  }) : z.object({});

  const form = useForm<OnboardingFormFields>({
    resolver: zodResolver(stepSchema),
    mode: 'onSubmit',
    defaultValues: step ? { [step.key]: savedAnswers[step.key] || '' } : {},
  });

  // Reset form defaultValues when stepIndex or savedAnswers change for the current step
  useEffect(() => {
    if (step) {
      form.reset({ [step.key]: savedAnswers[step.key] || '' });
    }
  }, [savedAnswers, step, form]);

  const createOrganizationAction = useAction(createOrganizationMinimal, {
    onSuccess: async ({ data }) => {
      if (data?.success && data?.organizationId) {
        setIsFinalizing(true);
        sendGTMEvent({ event: 'conversion' });

        // Track organization created
        trackEvent('organization_created', {
          event_category: 'onboarding',
          organization_id: data.organizationId,
          flow_type: 'pre_payment',
        });

        // Organization created, now redirect to plans page with search params
        router.push(buildUrlWithParams(`/upgrade/${data.organizationId}`));

        // Clear answers after successful creation
        setSavedAnswers({});
      } else {
        toast.error(t('Failed to create organization'));
        setIsFinalizing(false);
        setIsOnboarding(false);
      }
    },
    onError: () => {
      toast.error(t('Failed to create organization'));
      setIsFinalizing(false);
      setIsOnboarding(false);
    },
    onExecute: () => {
      setIsOnboarding(true);
    },
  });

  const handleCreateOrganizationAction = (currentAnswers: Partial<CompanyDetails>) => {
    // Only pass the first 3 fields to the minimal action
    createOrganizationAction.execute({
      frameworkIds: currentAnswers.frameworkIds || [],
      organizationName: currentAnswers.organizationName || '',
      website: currentAnswers.website || '',
    });
  };

  const onSubmit = (data: OnboardingFormFields) => {
    const newAnswers: OnboardingFormFields = { ...savedAnswers, ...data };

    for (const key of Object.keys(newAnswers)) {
      if (step.options && step.key === key && key !== 'frameworkIds') {
        const customValue = newAnswers[`${key}Other`] || '';
        const values = (newAnswers[key] || '').split(',').filter(Boolean);

        if (customValue) {
          values.push(customValue);
        }

        newAnswers[key] = values
          .filter((v: string, i: number, arr: string[]) => arr.indexOf(v) === i && v !== '')
          .join(',');
        delete newAnswers[`${key}Other`];
      }
    }

    setSavedAnswers(newAnswers as Partial<CompanyDetails>);

    // Track step completion
    trackOnboardingEvent(step.key, stepIndex + 1, {
      step_value: data[step.key],
    });

    // Track framework selection specifically
    if (step.key === 'frameworkIds' && data.frameworkIds) {
      trackEvent('framework_selected', {
        event_category: 'onboarding',
        frameworks: data.frameworkIds,
        framework_count: data.frameworkIds.length,
      });
    }

    if (stepIndex < steps.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      handleCreateOrganizationAction(newAnswers);
    }
  };

  const handleBack = () => {
    if (stepIndex > 0) {
      // Save current form values before going back
      const currentValues = form.getValues();
      if (step && currentValues[step.key]) {
        setSavedAnswers({ ...savedAnswers, [step.key]: currentValues[step.key] });
      }

      // Clear form errors
      form.clearErrors();

      // Go to previous step
      setStepIndex(stepIndex - 1);
    }
  };

  const isLastStep = steps.length > 0 && stepIndex === steps.length - 1;

  return {
    stepIndex,
    steps,
    step,
    form,
    savedAnswers,
    isOnboarding,
    isFinalizing,
    mounted,
    onSubmit,
    handleBack,
    isLastStep,
  };
}

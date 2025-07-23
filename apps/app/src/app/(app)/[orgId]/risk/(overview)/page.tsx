import { AppOnboarding } from '@/components/app-onboarding';
import PageWithBreadcrumb from '@/components/pages/PageWithBreadcrumb';
import { CreateRiskSheet } from '@/components/sheets/create-risk-sheet';
import { getValidFilters } from '@/lib/data-table';
import { auth } from '@/utils/auth';
import { db } from '@comp/db';
import { T, getGT } from 'gt-next';
import { getGT as getGTServer } from 'gt-next/server';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { cache } from 'react';
import { RisksTable } from './RisksTable';
import { getRisks } from './data/getRisks';
import { searchParamsCache } from './data/validations';

export default async function RiskRegisterPage(props: {
  params: Promise<{ orgId: string }>;
  searchParams: Promise<{
    search: string;
    page: string;
    perPage: string;
    status: string;
    department: string;
    assigneeId: string;
  }>;
}) {
  const { params } = props;
  const { orgId } = await params;

  const searchParams = await props.searchParams;
  const search = searchParamsCache.parse(searchParams);
  const validFilters = getValidFilters(search.filters);

  const risksResult = await getRisks({
    ...search,
    filters: validFilters,
  });

  const assignees = await getAssignees();

  if (
    risksResult.data?.length === 0 &&
    search.page === 1 &&
    search.title === '' &&
    validFilters.length === 0
  ) {
    return (
      <div className="py-4">
        <AppOnboarding
          title={<T>Risk Management</T>}
          description={
            <T>Identify, assess, and mitigate risks to protect your organization's assets and ensure compliance.</T>
          }
          cta={<T>Create risk</T>}
          imageSrcLight="/onboarding/risk-light.webp"
          imageSrcDark="/onboarding/risk-dark.webp"
          imageAlt={<T>Risk Management</T>}
          sheetName="create-risk-sheet"
          faqs={[
            {
              questionKey: <T>What is risk management?</T>,
              answerKey:
                <T>Risk management is the process of identifying, assessing, and controlling threats to an organization's capital and earnings.</T>,
            },
            {
              questionKey: <T>Why is risk management important?</T>,
              answerKey:
                <T>It helps organizations protect their assets, ensure stability, and achieve their objectives by minimizing potential disruptions.</T>,
            },
            {
              questionKey: <T>What are the key steps in risk management?</T>,
              answerKey:
                <T>The key steps are risk identification, risk analysis, risk evaluation, risk treatment, and risk monitoring and review.</T>,
            },
          ]}
        />
        <CreateRiskSheet assignees={assignees} />
      </div>
    );
  }

  return (
    <PageWithBreadcrumb breadcrumbs={[{ label: <T>Risks</T>, href: `/${orgId}/risk`, current: true }]}>
      <RisksTable
        risks={risksResult?.data || []}
        pageCount={risksResult.pageCount}
        assignees={assignees}
      />
    </PageWithBreadcrumb>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getGTServer();
  return {
    title: t('Risks'),
  };
}

const getAssignees = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.session.activeOrganizationId) {
    return [];
  }

  return await db.member.findMany({
    where: {
      organizationId: session.session.activeOrganizationId,
      isActive: true,
      role: {
        notIn: ['employee'],
      },
    },
    include: {
      user: true,
    },
  });
});

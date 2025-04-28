import { Suspense } from 'react';
import { DashboardUsageCardGroup } from './components/dashboard-usage-card-group';
import { DashboardSubscriptionCardGroup } from './components/dashboard-subscription-card-group';
import { DashboardTutorialCard } from '@/components/dashboard/landing/components/dashboard-tutorial-card';
import { DashboardTeamMembersCard } from '@/components/dashboard/landing/components/dashboard-team-members-card';
import { WorkspaceSection } from './components/workspace-section';

export async function DashboardLandingPage() {
  const subscriptions = await DashboardSubscriptionCardGroup();

  return (
    <div className={'grid flex-1 items-start gap-6 p-0'}>
      <WorkspaceSection />
      <div className={'grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6'}>
        <div className={'grid auto-rows-max items-start gap-6 lg:col-span-2'}>
          <DashboardUsageCardGroup />
          {subscriptions}
        </div>
        <div className={'grid auto-rows-max items-start gap-6'}>
          <DashboardTeamMembersCard />
          <DashboardTutorialCard />
        </div>
      </div>
    </div>
  );
}

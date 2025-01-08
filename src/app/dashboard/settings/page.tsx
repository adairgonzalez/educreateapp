import { DashboardPageHeader } from '@/components/dashboard/layout/dashboard-page-header';
import { AccountSettings } from '@/components/dashboard/settings/account-settings';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Account Settings - Dashboard',
  description: 'Manage your account settings and preferences',
};

export default function SettingsPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-8">
      <DashboardPageHeader pageTitle={'Account Settings'} />
      <AccountSettings />
    </main>
  );
}

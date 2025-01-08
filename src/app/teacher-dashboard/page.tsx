import { DashboardPageHeader } from '@/components/dashboard/layout/dashboard-page-header';
import { TeacherDashboardContent } from '@/components/dashboard/teacher/teacher-dashboard-content';
import { DashboardLayout } from '@/components/dashboard/layout/dashboard-layout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Teacher Dashboard',
  description: 'Manage your classes and student progress',
};

export default function TeacherDashboardPage() {
  return (
    <DashboardLayout>
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-8">
        <DashboardPageHeader pageTitle={'Teacher Dashboard'} />
        <TeacherDashboardContent />
      </main>
    </DashboardLayout>
  );
}

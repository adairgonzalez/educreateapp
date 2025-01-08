'use client';

import { TeacherUsageCardGroup } from './components/teacher-usage-card-group';
import { TeacherStudentList } from './components/teacher-student-list';
import { DashboardTutorialCard } from '../landing/components/dashboard-tutorial-card';

export function TeacherDashboardContent() {
  return (
    <div className={'grid flex-1 items-start gap-6 p-0 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'}>
      <div className={'grid auto-rows-max items-start gap-6 lg:col-span-2'}>
        <TeacherUsageCardGroup />
        <TeacherStudentList />
      </div>
      <div className={'grid auto-rows-max items-start gap-6'}>
        <DashboardTutorialCard />
      </div>
    </div>
  );
}

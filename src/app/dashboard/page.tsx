'use client';

import { WorkspaceSection } from './components/workspace-section';

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex items-center gap-4 border-b px-6 py-4">
        <h1 className="text-xl font-semibold">Educational Dashboard</h1>
      </div>

      {/* Main Content */}
      <div className="px-6 py-4">
        <WorkspaceSection />
      </div>
    </div>
  );
}

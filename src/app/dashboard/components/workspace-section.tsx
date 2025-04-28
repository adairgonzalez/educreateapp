'use client';

import { Card } from '@/components/ui/card';
import { WorkspaceToolsDialog } from './workspace-tools-dialog';

export function WorkspaceSection() {
  return (
    <Card className="col-span-full bg-background/20 backdrop-blur-sm border-0 shadow-none">
      <div className="p-6">
        <div className="flex flex-col gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">My Learning Spaces</h2>
            <p className="text-sm text-muted-foreground">Create and manage your AI-powered learning tools</p>
          </div>
          <div>
            <WorkspaceToolsDialog />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Placeholder for workspace items */}
          <Card className="p-4 flex items-center justify-center min-h-[200px] border-dashed bg-background/10 backdrop-blur-sm hover:bg-background/20 transition-colors">
            <p className="text-muted-foreground text-center">
              Create your first learning space by clicking the &quot;Create New Space&quot; button
            </p>
          </Card>
        </div>
      </div>
    </Card>
  );
}

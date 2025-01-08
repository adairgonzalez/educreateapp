import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus } from 'lucide-react';

const students = [
  {
    name: 'Alice Johnson',
    email: 'alice@school.com',
    initials: 'AJ',
    class: 'Math 101',
  },
  {
    name: 'Bob Smith',
    email: 'bob@school.com',
    initials: 'BS',
    class: 'Math 101',
  },
  {
    name: 'Carol White',
    email: 'carol@school.com',
    initials: 'CW',
    class: 'Physics 101',
  },
  {
    name: 'David Brown',
    email: 'david@school.com',
    initials: 'DB',
    class: 'Chemistry 101',
  },
];

export function TeacherStudentList() {
  return (
    <Card className={'bg-background/50 backdrop-blur-[24px] border-border p-6'}>
      <CardHeader className="p-0 space-y-0">
        <CardTitle className="flex justify-between gap-2 items-center pb-6 border-border border-b">
          <div className={'flex flex-col gap-2'}>
            <span className={'text-xl font-medium'}>Recent Students</span>
            <span className={'text-base leading-4 text-secondary'}>Manage your students and their progress</span>
          </div>
          <Button asChild={true} size={'sm'} variant={'outline'} className={'text-sm rounded-sm border-border'}>
            <Link href={'/teacher-dashboard/students'}>
              <Plus size={16} className={'text-muted-foreground'} />
            </Link>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className={'p-0 pt-6 flex gap-6 flex-col'}>
        {students.map((student) => (
          <div key={student.email} className={'flex justify-between items-center gap-2'}>
            <div className={'flex gap-4'}>
              <div className={'flex items-center justify-center px-3 py-4'}>
                <span className={'text-white text-base w-5'}>{student.initials}</span>
              </div>
              <div className={'flex flex-col gap-2'}>
                <span className={'text-base leading-4 font-medium'}>{student.name}</span>
                <span className={'text-base leading-4 text-secondary'}>{student.class}</span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

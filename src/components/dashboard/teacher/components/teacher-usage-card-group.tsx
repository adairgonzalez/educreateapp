import { Users, BookOpen, Clock, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const cards = [
  {
    title: 'Total Students',
    icon: <Users className={'text-[#4B4F4F]'} size={18} />,
    value: '24',
    change: '+2 this month',
  },
  {
    title: 'Active Classes',
    icon: <BookOpen className={'text-[#4B4F4F]'} size={18} />,
    value: '4',
    change: '2 upcoming classes',
  },
  {
    title: 'Teaching Hours',
    icon: <Clock className={'text-[#4B4F4F]'} size={18} />,
    value: '32h',
    change: '+8h from last month',
  },
  {
    title: 'Next Class',
    icon: <Calendar className={'text-[#4B4F4F]'} size={18} />,
    value: 'Today',
    change: '2:30 PM - Math 101',
  },
];

export function TeacherUsageCardGroup() {
  return (
    <div className={'grid gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2'}>
      {cards.map((card) => (
        <Card key={card.title} className={'bg-background/50 backdrop-blur-[24px] border-border p-6'}>
          <CardHeader className="p-0 space-y-0">
            <CardTitle className="flex justify-between items-center mb-6">
              <span className={'text-base leading-4'}>{card.title}</span> {card.icon}
            </CardTitle>
            <CardDescription className={'text-[32px] leading-[32px] text-primary'}>{card.value}</CardDescription>
          </CardHeader>
          <CardContent className={'p-0'}>
            <div className="text-sm leading-[14px] pt-2 text-secondary">{card.change}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

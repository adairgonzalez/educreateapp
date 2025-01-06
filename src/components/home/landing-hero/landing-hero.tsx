import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

export function LandingHero() {
  return (
    <>
      <section
        className={'mx-auto max-w-7xl px-[32px] relative flex flex-col items-center justify-between mt-16 mb-12'}
      >
        <div className={'text-center w-full'}>
          <h1 className={'text-[48px] leading-[48px] md:text-[80px] md:leading-[80px] tracking-[-1.6px] font-medium'}>
            Create Interactive
            <br />
            Learning Experiences
          </h1>
          <p
            className={
              'mt-6 text-[18px] leading-[27px] md:text-[20px] md:leading-[30px] max-w-[600px] mx-auto text-muted-foreground py-6'
            }
          >
            Transform your teaching with our powerful education platform. Create engaging content, track student
            progress, and foster collaborative learning environments.
          </p>
          <div className="flex items-center justify-center gap-4 mt-8">
            <Button size="lg" variant={'secondary'} asChild>
              <Link href="/signup">Start Free Trial</Link>
            </Button>
            <Button size="lg" variant={'outline'} asChild>
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* For Teachers Section */}
      <section className="mx-auto max-w-7xl px-[32px] py-6">
        <div className="text-center mb-12">
          <span className="text-[#00adb5] font-semibold text-lg">FOR TEACHERS</span>
          <h2 className="text-3xl font-bold mb-4 mt-2">Empower Your Teaching</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Are you a teacher looking to revolutionize your classroom? Our AI-powered tools help you create engaging
            lessons in minutes, not hours.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 rounded-lg bg-background/70 backdrop-blur-[6px] border border-[#00adb5]/20">
            <h3 className="text-xl font-semibold mb-3">AI-Powered Lesson Planning</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li>• Generate creative lesson plans based on your curriculum</li>
              <li>• Create interactive presentations in minutes</li>
              <li>• Access a library of educational resources</li>
              <li>• Customize content for different learning levels</li>
            </ul>
          </div>
          <div className="p-6 rounded-lg bg-background/70 backdrop-blur-[6px] border border-[#00adb5]/20">
            <h3 className="text-xl font-semibold mb-3">Progress Monitoring</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li>• Track individual student performance</li>
              <li>• Generate detailed progress reports</li>
              <li>• Identify areas needing additional support</li>
              <li>• Share insights with parents and administrators</li>
            </ul>
          </div>
        </div>
      </section>

      {/* For Students Section */}
      <section className="mx-auto max-w-7xl px-[32px] py-16">
        <div className="text-center mb-12">
          <span className="text-[#00adb5] font-semibold text-lg">FOR STUDENTS</span>
          <h2 className="text-3xl font-bold mb-4 mt-2">Your Personal Learning Assistant</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Struggling with your studies? Let our AI adapt to your learning style and help you master any subject at
            your own pace.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 rounded-lg bg-background/70 backdrop-blur-[6px] border border-[#00adb5]/20">
            <h3 className="text-xl font-semibold mb-3">Adaptive Learning</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li>• Content tailored to your learning style</li>
              <li>• Practice exercises that adjust to your level</li>
              <li>• Instant feedback and explanations</li>
              <li>• Track your progress and achievements</li>
            </ul>
          </div>
          <div className="p-6 rounded-lg bg-background/70 backdrop-blur-[6px] border border-[#00adb5]/20">
            <h3 className="text-xl font-semibold mb-3">Interactive Study Tools</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li>• AI-powered study guides and summaries</li>
              <li>• Practice quizzes and assessments</li>
              <li>• Collaborative study groups</li>
              <li>• Visual learning aids and multimedia content</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="mx-auto max-w-7xl px-[32px] py-16 text-center">
        <div className="p-8 rounded-lg bg-background/70 backdrop-blur-[6px] border border-[#00adb5]/20">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Learning?</h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of teachers and students already using eduCreate to enhance their educational experience.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button size="lg" variant={'secondary'} asChild>
              <Link href="/pricing">Start Free Trial</Link>
            </Button>
            <Button size="lg" variant={'outline'} asChild>
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

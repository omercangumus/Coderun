import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { BottomNav } from '@/components/layout/bottom-nav';
import { GlobalMentor } from '@/components/layout/global-mentor';
import { DailyStreakToast } from '@/components/common/DailyStreakToast';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
        <Topbar />
        <main className="flex-1 p-4 lg:p-6 pb-24 lg:pb-8">
          {children}
        </main>
        <BottomNav />
      </div>
      <GlobalMentor />
      <DailyStreakToast />
    </div>
  );
}

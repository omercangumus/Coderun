'use client';

import Link from 'next/link';
import { Route, BookOpen, HelpCircle, Users, AlertTriangle, Clock } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// Mock data — will be replaced with API calls
const MOCK_STATS = {
  totalUsers: 12450,
  activeToday: 1204,
  lessonsCompletedToday: 3892,
};

const MOCK_PROBLEM_AREAS = {
  mostFailedQuestion: {
    title: 'Most Failed Question',
    subtitle: 'Unit 2, Question 4',
    rate: 42,
  },
  mostSkippedLesson: {
    title: 'Most Skipped Lesson',
    subtitle: 'Docker Networking',
    rate: 28,
  },
};

const MOCK_GROWTH = [
  { day: 'Mon', count: 42 },
  { day: 'Tue', count: 38 },
  { day: 'Wed', count: 55 },
  { day: 'Thu', count: 48 },
  { day: 'Fri', count: 65 },
  { day: 'Sat', count: 72 },
  { day: 'Sun', count: 90 },
];

const QUICK_ACTIONS = [
  { href: '/admin/paths', label: 'Manage Paths', icon: Route, primary: true },
  { href: '/admin/lessons', label: 'Edit Lessons', icon: BookOpen },
  { href: '/admin/questions', label: 'Questions', icon: HelpCircle },
  { href: '/admin/users', label: 'Users', icon: Users },
];

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 hover:shadow-card transition-shadow">
      <p className="text-body-sm text-on-surface-variant mb-1">{label}</p>
      <p className="text-h2 font-heading text-on-surface">{value.toLocaleString()}</p>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-body-sm">
        <Link href="/admin" className="text-primary hover:underline">
          Admin
        </Link>
        <span className="text-on-surface-variant">/</span>
        <span className="text-on-surface">Dashboard</span>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-h1 font-heading text-on-surface">Overview</h1>
        <p className="text-body-md text-primary mt-1">
          High-level statistics and quick insights
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Total Users" value={MOCK_STATS.totalUsers} />
        <StatCard label="Active Users Today" value={MOCK_STATS.activeToday} />
        <StatCard label="Lessons Completed Today" value={MOCK_STATS.lessonsCompletedToday} />
      </div>

      {/* Problem Areas */}
      <div>
        <h2 className="text-h3 font-heading text-on-surface mb-4">Problem Areas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Most Failed Question */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 border-b-4 border-b-error hover:shadow-card transition-shadow">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-error-container flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={24} className="text-error" />
              </div>
              <div>
                <p className="text-body-lg font-semibold text-on-surface">
                  {MOCK_PROBLEM_AREAS.mostFailedQuestion.title}
                </p>
                <p className="text-body-sm text-on-surface-variant mt-0.5">
                  {MOCK_PROBLEM_AREAS.mostFailedQuestion.subtitle}
                </p>
                <span className="inline-block mt-2 px-3 py-1 rounded-full bg-error-container text-error text-label-sm font-semibold">
                  {MOCK_PROBLEM_AREAS.mostFailedQuestion.rate}% Wrong Rate
                </span>
              </div>
            </div>
          </div>

          {/* Most Skipped Lesson */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 border-b-4 border-b-tertiary hover:shadow-card transition-shadow">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-tertiary-fixed flex items-center justify-center flex-shrink-0">
                <Clock size={24} className="text-tertiary" />
              </div>
              <div>
                <p className="text-body-lg font-semibold text-on-surface">
                  {MOCK_PROBLEM_AREAS.mostSkippedLesson.title}
                </p>
                <p className="text-body-sm text-on-surface-variant mt-0.5">
                  {MOCK_PROBLEM_AREAS.mostSkippedLesson.subtitle}
                </p>
                <span className="inline-block mt-2 px-3 py-1 rounded-full bg-tertiary-fixed text-tertiary text-label-sm font-semibold">
                  {MOCK_PROBLEM_AREAS.mostSkippedLesson.rate}% Skip Rate
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Growth Chart */}
      <div>
        <h2 className="text-h3 font-heading text-on-surface mb-4">Growth</h2>
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-body-md text-on-surface font-medium">New Users This Week</p>
            <span className="px-3 py-1 rounded-full bg-secondary-container text-secondary text-label-sm font-semibold">
              +12% vs last week
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_GROWTH}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3D4AD8" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3D4AD8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#767686' }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#767686' }}
                />
                <Tooltip
                  contentStyle={{
                    background: '#2D3134',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#EEF1F5',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#3D4AD8"
                  strokeWidth={3}
                  fill="url(#colorCount)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-h3 font-heading text-on-surface mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className={`flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 transition-all hover:shadow-card ${
                  action.primary
                    ? 'bg-primary text-primary-on border-primary hover:shadow-primary'
                    : 'bg-surface-container-lowest text-on-surface border-outline-variant hover:border-primary'
                }`}
              >
                <Icon size={28} />
                <span className="text-button-sm font-semibold">{action.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

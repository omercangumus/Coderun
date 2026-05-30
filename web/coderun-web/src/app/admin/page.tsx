'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Route, BookOpen, HelpCircle, Users, AlertTriangle, Clock, Loader2 } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { getAdminStats } from '@/lib/api/admin-api';
import type { AdminStats } from '@/lib/types/admin.types';

// Growth chart uses static demo data (no backend endpoint for daily growth yet)
const DEMO_GROWTH = [
  { day: 'Pzt', count: 42 },
  { day: 'Sal', count: 38 },
  { day: 'Çar', count: 55 },
  { day: 'Per', count: 48 },
  { day: 'Cum', count: 65 },
  { day: 'Cmt', count: 72 },
  { day: 'Paz', count: 90 },
];

const QUICK_ACTIONS = [
  { href: '/admin/paths', label: 'Yolları Yönet', icon: Route, primary: true },
  { href: '/admin/lessons', label: 'Dersleri Düzenle', icon: BookOpen },
  { href: '/admin/questions', label: 'Sorular', icon: HelpCircle },
  { href: '/admin/users', label: 'Kullanıcılar', icon: Users },
];

function StatCard({ label, value, loading }: { label: string; value: string | number; loading?: boolean }) {
  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 hover:shadow-card transition-shadow">
      <p className="text-body-sm text-on-surface-variant mb-1">{label}</p>
      {loading ? (
        <div className="flex items-center gap-2 mt-2">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <span className="text-body-sm text-on-surface-variant">Yükleniyor...</span>
        </div>
      ) : (
        <p className="text-h2 font-heading text-on-surface">{value.toLocaleString()}</p>
      )}
    </div>
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  useEffect(() => {
    getAdminStats()
      .then((data) => {
        setStats(data);
        setStatsError(null);
      })
      .catch((err) => {
        console.error('Admin stats fetch failed:', err);
        setStatsError('İstatistikler yüklenemedi. Backend bağlantısını kontrol edin.');
      })
      .finally(() => setStatsLoading(false));
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-body-sm">
        <Link href="/admin" className="text-primary hover:underline">
          Admin
        </Link>
        <span className="text-on-surface-variant">/</span>
        <span className="text-on-surface">Genel Bakış</span>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-h1 font-heading text-on-surface">Genel Bakış</h1>
        <p className="text-body-md text-primary mt-1">
          Özet istatistikler ve hızlı erişim
        </p>
      </div>

      {/* Stats error */}
      {statsError && (
        <div className="p-4 rounded-xl border border-error/30 bg-error-container/10">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-error" />
            <p className="text-body-sm text-error">{statsError}</p>
          </div>
        </div>
      )}

      {/* Stat Cards — real data from /admin/stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="Toplam Kullanıcı"
          value={stats?.totalUsers ?? 0}
          loading={statsLoading}
        />
        <StatCard
          label="Bugün Aktif Kullanıcı"
          value={stats?.activeToday ?? 0}
          loading={statsLoading}
        />
        <StatCard
          label="Bugün Tamamlanan Ders"
          value={stats?.lessonsCompletedToday ?? 0}
          loading={statsLoading}
        />
      </div>

      {/* Problem Areas — static demo until backend provides this data */}
      <div>
        <h2 className="text-h3 font-heading text-on-surface mb-4">Sorunlu Alanlar</h2>
        <p className="text-body-sm text-on-surface-variant mb-4 italic">
          Demo veri — ayrıntılı analitik yakında
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 border-b-4 border-b-error hover:shadow-card transition-shadow">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-error-container flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={24} className="text-error" />
              </div>
              <div>
                <p className="text-body-lg font-semibold text-on-surface">En Çok Yanlış Soru</p>
                <p className="text-body-sm text-on-surface-variant mt-0.5">Ünite 2, Soru 4</p>
                <span className="inline-block mt-2 px-3 py-1 rounded-full bg-error-container text-error text-label-sm font-semibold">
                  %42 yanlış (demo)
                </span>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 border-b-4 border-b-tertiary hover:shadow-card transition-shadow">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-tertiary-fixed flex items-center justify-center flex-shrink-0">
                <Clock size={24} className="text-tertiary" />
              </div>
              <div>
                <p className="text-body-lg font-semibold text-on-surface">En Çok Atlanan Ders</p>
                <p className="text-body-sm text-on-surface-variant mt-0.5">Docker Ağları</p>
                <span className="inline-block mt-2 px-3 py-1 rounded-full bg-tertiary-fixed text-tertiary text-label-sm font-semibold">
                  %28 atlama (demo)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Growth Chart — demo data */}
      <div>
        <h2 className="text-h3 font-heading text-on-surface mb-4">Büyüme</h2>
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-body-md text-on-surface font-medium">Bu Hafta Yeni Kullanıcılar</p>
            <span className="px-3 py-1 rounded-full bg-secondary-container text-secondary text-label-sm font-semibold">
              Demo veri
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DEMO_GROWTH}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3D4AD8" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3D4AD8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#767686' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#767686' }} />
                <Tooltip contentStyle={{ background: '#2D3134', border: 'none', borderRadius: '8px', color: '#EEF1F5' }} />
                <Area type="monotone" dataKey="count" stroke="#3D4AD8" strokeWidth={3} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-h3 font-heading text-on-surface mb-4">Hızlı İşlemler</h2>
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

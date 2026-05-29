import Link from 'next/link';
import { GhostieReaction } from '@/components/ghostie/GhostieReaction';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-primary text-center px-4">
      <GhostieReaction state="wrong" size={120} />
      <div>
        <h1 className="text-3xl font-bold text-white">Sayfa Bulunamadı</h1>
        <p className="text-white/80 mt-2">Aradığın sayfa kaybolmuş gibi görünüyor.</p>
      </div>
      <Link
        href="/"
        className="px-6 py-3 bg-surface-container-lowest text-primary rounded-xl font-semibold hover:bg-surface-container transition-colors shadow-card"
      >
        Ana Sayfaya Dön
      </Link>
    </div>
  );
}

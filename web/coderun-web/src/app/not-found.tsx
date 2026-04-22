import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-primary text-white">
      <h1 className="text-6xl font-bold text-accent mb-4">404</h1>
      <p className="text-xl text-slate-400 mb-8">Sayfa bulunamadı</p>
      <Link
        href="/"
        className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
      >
        Ana Sayfaya Dön
      </Link>
    </div>
  );
}

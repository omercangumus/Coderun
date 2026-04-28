import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-primary text-center px-4">
      <div className="text-8xl">👻</div>
      <div>
        <h1 className="text-3xl font-bold text-white">Sayfa Bulunamadı</h1>
        <p className="text-slate-400 mt-2">Aradığın sayfa kaybolmuş gibi görünüyor.</p>
      </div>
      <Link
        href="/"
        className="px-6 py-3 bg-accent text-white rounded-xl font-medium hover:bg-accent/90 transition-colors"
      >
        Ana Sayfaya Dön
      </Link>
    </div>
  );
}

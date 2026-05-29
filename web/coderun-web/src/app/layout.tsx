import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers/providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Coderun — Kod Öğren, Kariyer Kur',
  description:
    'DevOps, Cloud ve Python öğrenmek için gamification destekli platform',
};

const themeInitScript = `
(function() {
  try {
    var stored = localStorage.getItem('coderun-settings');
    if (!stored) return;
    var parsed = JSON.parse(stored);
    var theme = parsed && parsed.state && parsed.state.theme;
    if (theme) document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

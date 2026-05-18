import Image from 'next/image';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Sol panel — sadece masaüstünde */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[520px] flex-shrink-0 flex-col items-center justify-center p-12 bg-primary relative overflow-hidden">
        {/* Arka plan dekorasyon */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/5" />
          <div className="absolute -bottom-32 -right-16 w-80 h-80 rounded-full bg-white/5" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/[0.03]" />
        </div>

        <div className="relative z-10 max-w-sm text-center">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">
              🚀
            </div>
            <span className="text-3xl font-heading font-bold text-white">Coderun</span>
          </div>

          {/* Ghostie */}
          <div className="mb-8 flex justify-center">
            <div className="w-40 h-40 relative">
              <Image
                src="/images/ghostie/ghostie_idle.png"
                alt="Ghostie"
                fill
                className="object-contain drop-shadow-2xl"
              />
            </div>
          </div>

          <h2 className="text-2xl font-heading font-bold text-white mb-3">
            Kodla, öğren, yüksel
          </h2>
          <p className="text-white/70 text-body-sm mb-10">
            Python, DevOps ve Cloud teknolojilerini interaktif derslerle öğren.
          </p>

          {/* Feature list */}
          <div className="flex flex-col gap-4 text-left">
            {[
              { icon: '🐍', title: 'Python Programlama', desc: 'Sıfırdan ileri seviyeye' },
              { icon: '⚙️', title: 'DevOps & Linux', desc: 'Gerçek dünya senaryoları' },
              { icon: '☁️', title: 'AWS Cloud', desc: 'Sertifika hazırlığı' },
            ].map((item) => (
              <div key={item.title} className="flex items-center gap-4 bg-white/10 rounded-xl px-4 py-3">
                <span className="text-2xl flex-shrink-0">{item.icon}</span>
                <div>
                  <div className="text-white font-semibold text-body-sm">{item.title}</div>
                  <div className="text-white/60 text-label-sm">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sağ panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md">
          {/* Mobil logo */}
          <div className="flex items-center justify-center gap-2 mb-8 lg:hidden">
            <span className="text-2xl">🚀</span>
            <span className="text-2xl font-heading font-bold text-on-surface">Coderun</span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

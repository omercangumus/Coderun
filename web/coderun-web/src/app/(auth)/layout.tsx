export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-primary flex">
      {/* Sol panel - sadece masaüstünde */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12 bg-secondary">
        <div className="max-w-md text-center">
          <div className="text-6xl mb-6">🚀</div>
          <h1 className="text-4xl font-bold text-white mb-4">Coderun</h1>
          <p className="text-xl text-slate-400 mb-8">Kodla, öğren, yüksel</p>
          <div className="flex flex-col gap-3 text-left">
            {[
              { icon: '🐍', text: 'Python programlama' },
              { icon: '⚙️', text: 'DevOps & Linux' },
              { icon: '☁️', text: 'AWS Cloud' },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3 text-slate-300">
                <span className="text-2xl">{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sağ panel - form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}

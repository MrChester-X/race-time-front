import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen relative flex flex-col">
      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo/Brand */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-3 bg-black/30 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/10">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                🏁
              </div>
              <div className="text-left">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Ace of Pace</h1>
                <p className="text-orange-300 text-sm">Racing Control System</p>
              </div>
            </div>
          </div>

          {/* Main Heading */}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Система управления <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">гонками</span>
          </h2>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Обогнать грипов сквозь дождь и кучу дров. Контролируйте питстопы, отслеживайте команды и управляйте событиями гонки.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
            <Link
              href="/pits"
              className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all duration-300 shadow-2xl hover:shadow-orange-500/25 hover:scale-105"
            >
              <span className="text-2xl">🏎️</span>
              <span>Панель управления</span>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-400 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </Link>

            <Link
              href="/pits/focus"
              className="group inline-flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all duration-300 border border-white/20 hover:border-white/40"
            >
              <span className="text-2xl">⚡</span>
              <span>Режим волны</span>
            </Link>
          </div>

          {/* Features */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: "🏁",
                title: "Управление событиями",
                description: "Отслеживайте все события гонки в реальном времени",
              },
              {
                icon: "🏎️",
                title: "Контроль питстопов",
                description: "Визуализация смены карта и управление питлейном",
              },
              {
                icon: "👥",
                title: "Команды и статистика",
                description: "Полная информация о командах и их результатах",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black/20 backdrop-blur-sm border-t border-white/10 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
            <span>Ace of Pace</span>
            <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
            <span>Racing Control System</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

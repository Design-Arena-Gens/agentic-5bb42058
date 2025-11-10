import ReelPlayer from '@/components/ReelPlayer';

export default function Page() {
  return (
    <main className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 bg-black/40" />
      <div className="relative z-10">
        <header className="absolute left-0 right-0 top-0 flex items-center justify-between p-4 sm:p-6 text-white/80">
          <h1 className="text-sm sm:text-base font-semibold tracking-wide">
            Gunahon Ka Devta ? The God of Sins
          </h1>
          <span className="text-[11px] sm:text-xs">Cinematic ? Emotional ? Slow-paced</span>
        </header>
        <ReelPlayer />
      </div>
    </main>
  );
}

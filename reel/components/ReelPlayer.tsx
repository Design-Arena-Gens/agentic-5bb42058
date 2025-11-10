"use client";

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type Scene = {
  id: string;
  start: number; // seconds
  end: number;   // seconds
  title?: string;
  narration?: string;
  dialogue?: string;
  mood: 'nostalgic' | 'tender' | 'conflict' | 'ache' | 'resolve';
  image: {
    src: string;
    alt: string;
  };
  sfx?: 'rain' | 'silence';
};

const totalDuration = 60; // seconds

export default function ReelPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startMsRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const scenes: Scene[] = useMemo(() => [
    {
      id: 'intro',
      start: 0,
      end: 8,
      title: 'Allahabad ? Sunrise',
      narration: 'In the lanes of Allahabad, where love met sacrifice, lived a man ? Chander.',
      mood: 'nostalgic',
      image: {
        src: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?q=80&w=1974&auto=format&fit=crop',
        alt: 'Sunrise over a historic campus with warm tones',
      },
    },
    {
      id: 'love-blooms',
      start: 9,
      end: 18,
      narration: 'He loved her ? deeply, silently, purely?',
      dialogue: 'Sudha: ?Chander? tum itne chup kyu rehte ho??',
      mood: 'tender',
      image: {
        src: 'https://images.unsplash.com/photo-1529336953121-4cf6282d29c5?q=80&w=1974&auto=format&fit=crop',
        alt: 'College corridor with books and soft light',
      },
    },
    {
      id: 'conflict',
      start: 19,
      end: 32,
      narration: 'Letters written, never sent. Words swallowed by the rain.',
      mood: 'conflict',
      image: {
        src: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?q=80&w=1974&auto=format&fit=crop',
        alt: 'Desk with a letter, pen, and rain on window',
      },
      sfx: 'rain',
    },
    {
      id: 'ache',
      start: 33,
      end: 48,
      narration: 'Fate turned pages faster than their hearts could follow. Promises met propriety. Distance grew, quietly.',
      mood: 'ache',
      image: {
        src: 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?q=80&w=1974&auto=format&fit=crop',
        alt: 'Empty courtyard with monsoon puddles and reflections',
      },
    },
    {
      id: 'resolve',
      start: 49,
      end: 60,
      narration: 'Love is not possession ? it is prayer. In losing, Chander found a way to keep loving.',
      mood: 'resolve',
      image: {
        src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1974&auto=format&fit=crop',
        alt: 'Sunset over river with warm glow and calm water',
      },
    },
  ], []);

  const currentScene = useMemo(() => {
    return scenes.find((s) => currentTime >= s.start && currentTime <= s.end) ?? scenes[0];
  }, [currentTime, scenes]);

  const tick = useCallback((nowMs: number) => {
    if (startMsRef.current == null) startMsRef.current = nowMs;
    const elapsed = (nowMs - startMsRef.current) / 1000;
    const clamped = Math.min(elapsed, totalDuration);
    setCurrentTime(clamped);
    setProgress((clamped / totalDuration) * 100);
    if (clamped >= totalDuration) {
      cancel();
      return;
    }
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const start = useCallback(() => {
    if (rafRef.current != null) return;
    startMsRef.current = null;
    rafRef.current = requestAnimationFrame(tick);
    setIsPlaying(true);
    audioRef.current?.play().catch(() => {});
  }, [tick]);

  const cancel = useCallback(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  const restart = useCallback(() => {
    cancel();
    setCurrentTime(0);
    setProgress(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
    setTimeout(() => start(), 0);
  }, [cancel, start]);

  useEffect(() => {
    return () => cancel();
  }, [cancel]);

  const bgOverlay = (
    <div className="pointer-events-none absolute inset-0 reel-gradient" />
  );

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={currentScene.image.src}
          alt={currentScene.image.alt}
          fill
          priority
          className="object-cover"
        />
        {bgOverlay}
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-end p-6 sm:p-10">
        <div className="w-full max-w-screen-sm">
          <div className="mb-3 h-1 w-full overflow-hidden rounded bg-white/20">
            <div
              className="h-full bg-gold transition-[width] duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mb-4 text-xs tracking-wide text-white/70">
            {formatTime(currentTime)} / 1:00
          </div>

          <div className="mb-6 space-y-2">
            {currentScene.title && (
              <div className="text-sm uppercase tracking-[0.3em] text-gold animate-fade-in">
                {currentScene.title}
              </div>
            )}
            {currentScene.narration && (
              <p className="text-balance text-xl sm:text-2xl font-light leading-relaxed animate-fade-in">
                {currentScene.narration}
              </p>
            )}
            {currentScene.dialogue && (
              <p className="text-balance text-lg sm:text-xl font-medium text-white/90 italic animate-fade-in">
                {currentScene.dialogue}
              </p>
            )}
          </div>

          <div className="mb-10 flex items-center gap-3">
            {!isPlaying ? (
              <button
                onClick={start}
                className="rounded-full bg-white/10 px-6 py-3 text-sm font-semibold backdrop-blur hover:bg-white/20 transition"
              >
                Play Reel
              </button>
            ) : (
              <>
                <button
                  onClick={cancel}
                  className="rounded-full bg-white/10 px-5 py-3 text-sm font-semibold backdrop-blur hover:bg-white/20 transition"
                >
                  Pause
                </button>
                <button
                  onClick={restart}
                  className="rounded-full bg-white/10 px-5 py-3 text-sm font-semibold backdrop-blur hover:bg-white/20 transition"
                >
                  Restart
                </button>
              </>
            )}
          </div>

          <div className="mb-2 text-[11px] text-white/50">
            Music: Soft Indian instrumental (royalty-free) ? SFX: Rain ambience
          </div>
        </div>
      </div>

      <audio
        ref={audioRef}
        src="https://cdn.pixabay.com/audio/2023/05/15/audio_6b1ed84c35.mp3"
        preload="auto"
      />
    </div>
  );
}

function formatTime(seconds: number): string {
  const s = Math.floor(seconds % 60);
  const m = Math.floor(seconds / 60);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${m}:${pad(s)}`;
}

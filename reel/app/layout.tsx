import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Gunahon Ka Devta ? Cinematic Reel',
  description: 'A cinematic, emotional, slow-paced storytelling reel',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

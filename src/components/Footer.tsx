import React from 'react';
import { Twitter } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-black/40 border-t border-[#14F195]/20 backdrop-blur-sm mt-8">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[#14F195]/80">
          <div className="flex items-center gap-4">
            <span>© {new Date().getFullYear()} Solana Chess AI</span>
            <span>•</span>
            <span>g
              Made by{' '}
              <a
                href="https://x.com/YonatanBadash1"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#14F195] hover:text-[#9945FF] transition-colors"
              >
                @YonatanBadash1
              </a>
            </span>
            <span>•</span>
            <span>
              With <span className="text-[#FF4ECD] font-bold">❤️</span> by{' '}
              <a
                href="https://x.com/millw11488"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#14F195] font-bold glow-effect hover:text-[#FFD700] transition-colors"
              >
                <span className="animate-pulse">✨ @millw11488 ✨</span>
              </a>
            </span>
          </div>
          <a
            href="https://x.com/travisbickle0x/status/1875695776288174542"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[#14F195] hover:text-[#9945FF] transition-colors"
          >
            <Twitter className="w-4 h-4" />
            <span>Inspired by @travisbickle0x</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

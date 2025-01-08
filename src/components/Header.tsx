import React from 'react';
import { Binary, Cpu } from 'lucide-react';
import { WalletConnect } from './WalletConnect';

export const Header: React.FC = () => {
  return (
    <header className="glass-card border-b border-[#14F195]/20">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative float-effect">
              <Binary className="w-8 h-8 text-[#14F195] animate-pulse" />
              <Cpu className="w-4 h-4 text-[#14F195] absolute -top-1 -right-1 animate-spin" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#14F195]">
              Chess by Milla
            </h1>
          </div>
          <WalletConnect />
        </div>
      </div>
    </header>
  );
};
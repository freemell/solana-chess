import React from 'react';
import { ChessGame } from './components/ChessGame';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { WalletConnect } from './components/WalletConnect';

export function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0f0d] to-[#1a2b22] flex flex-col">
      <div className="matrix-grid fixed inset-0 opacity-5"></div>
      <div className="relative flex-1">
        <Header />
        <main className="max-w-7xl mx-auto py-8 px-4">
          {/* Wallet Connection Component */}
          <div className="mb-8">
            <WalletConnect />
          </div>
          {/* Chess Game Component */}
          <ChessGame />
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default App;

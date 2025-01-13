import React from 'react';
import { ChessGame } from './components/ChessGame';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import '@solana/wallet-adapter-react-ui/styles.css';
import { WalletConnect } from './components/WalletConnect'; // Import WalletConnect

export function App() {
  const wallets = [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
    new TorusWalletAdapter(),
  ];

  return (
    <ConnectionProvider endpoint={clusterApiUrl('mainnet-beta')}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="min-h-screen bg-gradient-to-b from-[#0a0f0d] to-[#1a2b22] flex flex-col">
            <div className="matrix-grid fixed inset-0 opacity-5"></div>
            <div className="relative flex-1">
              <Header />
              <main className="max-w-7xl mx-auto py-8 px-4">
                {/* WalletConnect Component */}
                <div className="flex justify-end mb-4">
                  <WalletConnect />
                </div>
                <ChessGame />
              </main>
            </div>
            <Footer />
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;

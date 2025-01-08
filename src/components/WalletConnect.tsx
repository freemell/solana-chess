import React, { useEffect, useState } from 'react';
import { Wallet } from 'lucide-react';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { Connection } from '@solana/web3.js';
import axios from 'axios';

export const WalletConnect: React.FC = () => {
  const [wallet] = useState(() => new PhantomWalletAdapter());
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    wallet.on('connect', () => {
      setConnected(true);
      setAddress(wallet.publicKey?.toBase58() || null);
    });

    wallet.on('disconnect', () => {
      setConnected(false);
      setAddress(null);
      setBalance(null);
      localStorage.removeItem('authToken');
    });

    return () => {
      wallet.disconnect();
    };
  }, [wallet]);

  useEffect(() => {
    if (connected && wallet.publicKey) {
      const connection = new Connection('https://api.mainnet-beta.solana.com');
      connection.getBalance(wallet.publicKey).then((bal) => {
        setBalance(bal / 1e9); // Convert lamports to SOL
      });
    }
  }, [connected, wallet.publicKey]);

  const checkTokenExpiration = () => {
    const token = localStorage.getItem('authToken');
    if (!token) return false;

    const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
    const isExpired = payload.exp * 1000 < Date.now();

    if (isExpired) {
      localStorage.removeItem('authToken');
      setConnected(false);
      setMessage('Session expired. Please log in again.');
    }

    return !isExpired;
  };

  useEffect(() => {
    const isAuthenticated = checkTokenExpiration();
    if (isAuthenticated) {
      setConnected(true);
      setAddress(localStorage.getItem('address'));
    }
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    try {
      if (!wallet.connected || !wallet.publicKey) {
        await wallet.connect();
      }

      const publicKey = wallet.publicKey?.toBase58();
      if (!publicKey) throw new Error('Failed to retrieve public key.');

      // Fetch nonce from the backend
      const { data } = await axios.post('http://localhost:5000/auth/nonce', { publicKey });
      const nonce = data.nonce;

      // Sign the nonce
      const encodedMessage = new TextEncoder().encode(nonce);
      const signedMessage = await wallet.signMessage(encodedMessage);
      const signature = Buffer.from(signedMessage).toString('base64');

      // Send signed message to the backend for verification
      const response = await axios.post('http://localhost:5000/auth/verify', {
        publicKey,
        signature,
      });

      const { token } = response.data;
      localStorage.setItem('authToken', token);

      setMessage('Login successful!');
    } catch (error: any) {
      console.error('Login failed:', error);

      if (error.message.includes('wallet')) {
        setMessage('Wallet connection failed. Please try again.');
      } else if (error.response?.status === 401) {
        setMessage('Authentication failed. Please reconnect your wallet.');
      } else {
        setMessage('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {!connected ? (
        <button
          onClick={handleLogin}
          className="flex items-center gap-2 glass-card px-4 py-2 rounded-lg hover:border-[#14F195]/40 transition-colors"
        >
          {loading ? <span>Loading...</span> : <Wallet className="w-5 h-5 text-[#14F195]" />}
          <span>{loading ? 'Connecting...' : 'Connect Wallet'}</span>
        </button>
      ) : (
        <div className="flex items-center gap-4">
          <div className="glass-card px-4 py-2 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#14F195]/80">Balance:</span>
              <span className="font-medium">{balance?.toFixed(2)} SOL</span>
            </div>
            <div className="text-xs text-[#14F195]/60 truncate w-32">
              {address}
            </div>
          </div>
          <button
            onClick={() => wallet.disconnect()}
            className="glass-card px-3 py-1.5 rounded-lg hover:border-[#14F195]/40 transition-colors"
          >
            Disconnect
          </button>
        </div>
      )}
      {message && <p className="text-sm text-red-500 mt-2">{message}</p>}
    </div>
  );
};

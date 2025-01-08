import React, { useState } from 'react'; // Removed unused 'PublicKey'
import authService from '../services/authService'; // Ensure this is a default import

export const Auth: React.FC = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const connectWallet = async () => {
    try {
      if (!window.solana) {
        return setMessage('Please install a Solana wallet like Phantom.');
      }

      const response = await window.solana.connect();
      const publicKey = response.publicKey.toString();
      setWalletAddress(publicKey);

      // Request a nonce from the backend
      const { nonce } = await authService.getNonce(publicKey);

      // Check if signMessage exists before invoking it
      if (!window.solana.signMessage) {
        return setMessage('Wallet does not support message signing.');
      }

      // Sign the nonce
      const encodedMessage = new TextEncoder().encode(nonce);
      const signedMessage = await window.solana.signMessage(encodedMessage, 'utf8');
      const signature = signedMessage.signature.toString();

      // Verify the signature
      const token = await authService.verifySignature(publicKey, signature);

      localStorage.setItem('authToken', token);
      setIsAuthenticated(true);
      setMessage('Logged in successfully!');
    } catch (error) {
      console.error(error);
      setMessage('Login failed. Please try again.');
    }
  };

  const disconnectWallet = () => {
    localStorage.removeItem('authToken');
    setWalletAddress(null);
    setIsAuthenticated(false);
    setMessage('Disconnected.');
  };

  return (
    <div className="flex flex-col items-center gap-6 bg-gradient-to-r from-[#0a1f1a] to-[#1a2b22] p-6 rounded-xl glass-card w-full max-w-md shadow-lg">
      <h2 className="text-xl text-[#14F195] font-semibold">
        {isAuthenticated ? 'Wallet Connected' : 'Connect Wallet'}
      </h2>
      <div className="text-center text-sm text-[#14F195]/80">
        {walletAddress
          ? `Connected Wallet: ${walletAddress.substring(0, 6)}...${walletAddress.substring(
              walletAddress.length - 4
            )}`
          : 'No wallet connected'}
      </div>
      {!isAuthenticated ? (
        <button
          onClick={connectWallet}
          className="px-4 py-2 text-sm font-medium text-[#0a1f1a] bg-[#14F195] rounded-lg hover:bg-[#0ff1b5] transition-all"
        >
          Connect Wallet
        </button>
      ) : (
        <button
          onClick={disconnectWallet}
          className="px-4 py-2 text-sm font-medium text-[#0a1f1a] bg-red-500 rounded-lg hover:bg-red-600 transition-all"
        >
          Disconnect Wallet
        </button>
      )}
      {message && (
        <p className="text-sm text-[#14F195] mt-4 bg-[#0a1f1a] p-2 rounded-lg border border-[#14F195]/20">
          {message}
        </p>
      )}
    </div>
  );
};

interface Window {
    solana?: {
      connect: () => Promise<{ publicKey: string }>;
      isPhantom?: boolean;
      signMessage?: (message: Uint8Array, encoding: string) => Promise<{ signature: Uint8Array }>;
    };
  }
  
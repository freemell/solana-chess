import { Keypair } from '@solana/web3.js';
import { mnemonicToSeedSync } from 'bip39';
import dotenv from 'dotenv';

dotenv.config();

const SEED_PHRASE = process.env.SEED_PHRASE;
if (!SEED_PHRASE) {
  throw new Error('SEED_PHRASE is not set in the environment variables');
}

export const deriveKeypairFromSeed = () => {
  try {
    // Generate a seed from the seed phrase
    const seed = mnemonicToSeedSync(SEED_PHRASE, ''); // Optional password: ''

    // Derive the Keypair from the seed (first 32 bytes of the seed)
    const keypair = Keypair.fromSeed(seed.slice(0, 32));

    console.log('Wallet Address:', keypair.publicKey.toBase58()); // Log the wallet address for verification
    return keypair;
  } catch (error) {
    console.error('Failed to derive keypair:', error);
    throw new Error('Invalid seed phrase');
  }
};

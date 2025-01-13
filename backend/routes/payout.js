import express from 'express';
import { transferSOL } from '../utils/transferSOL.js';
import { houseWallet } from '../utils/wallet.js';
import { PublicKey } from '@solana/web3.js';

const router = express.Router();
const bets = new Map(); // Temporary bet storage

router.post('/payout', async (req, res) => {
  const { publicKey, result } = req.body;

  if (!publicKey || !result) {
    return res.status(400).json({ error: 'Public key and result are required' });
  }

  const betDetails = bets.get(publicKey);
  if (!betDetails) {
    return res.status(400).json({ error: 'No active bet found for this user' });
  }

  const { stake } = betDetails;

  try {
    if (result === 'win') {
      // Player wins: Transfer stake from house wallet to player wallet
      console.log(`Transferring ${stake} SOL to player wallet: ${publicKey}`);
      await transferSOL(houseWallet, publicKey, stake);

      res.json({ message: `You won! ${stake} SOL has been sent to your wallet.` });
    } else if (result === 'loss') {
      // Player loses: Stake is kept in the house wallet
      console.log(`Player lost. ${stake} SOL retained in house wallet.`);
      res.json({ message: `You lost! Stake of ${stake} SOL has been retained by the house.` });
    } else {
      return res.status(400).json({ error: 'Invalid result. Must be "win" or "loss".' });
    }

    // Clear the bet
    bets.delete(publicKey);
  } catch (error) {
    console.error('Payout error:', error);
    res.status(500).json({ error: 'Failed to process payout' });
  }
});

export default router;

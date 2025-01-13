import express from 'express';
import { transferSOL } from '../utils/transferSOL.js';
import { houseWallet } from '../utils/wallet.js';

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
  let payout = 0;

  try {
    if (result === 'win') {
      // Player wins: Transfer the stake from the house wallet to the player
      console.log(`Processing win for ${publicKey}. Payout: ${stake} SOL.`);
      await transferSOL(houseWallet, publicKey, stake);
      payout = stake;
      res.json({ message: `You won! Payout: ${payout} SOL.`, payout });
    } else if (result === 'loss') {
      // Player loses: The stake is retained by the house wallet
      console.log(`Processing loss for ${publicKey}. Stake retained by house: ${stake} SOL.`);
      res.json({ message: 'You lost! Better luck next time.', payout });
    } else {
      return res.status(400).json({ error: 'Invalid result. Must be "win" or "loss".' });
    }

    // Clear the bet
    bets.delete(publicKey);
  } catch (error) {
    console.error(`Error processing payout for ${publicKey}:`, error);
    res.status(500).json({ error: 'Failed to process payout. Please try again later.' });
  }
});

export default router;

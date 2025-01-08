import express from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nacl from 'tweetnacl';
import bs58 from 'bs58';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const users = new Map(); // Temporary storage, replace with database in production

// Generate nonce
router.post('/nonce', (req, res) => {
  const { publicKey } = req.body;
  if (!publicKey) {
    return res.status(400).json({ error: 'Public key is required' });
  }

  const nonce = crypto.randomBytes(16).toString('hex');
  users.set(publicKey, nonce);

  res.json({ nonce });
});

// Verify signature
router.post('/verify', (req, res) => {
  const { publicKey, signature } = req.body;
  if (!publicKey || !signature) {
    return res.status(400).json({ error: 'Public key and signature are required' });
  }

  const nonce = users.get(publicKey);
  if (!nonce) {
    return res.status(400).json({ error: 'Nonce not found. Please request a new one.' });
  }

  const message = new TextEncoder().encode(nonce);
  const isValid = nacl.sign.detached.verify(
    message,
    bs58.decode(signature),
    bs58.decode(publicKey)
  );

  if (!isValid) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  // Generate a JWT
  const token = jwt.sign({ publicKey }, JWT_SECRET, { expiresIn: '1h' });
  users.delete(publicKey);

  res.json({ token });
});

export default router;

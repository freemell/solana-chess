import { Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';

const SOLANA_NETWORK = 'https://api.mainnet-beta.solana.com'; // Change to devnet/testnet for testing
const connection = new Connection(SOLANA_NETWORK, 'confirmed');

export const transferSOL = async (fromWallet, toWalletAddress, amount) => {
  try {
    console.log(`Initiating transfer of ${amount} SOL from ${fromWallet.publicKey.toBase58()} to ${toWalletAddress}`);

    // Convert the amount from SOL to lamports
    const lamports = Math.round(amount * 1e9);

    // Create the transaction
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: fromWallet.publicKey,
        toPubkey: new PublicKey(toWalletAddress),
        lamports,
      })
    );

    // Sign and send the transaction
    const signature = await connection.sendTransaction(transaction, [fromWallet]);

    // Confirm the transaction
    await connection.confirmTransaction(signature, 'confirmed');

    console.log(`Transaction successful: ${signature}`);
    return {
      success: true,
      signature,
      message: `Transaction of ${amount} SOL to ${toWalletAddress} was successful.`,
    };
  } catch (error) {
    console.error('Transaction failed:', error);

    return {
      success: false,
      message: `Transaction failed: ${error.message}`,
    };
  }
};

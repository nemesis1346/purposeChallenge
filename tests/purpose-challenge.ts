import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { Keypair, PublicKey, SystemProgram } from '@solana/web3.js';
import { expect } from 'chai';
import { PurposeChallenge } from '../target/types/PurposeChallenge';
import fs from 'fs';

describe('purpose_challenge', () => {

   // Load test wallet (alternative to provider.wallet)
   const userKeypair = Keypair.fromSecretKey(
    new Uint8Array(JSON.parse(fs.readFileSync('user.json', 'utf-8')))
  );

  // Configure the client to use the local cluster
  const provider = new anchor.AnchorProvider(
    new anchor.web3.Connection("http://localhost:8899"),
    new anchor.Wallet(userKeypair),
    { commitment: "confirmed" }
  );
  anchor.setProvider(provider);

  const program = anchor.workspace.PurposeChallenge as Program<PurposeChallenge>;
  console.log('Program Id: ', program.programId)
  

  it('Stores and retrieves a name', async () => {
    // Generate PDA for the name account
    const [nameAccountPDA] = PublicKey.findProgramAddressSync(
      [
          Buffer.from("name"),
          provider.wallet.publicKey.toBuffer()
      ],
      program.programId
  );
      
    console.log('PDA is valid:', !PublicKey.isOnCurve(nameAccountPDA.toBytes()));

    // Verify balance
    const balance = await provider.connection.getBalance(userKeypair.publicKey);
    console.log(`Initial balance: ${balance / anchor.web3.LAMPORTS_PER_SOL} SOL`);

    // Test data
    const testName = "Alice";

   // Check if account exists
    const accountInfo = await provider.connection.getAccountInfo(nameAccountPDA);
    
    if (!accountInfo) {
      await program.methods.storeName("Alice")
        .accounts({
          nameAccount: nameAccountPDA,
          user: userKeypair.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
    } else {
      console.log("Account already exists, skipping initialization");
    }
    console.log('passed first method')

    // Verify the stored name
    const storedName = await program.methods.getName()
      .accounts({ nameAccount: nameAccountPDA })
      .view();

    expect(storedName).to.equal(accountInfo ? "Alice" : "");
    });

});
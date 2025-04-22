import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { Keypair, SystemProgram } from '@solana/web3.js';
import fs from 'fs';
import { PurposeChallenge } from './target/types/purpose_challenge';

// Load wallet
const walletKeypair = Keypair.fromSecretKey(
  new Uint8Array(JSON.parse(fs.readFileSync('user.json', 'utf-8')))
);

//check provider
console.log("Cluster:", anchor.getProvider().connection.rpcEndpoint);


// Configure provider
const provider = anchor.AnchorProvider.env();
anchor.setProvider(provider);

// Load program
const programId = new anchor.web3.PublicKey("9aTf53g8P77aop423jgNCL7hapZ2drU7bnPJxuuudZqe");
const program = anchor.workspace.PurposeChallenge as Program<PurposeChallenge>;

async function main() {
  // Generate PDA for name account
  const [nameAccountPDA] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("name"), provider.wallet.publicKey.toBuffer()],
    program.programId
  );

  // Store name
  console.log("Storing name...");
  await program.methods.storeName("Alice")
    .accounts({
      nameAccount: nameAccountPDA,
      user: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .rpc();

  // Get name
  console.log("Retrieving name...");
  const name = await program.methods.getName()
    .accounts({ nameAccount: nameAccountPDA })
    .view();

  console.log("Stored name:", name);
}

main().catch(console.error);
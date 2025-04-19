import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { PublicKey, Keypair, SystemProgram } from '@solana/web3.js';
import { NameStorage } from './target/types/name_storage';
import fs from 'fs';



// Load your wallet from user.json
const walletKeypair = Keypair.fromSecretKey(
    new Uint8Array(JSON.parse(fs.readFileSync('user.json', 'utf-8')))
  );

  // Manually configure provider for devnet
const connection = new anchor.web3.Connection(
    'https://api.devnet.solana.com',
    'confirmed'
  );
  
const wallet = new anchor.Wallet(walletKeypair);

const provider = new anchor.AnchorProvider(
    connection,
    new anchor.Wallet(walletKeypair),
    { commitment: 'confirmed' }
  );
anchor.setProvider(provider);


// Program ID - same as in your Rust program
const programId = new PublicKey("9aTf53g8P77aop423jgNCL7hapZ2drU7bnPJxuuudZqe");


// Create the program client
const program = anchor.workspace.NameStorage as Program<NameStorage>;

console.log('Program: ', program)

async function main() {
  console.log("Wallet public key:", wallet.publicKey.toString());

  // Generate a PDA for the name account
  const [nameAccountPDA] = await PublicKey.findProgramAddressSync(
    [Buffer.from("name"), wallet.publicKey.toBuffer()],
    programId
  );

  console.log("Name account PDA:", nameAccountPDA.toString());

  // Store a name
  try {
    console.log("Storing name...");
    const tx = await program.methods.storeName("Alice")
      .accounts({
        nameAccount: nameAccountPDA,
        user: walletKeypair.publicKey,
        systemProgram: SystemProgram.programId
      })
      .rpc();
    
    console.log("Transaction successful! Signature:", tx);

    // Fetch the stored name
    const nameAccount = await program.account.nameAccount.fetch(nameAccountPDA);
    console.log("Stored name:", nameAccount.name);
  } catch (error) {
    console.error("Error:", error);
  }
}

main().catch(console.error);
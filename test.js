const anchor = require('@coral-xyz/anchor');
const { Keypair, PublicKey, SystemProgram, LAMPORTS_PER_SOL } = require('@solana/web3.js');
const fs = require('fs').promises;

async function main() {
  try {
    // Load test wallet
    const userKeypair = Keypair.fromSecretKey(
      new Uint8Array(JSON.parse(await fs.readFile('user.json', 'utf-8')))
    );

    // Configure the client to use Solana Devnet
    const provider = new anchor.AnchorProvider(
      new anchor.web3.Connection('https://api.devnet.solana.com', 'confirmed'),
      new anchor.Wallet(userKeypair),
      { commitment: 'confirmed' }
    );
    anchor.setProvider(provider);

    // Load the program (assumes IDL is available in workspace or compiled)
    const program = anchor.workspace.PurposeChallenge;
    if (!program) {
      throw new Error('Program not found. Ensure the program is compiled and IDL is available.');
    }
    console.log('Program ID:', program.programId.toString());

    // Request airdrop for fake SOL if balance is low
    const balance = await provider.connection.getBalance(userKeypair.publicKey);
    console.log(`Initial balance: ${balance / LAMPORTS_PER_SOL} SOL`);
    if (balance < LAMPORTS_PER_SOL) {
      console.log('Requesting airdrop of 1 SOL...');
      const signature = await provider.connection.requestAirdrop(
        userKeypair.publicKey,
        LAMPORTS_PER_SOL
      );
      await provider.connection.confirmTransaction(signature, 'confirmed');
      const newBalance = await provider.connection.getBalance(userKeypair.publicKey);
      console.log(`New balance after airdrop: ${newBalance / LAMPORTS_PER_SOL} SOL`);
    }

    // Generate PDA for the name account
    const [nameAccountPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from('name'), userKeypair.publicKey.toBuffer()],
      program.programId
    );
    console.log('Name Account PDA:', nameAccountPDA.toString());
    console.log('PDA is valid:', !PublicKey.isOnCurve(nameAccountPDA.toBytes()));

    // Store name
    console.log('Storing name "Alice"...');
    await program.methods
      .storeName('Alice')
      .accounts({
        nameAccount: nameAccountPDA,
        user: userKeypair.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
    console.log('Name stored successfully.');

    // Retrieve and verify the stored name
    console.log('Retrieving stored name...');
    const storedName = await program.methods
      .getName()
      .accounts({ nameAccount: nameAccountPDA })
      .view();
    console.log('Stored name:', storedName);

    if (storedName === 'Alice') {
      console.log('Test passed: Stored name matches expected value "Alice".');
    } else {
      throw new Error(`Test failed: Expected "Alice", but got "${storedName}".`);
    }
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main().then(() => {
  console.log('Test script completed.');
  process.exit(0);
}).catch((error) => {
  console.error('Unhandled error:', error.message);
  process.exit(1);
});
### SETUP
```
nvm install node
yarn install
```
### Installed Versions:
```
Rust: rustc 1.86.0 (05f9846f8 2025-03-31)
Solana CLI: solana-cli 2.1.21 (src:8a085eeb; feat:1416569292, client:Agave)
Anchor CLI: anchor-cli 0.31.0
Node.js: v23.11.0
Yarn: 1.22.22
```

### Troubleshooting


### Identifiers:
```
Program Id: 3qJ7i6VosNpuJieRHAywaLjEo8JacU8RSkhxuuG3tPq3
User Account:FRgf258GiRydex8LCehv1fJzMz9ibgM7LJcR7Uoe1K7v
```

# TEST LOCALLY

This test is  going to use the test/purpose-challenge.ts file to do a local test with a local solana instance


### 1. fund some solana to the current user.json wallet:
```
solana airdrop 10 $(solana-keygen pubkey user.json)
```

### 2. Build the program
anchor 0.31.0 has an anchor build bug, better us this command(further explaining):
```
RUSTUP_TOOLCHAIN=nightly-2025-04-14 anchor build
```
### 3. *Important: in a separate terminal run an instance of solana locally:
```
solana config set --url localhost  # local config
solana-test-validator --reset --bpf-program 3qJ7i6VosNpuJieRHAywaLjEo8JacU8RSkhxuuG3tPq3 target/deploy/purpose_challenge.so
```

### 4. run the test locally:
*Important: 
```
RUSTUP_TOOLCHAIN=nightly-2025-04-14 anchor test 
```


# TEST IN DEVNET

This test is  going to actually test it in the devnet

### 1. Set the devnet configuration:

```
solana config set --url devnet
```

### 2. fund some solana to the current user.json wallet:

```
solana airdrop 2 FRgf258GiRydex8LCehv1fJzMz9ibgM7LJcR7Uoe1K7v --url devnet
 ```
### 3. Build the program if you didnt before

```
RUSTUP_TOOLCHAIN=nightly-2025-04-14 anchor build
```

### 4. Deploy the program, make sure that you configured the devnet before

```
RUSTUP_TOOLCHAIN=nightly-2025-04-14 anchor deploy
```

### 5. Verify that the program is in the devnet

```
solana program show 3qJ7i6VosNpuJieRHAywaLjEo8JacU8RSkhxuuG3tPq3
```

* Additionally you can check the blockchain:
https://explorer.solana.com/tx/3gbRyihbK9fniJyqoDLNrfbarrGFaxnkm87eobhrVUDdhPHYh9eRHFZmvpXVfqR9aaTUkaC3mwGaivMgh1FkAs6A?cluster=devnet

### 6. Test the script
```
node test.js
```
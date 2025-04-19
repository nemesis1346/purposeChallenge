### Installed Versions:
```
Rust: rustc 1.86.0 (05f9846f8 2025-03-31)
Solana CLI: solana-cli 2.1.21 (src:8a085eeb; feat:1416569292, client:Agave)
Anchor CLI: anchor-cli 0.31.0
Node.js: v23.11.0
Yarn: 1.22.22
```

### ntroubleshooting
ancho 0.31.0 has an anchor build bug, better us this command:

```
RUSTUP_TOOLCHAIN=nightly-2025-04-14 anchor build
```

### Identifiers:
```
Program Id: 9aTf53g8P77aop423jgNCL7hapZ2drU7bnPJxuuudZqe

Signature: 57RYVum1xbS9GqcM2H7o5gW1mhd46hUJGY8Fvpvosg8PbNTS6mPwr3Hu3mmiS9Jn6aohaoEaupC2fdpMeuc3QoBw
```

User Account:H3KnFfpRXkbzqxQ5pG9Mz3KwDjnWa3pGu7HSHJDyBiNc
Name Account:6YV1Up6vvnmUAeyTsaAYQrQQ1FfHqSdiyK47kHTx8uC6

### SETUP
nvm install node
yarn install

### TEST
node test.js